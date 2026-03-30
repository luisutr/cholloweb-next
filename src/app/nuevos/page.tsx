import { ProductListingPage } from "@/components/product-listing-page";
import { getProductsBySection } from "@/lib/products";

export const metadata = {
  title: "Productos nuevos gaming | cholloweb.es",
  description:
    "Catálogo de consolas, juegos y accesorios nuevos para quienes buscan estrenar con el mejor precio posible.",
};

export default function NewProductsPage() {
  return (
    <ProductListingPage
      title="Nuevos"
      description="Productos nuevos disponibles en catálogo, listos para compra con seguimiento de ofertas."
      products={getProductsBySection("nuevos")}
    />
  );
}
