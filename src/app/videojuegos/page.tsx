import Link from "next/link";
import { ProductListingPage } from "@/components/product-listing-page";
import { getVideogamesBySection } from "@/lib/products";

export const metadata = {
  title: "Videojuegos en oferta | cholloweb.es",
  description:
    "Listado de videojuegos en oferta para PlayStation, Xbox y Nintendo con enfoque en precio y oportunidad de compra.",
};

export default function VideogamesPage() {
  const products = getVideogamesBySection("todos");

  return (
    <div>
      <main className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-zinc-800">Secciones de videojuegos</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              href="/videojuegos/nuevos"
              className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
            >
              Nuevos
            </Link>
            <Link
              href="/videojuegos/segunda-mano"
              className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800"
            >
              Segunda mano
            </Link>
            <Link
              href="/videojuegos/reacondicionados"
              className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800"
            >
              Reacondicionados
            </Link>
            <Link
              href="/videojuegos/ofertas"
              className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800"
            >
              Ofertas
            </Link>
          </div>
        </section>
      </main>

      <ProductListingPage
        title="Videojuegos"
        description="Selección de videojuegos para distintas plataformas con seguimiento de descuentos."
        products={products}
      />
    </div>
  );
}
