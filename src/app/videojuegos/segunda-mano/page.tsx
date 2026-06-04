import type { Metadata } from "next";
import { ProductListingPage } from "@/components/product-listing-page";
import { getVideogamesBySection } from "@/lib/products";

export const metadata: Metadata = {
  title: "Videojuegos segunda mano baratos | cholloweb.es",
  description:
    "Videojuegos de segunda mano en buen estado al mejor precio. Ahorra en tus próximos juegos de PlayStation, Xbox y Nintendo.",
  alternates: { canonical: "/videojuegos/segunda-mano" },
};

export default function VideogamesSecondHandPage() {
  return (
    <ProductListingPage
      title="Videojuegos de segunda mano"
      badge="Segunda mano"
      icon="♻️"
      description="Juegos en buen estado usados que pasan por Amazon Marketplace. Ahorra significativamente respecto al precio de nuevo."
      products={getVideogamesBySection("segunda-mano")}
      crumbs={[{ label: "Videojuegos", href: "/videojuegos" }]}
    />
  );
}
