import { ProductListingPage } from "@/components/product-listing-page";
import { getAccesoriosBySection } from "@/lib/products";

export const metadata = {
  title: "Accesorios gaming nuevos | cholloweb.es",
  description:
    "Mandos, auriculares, almacenamiento y periféricos gaming nuevos al mejor precio para PlayStation, Xbox y Nintendo.",
};

export default function AccesoriosNuevosPage() {
  return (
    <ProductListingPage
      title="Accesorios nuevos"
      description="Accesorios gaming a estrenar: mandos, auriculares, tarjetas de memoria y más, con el mejor precio garantizado."
      products={getAccesoriosBySection("nuevos")}
    />
  );
}
