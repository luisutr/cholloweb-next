import { ProductListingPage } from "@/components/product-listing-page";
import { getAccesoriosBySection } from "@/lib/products";

export const metadata = {
  title: "Accesorios gaming reacondicionados | cholloweb.es",
  description:
    "Accesorios gaming reacondicionados certificados: como nuevos, con garantía y a precio reducido.",
};

export default function AccesoriosReacondicionadosPage() {
  return (
    <ProductListingPage
      title="Accesorios reacondicionados"
      description="Mandos, auriculares y accesorios reacondicionados por fabricantes certificados. Garantía incluida y precio muy inferior al nuevo."
      products={getAccesoriosBySection("reacondicionados")}
    />
  );
}
