import { ProductListingPage } from "@/components/product-listing-page";
import { getProductsBySection } from "@/lib/products";

export const metadata = {
  title: "Segunda mano gaming | cholloweb.es",
  description:
    "Catálogo de productos gaming de segunda mano con foco en precio, estado y oportunidad de compra.",
};

export default function SecondHandPage() {
  return (
    <ProductListingPage
      title="Segunda mano"
      description="Listado de artículos de segunda mano para ahorrar sin salir del ecosistema gaming."
      products={getProductsBySection("segunda-mano")}
    />
  );
}
