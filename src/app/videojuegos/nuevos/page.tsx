import { ProductListingPage } from "@/components/product-listing-page";
import { getVideogamesBySection } from "@/lib/products";

export const metadata = {
  title: "Videojuegos nuevos baratos | cholloweb.es",
  description:
    "Encuentra videojuegos nuevos con ofertas y precios competitivos para PlayStation, Xbox y Nintendo.",
};

export default function VideogamesNewPage() {
  return (
    <ProductListingPage
      title="Videojuegos nuevos"
      description="Catálogo de videojuegos nuevos para quienes quieren estrenar al mejor precio posible."
      products={getVideogamesBySection("nuevos")}
    />
  );
}
