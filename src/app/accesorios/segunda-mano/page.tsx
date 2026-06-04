import type { Metadata } from "next";
import { ProductListingPage } from "@/components/product-listing-page";
import { getAccesoriosBySection } from "@/lib/products";

export const metadata: Metadata = {
  title: "Accesorios gaming segunda mano | cholloweb.es",
  description:
    "Mandos, auriculares y accesorios gaming de segunda mano en buen estado y a precios rebajados.",
  alternates: { canonical: "/accesorios/segunda-mano" },
};

export default function AccesoriosSegundaManoPage() {
  return (
    <ProductListingPage
      title="Accesorios de segunda mano"
      badge="Segunda mano"
      icon="♻️"
      description="Accesorios gaming usados en buen estado: la forma más barata de completar tu setup sin renunciar a la calidad."
      products={getAccesoriosBySection("segunda-mano")}
      crumbs={[{ label: "Accesorios", href: "/accesorios" }]}
    />
  );
}
