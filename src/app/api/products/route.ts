import {
  getCatalogMeta,
  getProducts,
  isProductCategory,
  searchProducts,
} from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryParam = searchParams.get("category");
  const queryParam = searchParams.get("q")?.trim() ?? "";

  if (!categoryParam) {
    const products = queryParam ? searchProducts(queryParam) : getProducts();
    return Response.json({ meta: getCatalogMeta(), products });
  }

  if (!isProductCategory(categoryParam)) {
    return Response.json(
      { error: "Categoria no valida. Usa videojuegos, consolas, accesorios o figuras." },
      { status: 400 },
    );
  }

  const products = queryParam
    ? searchProducts(queryParam, categoryParam)
    : getProducts(categoryParam);

  return Response.json({ meta: getCatalogMeta(), products });
}
