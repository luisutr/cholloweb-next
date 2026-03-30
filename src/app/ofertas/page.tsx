import { ProductListingPage } from "@/components/product-listing-page";
import { getProductsBySection } from "@/lib/products";

export const metadata = {
  title: "Ofertas gaming hoy | cholloweb.es",
  description:
    "Ofertas de consolas, videojuegos y accesorios con descuento activo y comparativa frente a precio anterior.",
};

export default function OffersPage() {
  return (
    <ProductListingPage
      title="Ofertas"
      description="Productos en oferta con descuento detectado frente al precio habitual."
      products={getProductsBySection("ofertas")}
    />
  );
}
