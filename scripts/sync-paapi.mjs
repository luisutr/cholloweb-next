/**
 * sync-paapi.mjs
 *
 * Sincroniza el catálogo de productos desde Amazon PA-API 5.0
 * y actualiza src/data/products.json.
 *
 * Requiere en .env.local (o variables de entorno del sistema/CI):
 *   PAAPI_ACCESS_KEY   → Access Key del programa Amazon Associates
 *   PAAPI_SECRET_KEY   → Secret Key del programa Amazon Associates
 *   NEXT_PUBLIC_AMAZON_TAG_ES → tu tag de afiliado para España
 *
 * Uso:
 *   node scripts/sync-paapi.mjs                 -> incremental por ASIN (recomendado)
 *   node scripts/sync-paapi.mjs --mode=search   -> regenera catálogo por búsquedas
 *   node scripts/sync-paapi.mjs --dry-run       -> muestra cambios sin escribir
 *
 * En GitHub Actions se ejecuta automáticamente cada día (ver
 * .github/workflows/sync-products.yml).
 */

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/* ─── Rutas ────────────────────────────────────────────── */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, "..", "src", "data", "products.json");

/* ─── Variables de entorno ─────────────────────────────── */

// Carga .env.local si existe (en local; en CI vienen de los secrets)
try {
  const envPath = path.join(__dirname, "..", ".env.local");
  const raw = await fs.readFile(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length && !process.env[key.trim()]) {
      process.env[key.trim()] = rest.join("=").trim();
    }
  }
} catch {
  // No hay .env.local → usamos las vars del sistema
}

const ACCESS_KEY = process.env.PAAPI_ACCESS_KEY;
const SECRET_KEY = process.env.PAAPI_SECRET_KEY;
const PARTNER_TAG =
  process.env.NEXT_PUBLIC_AMAZON_TAG_ES || process.env.NEXT_PUBLIC_AMAZON_TAG || "";

const DRY_RUN = process.argv.includes("--dry-run");
const MODE_ARG = process.argv.find((arg) => arg.startsWith("--mode="));
const SYNC_MODE = MODE_ARG ? MODE_ARG.replace("--mode=", "") : "asin";

/* ─── Configuración PA-API ─────────────────────────────── */

const HOST = "webservices.amazon.es";
const REGION = "eu-west-1";
const SERVICE = "ProductAdvertisingAPI";
const PATH_SEARCH = "/paapi5/searchitems";
const TARGET_SEARCH = "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems";
const PATH_GET_ITEMS = "/paapi5/getitems";
const TARGET_GET_ITEMS = "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems";

/* ─── Consultas por categoría/plataforma ───────────────── */

/**
 * Cada entrada define:
 *  - keywords:       términos de búsqueda enviados a la API
 *  - searchIndex:    categoría de Amazon (VideoGames, Electronics…)
 *  - platformFamily: "playstation" | "xbox" | "nintendo" | "multi"
 *  - generation:     slug de generación (ps5, ps4, xbox-series, switch…) o null
 *  - category:       "consolas" | "videojuegos" | "accesorios"
 *  - maxItems:       máximo de productos a traer (1-10, límite de PA-API)
 */
