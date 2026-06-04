import type { Metadata } from "next";
import { ProductListingPage } from "@/components/product-listing-page";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Películas y series en oferta | Blu-ray y 4K baratos | cholloweb.es",
  description:
    "Ofertas en películas y series en Blu-ray, 4K UHD y DVD relacionadas con el mundo del gaming, anime y ciencia ficción al mejor precio en Amazon.",
  alternates: { canonical: "/peliculas" },
};

export default function PeliculasPage() {
  const products = getProducts("peliculas").filter((p) => p.price > 0);

  return (
    <ProductListingPage
      title="Películas y series"
      badge="Blu-ray · 4K · DVD"
      icon="🎬"
      description="Películas y series en Blu-ray, 4K UHD y DVD: anime, ciencia ficción, videojuegos adaptados y mucho más. Los mejores precios del momento en Amazon."
      products={products}
    />
  );
}
