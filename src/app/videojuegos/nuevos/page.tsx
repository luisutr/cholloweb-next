import type { Metadata } from "next";
import { ProductListingPage } from "@/components/product-listing-page";
import { getVideogamesBySection } from "@/lib/products";

export const metadata: Metadata = {
  title: "Videojuegos nuevos baratos | cholloweb.es",
  description:
    "Videojuegos nuevos a estrenar con las mejores ofertas para PlayStation, Xbox y Nintendo.",
  alternates: { canonical: "/videojuegos/nuevos" },
};

export default function VideogamesNewPage() {
  return (
    <ProductListingPage
      title="Videojuegos nuevos"
      badge="A estrenar"
      icon="🆕"
      description="Videojuegos nuevos precintados con el mejor precio del momento en Amazon. Ideal si quieres estrenar sin esperar."
      products={getVideogamesBySection("nuevos")}
      crumbs={[{ label: "Videojuegos", href: "/videojuegos" }]}
    />
  );
}
