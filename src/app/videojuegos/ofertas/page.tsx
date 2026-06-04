import type { Metadata } from "next";
import { ProductListingPage } from "@/components/product-listing-page";
import { getVideogamesBySection } from "@/lib/products";

export const metadata: Metadata = {
  title: "Ofertas de videojuegos hoy | cholloweb.es",
  description:
    "Videojuegos con descuento activo frente a su precio habitual en Amazon. Chollos de PlayStation, Xbox y Nintendo actualizados.",
  alternates: { canonical: "/videojuegos/ofertas" },
};

export default function VideogamesOffersPage() {
  return (
    <ProductListingPage
      title="Ofertas de videojuegos"
      badge="Con descuento activo"
      icon="🔥"
      description="Videojuegos con precio por debajo de su habitual en Amazon. Ordenados por mayor ahorro y relevancia."
      products={getVideogamesBySection("ofertas")}
      crumbs={[{ label: "Videojuegos", href: "/videojuegos" }]}
    />
  );
}
