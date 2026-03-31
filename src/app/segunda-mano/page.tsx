import type { Metadata } from "next";
import { ProductListingPage } from "@/components/product-listing-page";
import { getProductsBySection } from "@/lib/products";

export const metadata: Metadata = {
  title: "Videojuegos y consolas de segunda mano baratos | cholloweb.es",
  description:
    "Catálogo de videojuegos, consolas y accesorios de segunda mano con foco en precio, estado y oportunidad de compra en Amazon.",
  alternates: { canonical: "/segunda-mano" },
};

export default function SecondHandPage() {
  return (
    <ProductListingPage
      title="Segunda mano"
      badge="Usado · En buen estado"
      icon="♻️"
      description="Videojuegos, consolas y accesorios de segunda mano vendidos en Amazon. Ahorra respecto al precio de nuevo sin sacrificar calidad."
      products={getProductsBySection("segunda-mano")}
    />
  );
}
