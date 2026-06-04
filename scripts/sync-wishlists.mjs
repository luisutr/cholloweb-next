/**
 * sync-wishlists.mjs
 *
 * Sincroniza el catálogo de productos raspando directamente las listas de deseos públicas de Amazon.
 * No requiere credenciales de PA-API de Amazon.
 *
 * Uso:
 *   node scripts/sync-wishlists.mjs            -> ejecuta la sincronización real
 *   node scripts/sync-wishlists.mjs --dry-run  -> simulación (muestra cambios sin escribir)
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, "..", "src", "data", "products.json");

const DRY_RUN = process.argv.includes("--dry-run");

// Configuración de las listas públicas de deseos de Amazon
const WISHLIST_CONFIGS = {
  "CPRFS7LXKV7S": {
    platformFamily: "evercade",
    generation: "evercade-handheld",
    platformLabel: "Evercade",
    category: "videojuegos",
  },
  "8R65F9HNLJL5": {
    platformFamily: "multi",
    generation: null,
    platformLabel: "Multi",
    category: "figuras",
  },
  "3ROCG3OI6W21F": {
    platformFamily: "multi",
    generation: null,
    platformLabel: "Multi",
    category: "peliculas",
  },
  "IDEJ96JDJXX4": {
    platformFamily: "playstation",
    generation: "ps4",
    platformLabel: "PS4",
    category: "videojuegos",
  },
  "8Y76I3PT7NYP": {
    platformFamily: "playstation",
    generation: "ps5",
    platformLabel: "PS5",
    category: "videojuegos",
  },
  "2NIEK1QPXSEB6": {
    platformFamily: "xbox",
    generation: "xbox-one", // por defecto
    platformLabel: "Xbox One",
    category: "videojuegos",
  }
};

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "es-ES,es;q=0.9",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
};

// Función para clasificar y enriquecer producto en base a reglas de texto/título
function refineProductMetadata(product, wishlistConfig) {
  const titleLower = product.title.toLowerCase();
  
  let category = wishlistConfig.category;
  let platformFamily = wishlistConfig.platformFamily;
  let generation = wishlistConfig.generation;
  let platformLabel = wishlistConfig.platformLabel;
  
  // 1. Refinar categoría para videojuegos/consolas/accesorios
  if (category === "videojuegos" || category === "consolas" || category === "accesorios") {
    if (titleLower.includes("consola") || titleLower.includes("console") || titleLower.includes("pack consola") || titleLower.includes("pack de consola")) {
      category = "consolas";
    } else if (
      titleLower.includes("mando") || 
      titleLower.includes("controller") || 
      titleLower.includes("joystick") || 
      titleLower.includes("fight stick") ||
      titleLower.includes("auriculares") ||
      titleLower.includes("headset") ||
      titleLower.includes("cargador") ||
      titleLower.includes("cargadora") ||
      titleLower.includes("funda") ||
      titleLower.includes("estuche") ||
      titleLower.includes("cable") ||
      titleLower.includes("volante")
    ) {
      category = "accesorios";
    } else {
      category = "videojuegos";
    }
  }

  // 2. Refinar plataforma para Xbox (One vs Series X/S)
  if (platformFamily === "xbox") {
    if (
      titleLower.includes("series x") || 
      titleLower.includes("series s") || 
      titleLower.includes("xbox sx") || 
      titleLower.includes("xbox series") ||
      titleLower.includes("xsx")
    ) {
      generation = "xbox-series";
      platformLabel = "Xbox Series X/S";
    } else if (titleLower.includes("360")) {
      generation = "xbox-360";
      platformLabel = "Xbox 360";
    } else {
      generation = "xbox-one";
      platformLabel = "Xbox One";
    }
  }
  
  // 3. Fallback general para productos sin plataforma (películas, figuras, etc.)
  if (category === "peliculas" || category === "figuras") {
    platformFamily = "multi";
    generation = null;
    platformLabel = "Multi";
  }

  return {
    ...product,
    category,
    platformFamily,
    generation,
    platformLabel,
    condition: "nuevo" // por defecto para listas de deseos
  };
}

async function run() {
  console.log("🚀 Iniciando sincronización de listas de deseos de Amazon...");
  
  // Leer catálogo existente
  let catalog = { updatedAt: new Date().toISOString(), source: "manual", products: [] };
  try {
    const raw = await fs.readFile(CATALOG_PATH, "utf8");
    catalog = JSON.parse(raw);
  } catch (err) {
    console.warn("⚠️ No se pudo leer products.json. Creando uno nuevo.", err.message);
  }

  const existingProductsMap = new Map();
  for (const product of catalog.products) {
    existingProductsMap.set(product.id.toUpperCase(), product);
  }

  const scrapedProducts = [];
  const wishlists = Object.keys(WISHLIST_CONFIGS);

  for (const wishlist of wishlists) {
    const config = WISHLIST_CONFIGS[wishlist];
    const url = `https://www.amazon.es/hz/wishlist/ls/${wishlist}`;
    console.log(`\n📥 Descargando lista [${wishlist}] (Default: ${config.platformLabel} / ${config.category})...`);

    try {
      const response = await fetch(url, { headers: HEADERS });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }
      
      const html = await response.text();
      
      // Buscar contenedores de productos
      const itemIds = [];
      const itemContainerRegex = /id="item_([^"]*)"/g;
      let match;
      while ((match = itemContainerRegex.exec(html)) !== null) {
        itemIds.push(match[1]);
      }
      
      console.log(`   🔎 Encontrados ${itemIds.length} contenedores de productos.`);

      let parsedInListCount = 0;

      for (const itemId of itemIds) {
        // Encontrar el bloque del item
        const startRegex = new RegExp(`id="item_${itemId}"`);
        const startMatch = startRegex.exec(html);
        if (!startMatch) continue;
        
        const startIdx = startMatch.index;
        
        // El bloque termina donde empieza el siguiente contenedor o al final del HTML
        const allMatches = [];
        const nextContainerRegex = /id="item_/g;
        let nextMatch;
        while ((nextMatch = nextContainerRegex.exec(html)) !== null) {
          if (nextMatch.index > startIdx) {
            allMatches.push(nextMatch.index);
            break;
          }
        }
        
        const endIdx = allMatches.length > 0 ? allMatches[0] : html.length;
        const block = html.slice(startIdx, endIdx);

        // 1. Extraer ASIN
        let asin = null;
        const asinMatch = /data-csa-c-item-id="([A-Z0-9]{10})"/i.exec(block);
        if (asinMatch) {
          asin = asinMatch[1].toUpperCase();
        } else {
          const dpMatch = /href="\/dp\/([A-Z0-9]{10})/i.exec(block);
          if (dpMatch) {
            asin = dpMatch[1].toUpperCase();
          }
        }
        
        if (!asin) continue;

        // 2. Extraer Título
        let title = "Producto Amazon";
        const titleMatch = new RegExp(`id="itemName_${itemId}"[^>]*title="([^"]*)"`, "i").exec(block);
        if (titleMatch) {
          title = titleMatch[1].trim();
        } else {
          const titleTextMatch = new RegExp(`id="itemName_${itemId}"[^>]*>([^<]+)</a>`, "is").exec(block);
          if (titleTextMatch) {
            title = titleTextMatch[1].trim();
          }
        }
        
        // Decodificar entidades HTML básicas
        title = title
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">");

        // 3. Extraer Precio
        let price = 0.0;
        const priceMatch = new RegExp(`id="itemPrice_${itemId}"[^>]*>.*?<span class="a-offscreen">([^<]+)</span>`, "is").exec(block) ||
                           /<span class="a-price"[^>]*>.*?<span class="a-offscreen">([^<]+)<\/span>/is.exec(block);
        
        if (priceMatch) {
          const priceStr = priceMatch[1].trim();
          const cleanPrice = priceStr.replace("€", "").replace(/\s/g, "").replace(/\xa0/g, "").trim();
          if (cleanPrice) {
            let normalizedPrice = cleanPrice;
            if (normalizedPrice.includes(",")) {
              normalizedPrice = normalizedPrice.replace(/\./g, "").replace(",", ".");
            }
            const parsedPrice = parseFloat(normalizedPrice);
            if (!isNaN(parsedPrice)) {
              price = parsedPrice;
            }
          }
        }

        // 4. Extraer Imagen
        let imageUrl = `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SL300_.jpg`; // fallback
        const imageMatch = /<img[^>]*src="([^"]*)"/i.exec(block);
        if (imageMatch && !imageMatch[1].includes("placeholder")) {
          const originalUrl = imageMatch[1];
          // Limpiar sufijos de imagen pequeña de Amazon
          imageUrl = originalUrl.replace(/\._[A-Z0-9_]+\.jpg$/i, "._SL300_.jpg");
        }

        const rawProduct = {
          id: asin,
          title,
          price,
          imageUrl,
          amazonUrl: `https://www.amazon.es/dp/${asin}`
        };

        // Clasificar y enriquecer según reglas de keywords
        const product = refineProductMetadata(rawProduct, config);
        
        scrapedProducts.push(product);
        parsedInListCount++;
      }

      console.log(`   ✅ Sincronizados y clasificados ${parsedInListCount} productos de la lista.`);

      // Espera de cortesía para no saturar
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (err) {
      console.error(`   ❌ Error al procesar lista ${wishlist}:`, err.message);
    }
  }

  console.log(`\n📊 Procesando resultados finales de sincronización...`);
  console.log(`   Total de productos extraídos del raspado: ${scrapedProducts.length}`);

  let createdCount = 0;
  let updatedCount = 0;
  let priceUpdatedCount = 0;

  const nextProducts = [];

  // 1. Procesar productos raspados
  const processedAsins = new Set();
  
  for (const scraped of scrapedProducts) {
    const asin = scraped.id.toUpperCase();
    if (processedAsins.has(asin)) continue; // evitar duplicados en el mismo proceso
    processedAsins.add(asin);

    const existing = existingProductsMap.get(asin);

    if (existing) {
      // Producto existente: Actualizar propiedades y comparar precios
      const prevPrice = existing.price;
      let oldPrice = existing.oldPrice;

      if (scraped.price > 0) {
        if (prevPrice > 0 && scraped.price < prevPrice) {
          // Descuento detectado! El nuevo precio es menor. Guardar el precio anterior como oldPrice
          oldPrice = prevPrice;
          priceUpdatedCount++;
          console.log(`   🔥 CHOLLO DETECTADO: "${scraped.title}" bajó de ${prevPrice}€ a ${scraped.price}€`);
        } else if (prevPrice > 0 && scraped.price > prevPrice) {
          // El precio ha subido
          if (oldPrice && scraped.price < oldPrice) {
            // Sigue estando más barato que el precio de oferta original de referencia, lo mantenemos
          } else {
            // Ya no es oferta, limpiamos oldPrice
            oldPrice = undefined;
          }
          priceUpdatedCount++;
        }
      } else {
        // Producto temporalmente agotado/sin precio
        if (prevPrice > 0) {
          priceUpdatedCount++;
          console.log(`   ⚠️ Agotado: "${scraped.title}" ya no tiene precio disponible.`);
        }
      }

      const mergedProduct = {
        ...existing,
        title: scraped.title, // Actualizar título por si cambió
        imageUrl: scraped.imageUrl, // Actualizar imagen por si cambió
        price: scraped.price,
        ...(oldPrice !== undefined ? { oldPrice } : {})
      };
      
      // Si no tenía oldPrice en el objeto fusionado pero sí lo borramos, eliminar la clave
      if (oldPrice === undefined && "oldPrice" in mergedProduct) {
        delete mergedProduct.oldPrice;
      }

      nextProducts.push(mergedProduct);
      updatedCount++;
    } else {
      // Nuevo producto: añadir
      nextProducts.push(scraped);
      createdCount++;
      console.log(`   ✨ NUEVO PRODUCTO AÑADIDO: "${scraped.title}" (${scraped.price}€)`);
    }
  }

  // 2. Mantener productos existentes que NO estaban en las listas de deseos raspadas
  // (por si el usuario los añadió manualmente por otro canal o para evitar perder histórico)
  for (const [asin, existing] of existingProductsMap.entries()) {
    if (!processedAsins.has(asin)) {
      // Opcional: Podríamos verificar precios para estos productos también,
      // pero dado que no vienen en el raspado actual de wishlists, los mantenemos intactos.
      nextProducts.push(existing);
    }
  }

  // Guardar catálogo final
  const finalCatalog = {
    updatedAt: new Date().toISOString(),
    source: DRY_RUN ? catalog.source : "wishlist-scraper",
    products: nextProducts
  };

  console.log(`\nSincronización finalizada:`);
  console.log(`   - Nuevos productos: ${createdCount}`);
  console.log(`   - Productos actualizados: ${updatedCount} (${priceUpdatedCount} con cambio de precio)`);
  console.log(`   - Catálogo total: ${finalCatalog.products.length} productos`);

  if (DRY_RUN) {
    console.log("\n📋 MODO SIMULACIÓN (--dry-run activo). No se han guardado cambios en products.json.");
  } else {
    await fs.writeFile(CATALOG_PATH, `${JSON.stringify(finalCatalog, null, 2)}\n`, "utf8");
    console.log(`💾 Catálogo guardado con éxito en src/data/products.json`);
  }
}

run().catch((err) => {
  console.error("❌ Sincronización fallida:", err);
  process.exitCode = 1;
});
