import type { Metadata } from "next";
import { ProductListingPage } from "@/components/product-listing-page";
import { getAccesoriosBySection } from "@/lib/products";

export const metadata: Metadata = {
  title: "Accesorios gaming nuevos baratos | cholloweb.es",
  description:
    "Mandos, auriculares, almacenamiento y periféricos gaming nuevos al mejor precio para PlayStation, Xbox y Nintendo.",
  alternates: { canonical: "/accesorios/nuevos" },
};

export default function AccesoriosNuevosPage() {
  return (
    <ProductListingPage
      title="Accesorios nuevos"
      badge="A estrenar"
      icon="🆕"
      description="Accesorios gaming nuevos: mandos, auriculares, fundas, bases de carga y más. Todo sin usar al mejor precio."
      products={getAccesoriosBySection("nuevos")}
      crumbs={[{ label: "Accesorios", href: "/accesorios" }]}
    />
  );
}
