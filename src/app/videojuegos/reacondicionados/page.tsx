import { ProductListingPage } from "@/components/product-listing-page";
import { getVideogamesBySection } from "@/lib/products";

export const metadata = {
  title: "Videojuegos reacondicionados | cholloweb.es",
  description:
    "Listado de videojuegos reacondicionados con descuentos relevantes y potencial de ahorro.",
};

export default function VideogamesRefurbishedPage() {
  return (
    <ProductListingPage
      title="Videojuegos reacondicionados"
      description="Productos reacondicionados para jugar gastando menos."
      products={getVideogamesBySection("reacondicionados")}
    />
  );
}
