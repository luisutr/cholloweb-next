import type { Metadata } from "next";
import { ProductListingPage } from "@/components/product-listing-page";
import { getAccesoriosBySection } from "@/lib/products";

export const metadata: Metadata = {
  title: "Ofertas accesorios gaming hoy | cholloweb.es",
  description:
    "Las mejores ofertas en accesorios para consola: mandos, auriculares, cargadores y más con descuento activo.",
  alternates: { canonical: "/accesorios/ofertas" },
};

export default function AccesoriosOfertasPage() {
  return (
    <ProductListingPage
      title="Ofertas en accesorios"
      badge="Con descuento activo"
      icon="🔥"
      description="Los accesorios gaming con mayor descuento ahora mismo. Mandos, auriculares, almacenamiento y periféricos en oferta."
      products={getAccesoriosBySection("ofertas")}
      crumbs={[{ label: "Accesorios", href: "/accesorios" }]}
    />
  );
}
