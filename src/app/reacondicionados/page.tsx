import { ProductListingPage } from "@/components/product-listing-page";
import { getProductsBySection } from "@/lib/products";

export const metadata = {
  title: "Reacondicionados gaming | cholloweb.es",
  description:
    "Encuentra consolas y accesorios reacondicionados con descuentos relevantes y buena relación precio-rendimiento.",
};

export default function RefurbishedPage() {
  return (
    <ProductListingPage
      title="Reacondicionados"
      description="Productos reacondicionados con potencial de ahorro para jugadores que priorizan presupuesto."
      products={getProductsBySection("reacondicionados")}
    />
  );
}
