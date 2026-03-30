import rawCatalog from "@/data/products.json";

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

export type Product = {
  id: string;
  title: string;
  category: ProductCategory;
  platformFamily: PlatformFamily;
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
const PRODUCTS: Product[] = CATALOG.products;

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

export function getTopDeals(limit = 3): Product[] {
  return [...PRODUCTS]
    .sort((a, b) => getDiscountPercentage(b) - getDiscountPercentage(a))
    .slice(0, limit);
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
