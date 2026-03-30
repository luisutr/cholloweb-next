import { CatalogFilters } from "@/components/catalog-filters";
import { TopDealsCarousel } from "@/components/top-deals-carousel";
import { getAvailableProducts, getTopDeals } from "@/lib/products";

export default function Home() {
  const products = getAvailableProducts();
  const topDeals = getTopDeals(10);

  return (
    <div className="bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Hero */}
        <section className="rounded-xl bg-zinc-900 px-4 py-4 text-white sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-zinc-300">cholloweb.es</p>
              <h1 className="text-lg font-bold sm:text-xl">Ofertas gaming y tecnología</h1>
            </div>
            <p className="max-w-md text-right text-xs text-zinc-300 sm:text-sm">
              Chollos en videojuegos, consolas, figuras y reacondicionados.
            </p>
          </div>
        </section>

        {/* Top 10 ofertas — carrusel */}
        <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-900">
              🔥 Top {topDeals.length > 0 ? topDeals.length : 10} ofertas del momento
            </h2>
            <span className="text-xs text-zinc-400">Los mejores descuentos de todas las categorías</span>
          </div>
          {topDeals.length > 0 ? (
            <TopDealsCarousel products={topDeals} />
          ) : (
            <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 text-center">
              <div>
                <p className="text-2xl">🛒</p>
                <p className="mt-2 text-sm font-medium text-zinc-500">Aquí aparecerán los 10 mejores chollos</p>
                <p className="mt-1 text-xs text-zinc-400">Importa tu catálogo desde el panel de administración</p>
              </div>
            </div>
          )}
        </section>

        {/* Catálogo con filtros */}
        <CatalogFilters products={products} />

        {/* Aviso afiliados */}
        <section className="mt-12 rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
          <p>
            Algunos enlaces de esta web son enlaces de afiliado. Si compras a través de ellos,
            podemos recibir una comisión sin coste adicional para ti.
          </p>
          <p className="mt-2">
            Los precios y disponibilidad pueden cambiar en Amazon en cualquier momento.
          </p>
        </section>
      </main>
    </div>
  );
}
