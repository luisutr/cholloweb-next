import rawCatalog from "@/data/products.json";
import type { GenerationSlug, KindSlug, MainPlatform } from "@/lib/platform-hierarchy";

export type ProductCategory =
  | "videojuegos"
  | "consolas"
  | "accesorios"
  | "figuras";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "videojuegos",
  "consolas",
  "accesorios",
  "figuras",
];

export type ProductCondition = "nuevo" | "segunda-mano" | "reacondicionado";
export type PlatformFamily = "playstation" | "xbox" | "nintendo" | "multi";
export type CatalogSection =
  | "destacados"
  | "ofertas"
  | "segunda-mano"
  | "reacondicionados"
  | "nuevos";

export type VideogameSection = "todos" | "nuevos" | "segunda-mano" | "reacondicionados" | "ofertas";
export type AccesorioSection = "todos" | "nuevos" | "segunda-mano" | "reacondicionados" | "ofertas";

export type Product = {
  id: string;
  title: string;
  category: ProductCategory;
  platformFamily: PlatformFamily;
  generation: GenerationSlug | null;
  platformLabel: string;
  condition: ProductCondition;
  price: number;
  oldPrice?: number;
  imageUrl: string;
  amazonUrl: string;
  featured?: boolean;
  badge?: string;
};

type CatalogData = {
  updatedAt: string;
  source: string;
  products: Product[];
};

const CATALOG = rawCatalog as CatalogData;

/** Títulos genéricos generados durante importaciones de prueba — nunca deben mostrarse */
const GENERIC_TITLE_RE = /^producto amazon\s+\w+$/i;

/**
 * Catálogo limpio: excluye productos con título genérico o precio 0
 * (no disponibles). Actúa como red de seguridad independientemente
 * del contenido del JSON.
 */
const PRODUCTS: Product[] = CATALOG.products.filter(
  (p) => p.price > 0 && !GENERIC_TITLE_RE.test(p.title?.trim() ?? ""),
);

export function getCatalogMeta() {
  return {
    updatedAt: CATALOG.updatedAt,
    source: CATALOG.source,
    totalProducts: PRODUCTS.length,
  };
}

export function getProducts(category?: ProductCategory): Product[] {
  if (!category) {
    return PRODUCTS;
  }
  return PRODUCTS.filter((product) => product.category === category);
}

export function getProductsBySection(section: CatalogSection): Product[] {
  return PRODUCTS.filter((product) => {
    if (section === "destacados") return Boolean(product.featured);
    if (section === "ofertas") return Boolean(product.oldPrice && product.oldPrice > product.price);
    if (section === "segunda-mano") return product.condition === "segunda-mano";
    if (section === "reacondicionados") return product.condition === "reacondicionado";
    if (section === "nuevos") return product.condition === "nuevo";
    return true;
  });
}

export function getProductsByPlatformFamily(platformFamily: PlatformFamily): Product[] {
  return PRODUCTS.filter((product) => product.platformFamily === platformFamily);
}

export function getVideogamesBySection(section: VideogameSection): Product[] {
  const videogames = PRODUCTS.filter((product) => product.category === "videojuegos");

  if (section === "todos") return videogames;
  if (section === "nuevos")
    return videogames.filter((product) => product.condition === "nuevo");
  if (section === "segunda-mano")
    return videogames.filter((product) => product.condition === "segunda-mano");
  if (section === "reacondicionados")
    return videogames.filter((product) => product.condition === "reacondicionado");
  if (section === "ofertas")
    return videogames.filter(
      (product) => Boolean(product.oldPrice && product.oldPrice > product.price),
    );

  return videogames;
}

export function getAccesoriosBySection(section: AccesorioSection): Product[] {
  const accesorios = PRODUCTS.filter((product) => product.category === "accesorios");

  if (section === "todos") return accesorios;
  if (section === "nuevos") return accesorios.filter((p) => p.condition === "nuevo");
  if (section === "segunda-mano") return accesorios.filter((p) => p.condition === "segunda-mano");
  if (section === "reacondicionados")
    return accesorios.filter((p) => p.condition === "reacondicionado");
  if (section === "ofertas")
    return accesorios.filter((p) => Boolean(p.oldPrice && p.oldPrice > p.price));

  return accesorios;
}

export function getProductsByHierarchy(
  platform: MainPlatform,
  generation: GenerationSlug,
  kind: KindSlug,
): Product[] {
  return PRODUCTS.filter(
    (product) =>
      product.platformFamily === platform &&
      product.generation === generation &&
      product.category === kind,
  );
}

