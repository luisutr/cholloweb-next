import type { Metadata } from "next";
import { ProductListingPage } from "@/components/product-listing-page";
import { getProductsBySection } from "@/lib/products";

export const metadata: Metadata = {
  title: "Consolas y videojuegos reacondicionados | Amazon Renewed | cholloweb.es",
  description:
    "Consolas, videojuegos y accesorios reacondicionados certificados por Amazon. Funcionan como nuevos con garantía y a precio reducido.",
  alternates: { canonical: "/reacondicionados" },
};

export default function RefurbishedPage() {
  return (
    <ProductListingPage
      title="Reacondicionados"
      badge="Amazon Renewed · Con garantía"
      icon="🔧"
      description="Productos gaming reacondicionados y certificados. Inspeccionados, probados y garantizados por Amazon o sus vendedores. Precio muy inferior al nuevo."
      products={getProductsBySection("reacondicionados")}
    />
  );
}
