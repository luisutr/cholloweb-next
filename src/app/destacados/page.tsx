import { ProductListingPage } from "@/components/product-listing-page";
import { getProductsBySection } from "@/lib/products";

export const metadata = {
  title: "Productos destacados gaming | cholloweb.es",
  description:
    "Selección de productos gaming destacados con buena relación calidad-precio en consolas, videojuegos y accesorios.",
};

export default function FeaturedPage() {
  return (
    <ProductListingPage
      title="Destacados"
      description="Una selección rápida de productos recomendados por su precio y potencial de ahorro."
      products={getProductsBySection("destacados")}
    />
  );
}
