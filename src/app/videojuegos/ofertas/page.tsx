import { ProductListingPage } from "@/components/product-listing-page";
import { getVideogamesBySection } from "@/lib/products";

export const metadata = {
  title: "Ofertas de videojuegos | cholloweb.es",
  description:
    "Ofertas de videojuegos para PlayStation, Xbox y Nintendo con descuento activo frente a precio habitual.",
};

export default function VideogamesOffersPage() {
  return (
    <ProductListingPage
      title="Ofertas de videojuegos"
      description="Descuentos en videojuegos seleccionados para maximizar ahorro por compra."
      products={getVideogamesBySection("ofertas")}
    />
  );
}
