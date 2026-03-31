import type { Metadata } from "next";
import { ProductListingPage } from "@/components/product-listing-page";
import { getProductsBySection } from "@/lib/products";

export const metadata: Metadata = {
  title: "Productos destacados gaming | Selección cholloweb.es",
  description:
    "Selección de productos gaming destacados con buena relación calidad-precio en consolas, videojuegos y accesorios.",
  alternates: { canonical: "/destacados" },
};

export default function FeaturedPage() {
  return (
    <ProductListingPage
      title="Destacados"
      badge="Selección editorial"
      icon="⭐"
      description="Productos gaming seleccionados por su excelente relación calidad-precio. Chollos que merece la pena no dejar pasar."
      products={getProductsBySection("destacados")}
    />
  );
}
