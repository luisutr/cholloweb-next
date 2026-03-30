import { ProductListingPage } from "@/components/product-listing-page";
import { getVideogamesBySection } from "@/lib/products";

export const metadata = {
  title: "Videojuegos segunda mano | cholloweb.es",
  description:
    "Selección de videojuegos de segunda mano para ahorrar en tus compras gaming sin perder calidad.",
};

export default function VideogamesSecondHandPage() {
  return (
    <ProductListingPage
      title="Videojuegos de segunda mano"
      description="Juegos de segunda mano para distintas plataformas con foco en precio y oportunidad."
      products={getVideogamesBySection("segunda-mano")}
    />
  );
}
