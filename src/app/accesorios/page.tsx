import type { Metadata } from "next";
import { ProductListingPage } from "@/components/product-listing-page";
import { getAccesoriosBySection } from "@/lib/products";

export const metadata: Metadata = {
  title: "Accesorios gaming baratos | Mandos, auriculares y más | cholloweb.es",
  description:
    "Accesorios gaming para PlayStation, Xbox y Nintendo al mejor precio: mandos, auriculares, fundas, cables y periféricos.",
  alternates: { canonical: "/accesorios" },
};

export default function AccessoriesPage() {
  return (
    <ProductListingPage
      title="Accesorios gaming"
      badge="Catálogo completo"
      icon="🎧"
      description="Mandos extra, auriculares, bases de carga, fundas y periféricos para PlayStation, Xbox y Nintendo. Nuevos, reacondicionados y de segunda mano."
      products={getAccesoriosBySection("todos")}
      crumbs={[{ label: "Accesorios" }]}
    />
  );
}
