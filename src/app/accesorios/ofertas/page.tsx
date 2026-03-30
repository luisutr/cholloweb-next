import { ProductListingPage } from "@/components/product-listing-page";
import { getAccesoriosBySection } from "@/lib/products";

export const metadata = {
  title: "Ofertas accesorios gaming | cholloweb.es",
  description:
    "Las mejores ofertas en accesorios para consola y PC gaming: mandos, auriculares, cargadores y más con descuento.",
};

export default function AccesoriosOfertasPage() {
  return (
    <ProductListingPage
      title="Ofertas en accesorios"
      description="Los accesorios gaming con mayor descuento ahora mismo. Mandos, auriculares, almacenamiento y periféricos en oferta."
      products={getAccesoriosBySection("ofertas")}
    />
  );
}
