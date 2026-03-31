import type { Metadata } from "next";
import { ProductListingPage } from "@/components/product-listing-page";
import { getProductsBySection } from "@/lib/products";

export const metadata: Metadata = {
  title: "Ofertas gaming hoy | Consolas y videojuegos con descuento | cholloweb.es",
  description:
    "Los mejores chollos gaming del día: consolas, videojuegos y accesorios con descuento activo en Amazon España.",
  alternates: { canonical: "/ofertas" },
};

export default function OffersPage() {
  return (
    <ProductListingPage
      title="Ofertas del momento"
      badge="Descuento activo"
      icon="🔥"
      description="Los mejores chollos gaming ahora mismo: consolas, videojuegos y accesorios con precio por debajo de su habitual en Amazon."
      products={getProductsBySection("ofertas")}
    />
  );
}
