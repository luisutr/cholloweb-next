import Link from "next/link";

import { ProductListingPage } from "@/components/product-listing-page";
import { getAccesoriosBySection } from "@/lib/products";

export const metadata = {
  title: "Accesorios gaming baratos | cholloweb.es",
  description:
    "Accesorios para consola y setup gaming: mandos, auriculares, almacenamiento y periféricos con ofertas destacadas.",
};

export default function AccessoriesPage() {
  const products = getAccesoriosBySection("todos");

  return (
    <div>
      <main className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-zinc-800">Secciones de accesorios</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              href="/accesorios/nuevos"
              className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
            >
              Nuevos
            </Link>
            <Link
              href="/accesorios/segunda-mano"
              className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800"
            >
              Segunda mano
            </Link>
            <Link
              href="/accesorios/reacondicionados"
              className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800"
            >
              Reacondicionados
            </Link>
            <Link
              href="/accesorios/ofertas"
              className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800"
            >
              Ofertas
            </Link>
          </div>
        </section>
      </main>

      <ProductListingPage
        title="Accesorios"
        description="Mira accesorios gaming por plataforma para completar tu setup al mejor precio."
        products={products}
      />
    </div>
  );
}
