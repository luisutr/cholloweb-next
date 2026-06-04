import type { Metadata } from "next";
import { ProductListingPage } from "@/components/product-listing-page";
import { getVideogamesBySection } from "@/lib/products";

export const metadata: Metadata = {
  title: "Videojuegos reacondicionados baratos | cholloweb.es",
  description:
    "Videojuegos reacondicionados certificados por Amazon con garantía. Calidad garantizada al mejor precio.",
  alternates: { canonical: "/videojuegos/reacondicionados" },
};

export default function VideogamesRefurbishedPage() {
  return (
    <ProductListingPage
      title="Videojuegos reacondicionados"
      badge="Amazon Renewed"
      icon="🔧"
      description="Videojuegos reacondicionados y verificados por vendedores Amazon. Funcionan como nuevos con un precio notablemente menor."
      products={getVideogamesBySection("reacondicionados")}
      crumbs={[{ label: "Videojuegos", href: "/videojuegos" }]}
    />
  );
}
