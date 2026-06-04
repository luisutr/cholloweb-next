import type { Metadata } from "next";
import { ProductListingPage } from "@/components/product-listing-page";
import { getAccesoriosBySection } from "@/lib/products";

export const metadata: Metadata = {
  title: "Accesorios gaming reacondicionados | cholloweb.es",
  description:
    "Accesorios gaming reacondicionados certificados: como nuevos, con garantía y a precio reducido.",
  alternates: { canonical: "/accesorios/reacondicionados" },
};

export default function AccesoriosReacondicionadosPage() {
  return (
    <ProductListingPage
      title="Accesorios reacondicionados"
      badge="Amazon Renewed"
      icon="🔧"
      description="Mandos, auriculares y accesorios reacondicionados por fabricantes certificados. Garantía incluida y precio muy inferior al nuevo."
      products={getAccesoriosBySection("reacondicionados")}
      crumbs={[{ label: "Accesorios", href: "/accesorios" }]}
    />
  );
}