const SEARCH_QUERIES = [
  // ── PlayStation ──
  { keywords: "PlayStation 5 consola",        searchIndex: "VideoGames", platformFamily: "playstation", generation: "ps5",  category: "consolas",    maxItems: 5 },
  { keywords: "videojuegos PS5",               searchIndex: "VideoGames", platformFamily: "playstation", generation: "ps5",  category: "videojuegos", maxItems: 8 },
  { keywords: "accesorios mando PS5",          searchIndex: "VideoGames", platformFamily: "playstation", generation: "ps5",  category: "accesorios",  maxItems: 5 },
  { keywords: "PlayStation 4 consola",         searchIndex: "VideoGames", platformFamily: "playstation", generation: "ps4",  category: "consolas",    maxItems: 4 },
  { keywords: "videojuegos PS4",               searchIndex: "VideoGames", platformFamily: "playstation", generation: "ps4",  category: "videojuegos", maxItems: 6 },
  { keywords: "accesorios mando PS4",          searchIndex: "VideoGames", platformFamily: "playstation", generation: "ps4",  category: "accesorios",  maxItems: 4 },
  { keywords: "PlayStation 3 consola",         searchIndex: "VideoGames", platformFamily: "playstation", generation: "ps3",  category: "consolas",    maxItems: 3 },
  { keywords: "videojuegos PS3",               searchIndex: "VideoGames", platformFamily: "playstation", generation: "ps3",  category: "videojuegos", maxItems: 5 },

  // ── Xbox ──
  { keywords: "Xbox Series X consola",         searchIndex: "VideoGames", platformFamily: "xbox", generation: "xbox-series", category: "consolas",    maxItems: 5 },
  { keywords: "videojuegos Xbox Series",       searchIndex: "VideoGames", platformFamily: "xbox", generation: "xbox-series", category: "videojuegos", maxItems: 8 },
  { keywords: "mando Xbox Series",             searchIndex: "VideoGames", platformFamily: "xbox", generation: "xbox-series", category: "accesorios",  maxItems: 4 },
  { keywords: "Xbox One consola",              searchIndex: "VideoGames", platformFamily: "xbox", generation: "xbox-one",    category: "consolas",    maxItems: 3 },
  { keywords: "videojuegos Xbox One",          searchIndex: "VideoGames", platformFamily: "xbox", generation: "xbox-one",    category: "videojuegos", maxItems: 5 },
  { keywords: "Xbox 360 consola",              searchIndex: "VideoGames", platformFamily: "xbox", generation: "xbox-360",    category: "consolas",    maxItems: 3 },
  { keywords: "videojuegos Xbox 360",          searchIndex: "VideoGames", platformFamily: "xbox", generation: "xbox-360",    category: "videojuegos", maxItems: 4 },

  // ── Nintendo ──
  { keywords: "Nintendo Switch OLED consola",  searchIndex: "VideoGames", platformFamily: "nintendo", generation: "switch-oled", category: "consolas",    maxItems: 4 },
  { keywords: "Nintendo Switch consola",       searchIndex: "VideoGames", platformFamily: "nintendo", generation: "switch",      category: "consolas",    maxItems: 4 },
  { keywords: "videojuegos Nintendo Switch",   searchIndex: "VideoGames", platformFamily: "nintendo", generation: "switch",      category: "videojuegos", maxItems: 8 },
  { keywords: "accesorios Nintendo Switch",    searchIndex: "VideoGames", platformFamily: "nintendo", generation: "switch",      category: "accesorios",  maxItems: 5 },
];

/* ─── AWS4 Signing ─────────────────────────────────────── */

function sha256Hex(data) {
  return crypto.createHash("sha256").update(data, "utf8").digest("hex");
}

function hmacSha256(key, data, outputEncoding = "hex") {
  return crypto.createHmac("sha256", key).update(data).digest(outputEncoding);
}

function getSigningKey(secretKey, dateStamp) {
  const kDate    = hmacSha256(Buffer.from("AWS4" + secretKey, "utf8"), dateStamp, "binary");
  const kRegion  = hmacSha256(Buffer.from(kDate, "binary"), REGION, "binary");
  const kService = hmacSha256(Buffer.from(kRegion, "binary"), SERVICE, "binary");
  return hmacSha256(Buffer.from(kService, "binary"), "aws4_request", "binary");
}

