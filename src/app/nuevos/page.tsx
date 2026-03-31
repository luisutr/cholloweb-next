import type { Metadata } from "next";
import { ProductListingPage } from "@/components/product-listing-page";
import { getProductsBySection } from "@/lib/products";

export const metadata: Metadata = {
  title: "Videojuegos y consolas nuevos baratos | cholloweb.es",
  description:
    "Consolas, videojuegos y accesorios nuevos al mejor precio en Amazon. Catálogo actualizado con los mejores descuentos.",
  alternates: { canonical: "/nuevos" },
};

export default function NewProductsPage() {
  return (
    <ProductListingPage
      title="Productos nuevos"
      badge="A estrenar"
      icon="🆕"
      description="Consolas, videojuegos y accesorios nuevos disponibles en Amazon. Sin uso previo y con el mejor precio del momento."
      products={getProductsBySection("nuevos")}
    />
  );
}
