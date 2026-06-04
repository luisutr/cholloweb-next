import type { Metadata } from "next";
import { ProductListingPage } from "@/components/product-listing-page";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Figuras y coleccionables gaming baratos | cholloweb.es",
  description:
    "Las mejores ofertas en figuras, Funko Pop, Nendoroids, amiibo y coleccionables de videojuegos al mejor precio en Amazon.",
  alternates: { canonical: "/figuras" },
};

export default function FigurasPage() {
  const products = getProducts("figuras").filter((p) => p.price > 0);

  return (
    <ProductListingPage
      title="Figuras y coleccionables"
      badge="Coleccionismo gaming"
      icon="🗿"
      description="Funko Pop, Nendoroids, amiibo, figuras de acción y todo tipo de coleccionables de tus sagas favoritas al mejor precio en Amazon."
      products={products}
    />
  );
}
