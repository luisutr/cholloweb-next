import { ProductListingPage } from "@/components/product-listing-page";
import { getProducts } from "@/lib/products";

export const metadata = {
  title: "Accesorios gaming baratos | cholloweb.es",
  description:
    "Accesorios para consola y setup gaming: mandos, almacenamiento y periféricos con ofertas destacadas.",
};

export default function AccessoriesPage() {
  return (
    <ProductListingPage
      title="Accesorios"
      description="Mira accesorios gaming por plataforma para completar tu setup al mejor precio."
      products={getProducts("accesorios")}
    />
  );
}
