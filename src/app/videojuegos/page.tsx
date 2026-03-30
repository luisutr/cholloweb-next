import { ProductListingPage } from "@/components/product-listing-page";
import { getProducts } from "@/lib/products";

export const metadata = {
  title: "Videojuegos en oferta | cholloweb.es",
  description:
    "Listado de videojuegos en oferta para PlayStation, Xbox y Nintendo con enfoque en precio y oportunidad de compra.",
};

export default function VideogamesPage() {
  return (
    <ProductListingPage
      title="Videojuegos"
      description="Selección de videojuegos para distintas plataformas con seguimiento de descuentos."
      products={getProducts("videojuegos")}
    />
  );
}
