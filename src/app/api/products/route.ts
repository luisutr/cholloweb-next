import {
  getCatalogMeta,
  getAvailableProducts,
  isProductCategory,
  searchProducts,
} from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryParam = searchParams.get("category");
  const queryParam = searchParams.get("q")?.trim() ?? "";

  if (!categoryParam) {
    const base = getAvailableProducts();
    const products = queryParam
      ? base.filter((p) => p.title.toLowerCase().includes(queryParam.toLowerCase()))
      : base;
    return Response.json({ meta: getCatalogMeta(), products });
  }

  if (!isProductCategory(categoryParam)) {
    return Response.json(
      { error: "Categoria no valida. Usa videojuegos, consolas, accesorios o figuras." },
      { status: 400 },
    );
  }

  const base = getAvailableProducts(categoryParam);
  const products = queryParam
    ? base.filter((p) => p.title.toLowerCase().includes(queryParam.toLowerCase()))
    : base;

  return Response.json({ meta: getCatalogMeta(), products });
}