function buildAuthHeaders(body, requestPath, requestTarget) {
  const now = new Date();
  const amzDate  = now.toISOString().replace(/[:\-]|\.\d{3}/g, "").slice(0, 15) + "Z";
  const dateStamp = amzDate.slice(0, 8);

  const payloadHash = sha256Hex(body);

  // Cabeceras canónicas (orden alfabético estricto)
  const canonicalHeaders =
    `content-encoding:amz-1.0\n` +
    `content-type:application/json; charset=utf-8\n` +
    `host:${HOST}\n` +
    `x-amz-date:${amzDate}\n` +
    `x-amz-target:${requestTarget}\n`;

  const signedHeaders = "content-encoding;content-type;host;x-amz-date;x-amz-target";

  const canonicalRequest = [
    "POST",
    requestPath,
    "",             // query string vacío
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const signingKey = getSigningKey(SECRET_KEY, dateStamp);
  const signature  = hmacSha256(Buffer.from(signingKey, "binary"), stringToSign);

  return {
    "Authorization":      `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    "Content-Encoding":   "amz-1.0",
    "Content-Type":       "application/json; charset=utf-8",
    "Host":               HOST,
    "X-Amz-Date":         amzDate,
    "X-Amz-Target":       requestTarget,
  };
}

/* ─── Llamada a la API ─────────────────────────────────── */

async function paapiPost({ requestPath, requestTarget, payload }) {
  const body = JSON.stringify(payload);
  const headers = buildAuthHeaders(body, requestPath, requestTarget);

  const res = await fetch(`https://${HOST}${requestPath}`, {
    method: "POST",
    headers,
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PA-API ${res.status}: ${text}`);
  }

  return res.json();
}

async function searchItems(query) {
  const data = await paapiPost({
    requestPath: PATH_SEARCH,
    requestTarget: TARGET_SEARCH,
    payload: {
    Keywords:      query.keywords,
    SearchIndex:   query.searchIndex,
    PartnerTag:    PARTNER_TAG,
    PartnerType:   "Associates",
    Marketplace:   "www.amazon.es",
    ItemCount:     query.maxItems ?? 5,
    Resources: [
      "Images.Primary.Large",
      "ItemInfo.Title",
      "Offers.Listings.Price",
      "Offers.Listings.Condition",
      "Offers.Listings.SavingBasis",
    ],
    },
  });

  return data?.SearchResult?.Items ?? [];
}

async function getItemsByAsins(asins) {
  const data = await paapiPost({
    requestPath: PATH_GET_ITEMS,
    requestTarget: TARGET_GET_ITEMS,
    payload: {
      ItemIds: asins,
      ItemIdType: "ASIN",
      PartnerTag: PARTNER_TAG,
      PartnerType: "Associates",
      Marketplace: "www.amazon.es",
      Resources: [
        "Images.Primary.Large",
        "ItemInfo.Title",
        "Offers.Listings.Price",
        "Offers.Listings.Condition",
        "Offers.Listings.SavingBasis",
      ],
    },
  });

  return data?.ItemsResult?.Items ?? [];
}

/* ─── Mapeo PA-API → Product ───────────────────────────── */

function conditionFromApi(value = "New") {
  const v = value.toLowerCase();
  if (v === "new")                    return "nuevo";
  if (v.includes("refurbish") || v.includes("renewed")) return "reacondicionado";
  return "segunda-mano";
}

function platformLabel(platformFamily, generation) {
  const labels = {
    "playstation/ps5":         "PS5",
    "playstation/ps4":         "PS4",
    "playstation/ps3":         "PS3",
    "xbox/xbox-series":        "Xbox Series X/S",
    "xbox/xbox-one":           "Xbox One",
    "xbox/xbox-360":           "Xbox 360",
    "nintendo/switch-oled":    "Nintendo Switch OLED",
    "nintendo/switch":         "Nintendo Switch",
  };
  return labels[`${platformFamily}/${generation}`] ?? platformFamily;
}

function mapItem(item, query) {
  const asin      = item.ASIN;
  const title     = item.ItemInfo?.Title?.DisplayValue ?? "Producto Amazon";
  // Si PA-API devuelve imagen, usarla; si no, fallback por ASIN directo
  const imageUrl  = item.Images?.Primary?.Large?.URL ??
                    `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SL300_.jpg`;
  const listing   = item.Offers?.Listings?.[0];
  const price     = listing?.Price?.Amount ?? 0;
  const oldPrice  = listing?.SavingBasis?.Amount;
  const condition = conditionFromApi(listing?.Condition?.Value);

  return {
    id:             asin,
    title,
    category:       query.category,
    platformFamily: query.platformFamily,
    generation:     query.generation ?? null,
    platformLabel:  platformLabel(query.platformFamily, query.generation),
    condition,
    price,
    ...(oldPrice && oldPrice > price ? { oldPrice } : {}),
    imageUrl,
    amazonUrl:      `https://www.amazon.es/dp/${asin}`,
  };
}

function isLikelyAsin(value) {
  return typeof value === "string" && /^[A-Z0-9]{10}$/.test(value.toUpperCase());
}

function chunkArray(values, size) {
  const chunks = [];
  for (let i = 0; i < values.length; i += size) {
    chunks.push(values.slice(i, i + size));
  }
  return chunks;
}

function readAsinFromProduct(product) {
  if (isLikelyAsin(product?.id)) {
    return product.id.toUpperCase();
  }
  const fromUrl = product?.amazonUrl?.match(/\/dp\/([A-Z0-9]{10})/i)?.[1];
  return fromUrl ? fromUrl.toUpperCase() : null;
}

function mergeIncrementalProduct(existingProduct, apiItem) {
  const asin = apiItem?.ASIN ?? readAsinFromProduct(existingProduct);
  const title = apiItem?.ItemInfo?.Title?.DisplayValue;
  const imageUrl = apiItem?.Images?.Primary?.Large?.URL;
  const listing = apiItem?.Offers?.Listings?.[0];
  const price = listing?.Price?.Amount;
  const oldPrice = listing?.SavingBasis?.Amount;
  const condition = listing?.Condition?.Value ? conditionFromApi(listing.Condition.Value) : undefined;

  const merged = {
    ...existingProduct,
    id: asin ?? existingProduct.id,
    ...(title ? { title } : {}),
    ...(imageUrl ? { imageUrl } : {}),
    ...(condition ? { condition } : {}),
    ...(typeof price === "number" ? { price } : {}),
    amazonUrl: asin ? `https://www.amazon.es/dp/${asin}` : existingProduct.amazonUrl,
  };

  if (typeof oldPrice === "number" && typeof merged.price === "number" && oldPrice > merged.price) {
    merged.oldPrice = oldPrice;
  } else {
    delete merged.oldPrice;
  }

  return merged;
}

/* ─── Ejecución principal ──────────────────────────────── */

async function run() {
  if (!ACCESS_KEY || !SECRET_KEY) {
    console.error(
      "❌  Faltan credenciales PA-API.\n" +
      "   Añade PAAPI_ACCESS_KEY y PAAPI_SECRET_KEY a .env.local o a los secrets de GitHub."
    );
    process.exitCode = 1;
    return;
  }

  if (!PARTNER_TAG) {
    console.error("❌  Falta NEXT_PUBLIC_AMAZON_TAG_ES en .env.local");
    process.exitCode = 1;
    return;
  }

  const rawCatalog = await fs.readFile(CATALOG_PATH, "utf8");
  const existingCatalog = JSON.parse(rawCatalog);

  let products = [];
  let source = "paapi5";

  if (SYNC_MODE === "asin") {
    const productsInCatalog = existingCatalog?.products ?? [];
    const asinToProduct = new Map();
    const asinOrder = [];

    for (const product of productsInCatalog) {
      const asin = readAsinFromProduct(product);
      if (!asin) continue;
      if (!asinToProduct.has(asin)) {
        asinToProduct.set(asin, product);
        asinOrder.push(asin);
      }
    }

    if (!asinOrder.length) {
      console.warn("⚠️  No se encontraron ASIN válidos en el catálogo. Cambio automático a modo search.");
    } else {
      console.log(`🔄  Iniciando sync incremental por ASIN (${asinOrder.length} ASINs)…`);
      const chunks = chunkArray(asinOrder, 10);
      const apiByAsin = new Map();

      for (const chunk of chunks) {
        try {
          console.log(`   📦  GetItems batch (${chunk.length} ASINs)`);
          const items = await getItemsByAsins(chunk);
          for (const item of items) {
            if (item?.ASIN) apiByAsin.set(item.ASIN.toUpperCase(), item);
          }
          // Pausa para no superar el rate-limit de PA-API (1 req/s)
          await new Promise((r) => setTimeout(r, 1100));
        } catch (err) {
          console.warn(`   ⚠️  Error en batch ASIN: ${err.message}`);
        }
      }

      let updatedCount = 0;
      let missingCount = 0;

      products = productsInCatalog.map((product) => {
        const asin = readAsinFromProduct(product);
        if (!asin) return product;
        const apiItem = apiByAsin.get(asin);
        if (!apiItem) {
          missingCount += 1;
          return product;
        }
        const merged = mergeIncrementalProduct(product, apiItem);
        if (JSON.stringify(merged) !== JSON.stringify(product)) {
          updatedCount += 1;
        }
        return merged;
      });

      source = "paapi5-asin-incremental";
      console.log(`✅  Incremental completado: ${updatedCount} productos actualizados, ${missingCount} sin respuesta API.`);
    }
  }

  if (!products.length) {
    console.log(`🔄  Iniciando sync PA-API por búsqueda (${SEARCH_QUERIES.length} consultas)…`);
    const fullProducts = [];
    const seen = new Set();

    for (const query of SEARCH_QUERIES) {
      try {
        console.log(`   📦  "${query.keywords}" → ${query.category}/${query.platformFamily}`);
        const items = await searchItems(query);

        for (const item of items) {
          if (!seen.has(item.ASIN)) {
            seen.add(item.ASIN);
            fullProducts.push(mapItem(item, query));
          }
        }

        // Pausa para no superar el rate-limit de PA-API (1 req/s)
        await new Promise((r) => setTimeout(r, 1100));
      } catch (err) {
        console.warn(`   ⚠️  Error en "${query.keywords}": ${err.message}`);
      }
    }

    products = fullProducts;
    source = "paapi5-search";
    console.log(`✅  ${products.length} productos obtenidos por búsqueda.`);
  }

  const catalog = {
    ...existingCatalog,
    updatedAt: new Date().toISOString(),
    source,
    products,
  };

  if (DRY_RUN) {
    console.log(`\n📋  DRY-RUN (${source}) — muestra de los 3 primeros productos:`);
    console.log(JSON.stringify(products.slice(0, 3), null, 2));
    console.log("\n⚠️  No se ha escrito nada en products.json (--dry-run activo).");
    return;
  }

  await fs.writeFile(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  console.log(`💾  Catálogo guardado en src/data/products.json`);
}

run().catch((err) => {
  console.error("❌  Sync fallido:", err);
  process.exitCode = 1;
});