export function searchProducts(query: string, category?: ProductCategory): Product[] {
  const source = getProducts(category);
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return source;
  }

  return source.filter((product) =>
    product.title.toLowerCase().includes(normalizedQuery),
  );
}

export function getDiscountPercentage(product: Product): number {
  if (!product.oldPrice || product.oldPrice <= product.price) {
    return 0;
  }

  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
}

/**
 * Hash determinista del ID → valor 0..1
 * Permite un "shuffle estable": mismo resultado en cada build,
 * pero sin seguir el orden de importación.
 */
function idHash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(h, 31) + id.charCodeAt(i)) | 0;
  }
  return (h >>> 0) / 0xffffffff;
}

/**
 * Puntuación de relevancia para ordenar el grid principal.
 * Criterios (de mayor a menor peso):
 *   1. Productos destacados (featured)
 *   2. % de descuento real
 *   3. Precio bajo (chollos baratos suben ligeramente)
 *   4. Variación pseudoaleatoria por ASIN (evita orden de importación)
 */
function relevanceScore(p: Product): number {
  let score = 0;
  if (p.featured) score += 10_000;
  score += getDiscountPercentage(p) * 100;       // 0 – 10 000
  score += Math.min(100 / Math.max(p.price, 1), 50); // hasta 50 pts por precio bajo
  score += idHash(p.id) * 200;                   // ±200 pts de variación estable por ASIN
  return score;
}

/** Productos con precio real (disponibles en Amazon), ordenados por relevancia */
export function getAvailableProducts(category?: ProductCategory): Product[] {
  return getProducts(category)
    .filter((p) => p.price > 0)
    .sort((a, b) => relevanceScore(b) - relevanceScore(a));
}

export function getTopDeals(limit = 10): Product[] {
  // Solo productos con precio conocido (disponibles en Amazon)
  const available = PRODUCTS.filter((p) => p.price > 0);
  if (available.length === 0) return [];

  // 1. Primero los que tienen descuento real, ordenados por % de ahorro
  const withDiscount = available
    .filter((p) => p.oldPrice && p.oldPrice > p.price)
    .sort((a, b) => {
      const diff = getDiscountPercentage(b) - getDiscountPercentage(a);
      return diff !== 0 ? diff : a.price - b.price;
    });

  if (withDiscount.length >= limit) return withDiscount.slice(0, limit);

  // 2. Si no hay suficientes con descuento, rellena con los más baratos disponibles
  const usedIds = new Set(withDiscount.map((p) => p.id));
  const cheapest = available
    .filter((p) => !usedIds.has(p.id))
    .sort((a, b) => a.price - b.price);

  return [...withDiscount, ...cheapest].slice(0, limit);
}

export function isProductCategory(value: string): value is ProductCategory {
  return PRODUCT_CATEGORIES.includes(value as ProductCategory);
}

type AmazonMarketplace = "ES" | "IT" | "DE" | "UK" | "FR";

function getMarketplaceFromHost(hostname: string): AmazonMarketplace | null {
  const host = hostname.toLowerCase();

  if (host.endsWith("amazon.es")) return "ES";
  if (host.endsWith("amazon.it")) return "IT";
  if (host.endsWith("amazon.de")) return "DE";
  if (host.endsWith("amazon.co.uk")) return "UK";
  if (host.endsWith("amazon.fr")) return "FR";

  return null;
}

function getAffiliateTagForMarketplace(marketplace: AmazonMarketplace): string {
  const tagByMarketplace: Record<AmazonMarketplace, string | undefined> = {
    ES: process.env.NEXT_PUBLIC_AMAZON_TAG_ES,
    IT: process.env.NEXT_PUBLIC_AMAZON_TAG_IT,
    DE: process.env.NEXT_PUBLIC_AMAZON_TAG_DE,
    UK: process.env.NEXT_PUBLIC_AMAZON_TAG_UK,
    FR: process.env.NEXT_PUBLIC_AMAZON_TAG_FR,
  };

  return (
    tagByMarketplace[marketplace]?.trim() ||
    process.env.NEXT_PUBLIC_AMAZON_TAG?.trim() ||
    ""
  );
}

export function withAffiliateTag(url: string): string {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return url;
  }

  const marketplace = getMarketplaceFromHost(parsedUrl.hostname);
  if (!marketplace) {
    return url;
  }

  const tag = getAffiliateTagForMarketplace(marketplace);

  if (!tag) {
    return url;
  }

  parsedUrl.searchParams.set("tag", tag);
  return parsedUrl.toString();
}
