import type { Metadata } from "next";
import { ProductListingPage } from "@/components/product-listing-page";
import { getVideogamesBySection } from "@/lib/products";

export const metadata: Metadata = {
  title: "Videojuegos en oferta | PlayStation, Xbox y Nintendo | cholloweb.es",
  description:
    "Los mejores precios en videojuegos para PlayStation, Xbox y Nintendo. Filtra por nuevo, segunda mano, reacondicionado u oferta.",
  alternates: { canonical: "/videojuegos" },
};

export default function VideogamesPage() {
  return (
    <ProductListingPage
      title="Videojuegos"
      badge="Catálogo completo"
      icon="🎮"
      description="Los mejores precios en videojuegos para PlayStation, Xbox y Nintendo. Nuevos, de segunda mano, reacondicionados y con descuento activo."
      products={getVideogamesBySection("todos")}
      crumbs={[{ label: "Videojuegos" }]}
    />
  );
}
