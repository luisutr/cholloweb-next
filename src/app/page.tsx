import Link from "next/link";
import { CatalogFilters } from "@/components/catalog-filters";
import { TopDealsCarousel } from "@/components/top-deals-carousel";
import { getAvailableProducts, getTopDeals } from "@/lib/products";

export default function Home() {
  const products = getAvailableProducts();
  const topDeals = getTopDeals(10);

  return (
    <div className="bg-black text-white min-h-screen">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Hero Banner estilo Cyberpunk */}
        <section className="overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-5 py-6 text-white shadow-xl relative">
          <div className="absolute top-0 right-0 h-40 w-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between gap-4 relative z-10">
            <div>
              <p className="text-xs font-brand font-semibold uppercase tracking-[0.2em] text-primary">cholloweb.es</p>
              <h1 className="mt-1 text-2xl font-brand font-black uppercase tracking-tight sm:text-3xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Ofertas gaming y tecnología
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-zinc-400">
                Chollos en videojuegos, consolas, figuras y reacondicionados.
              </p>
            </div>
            {/* Decoración: logo con brillo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt=""
              aria-hidden="true"
              className="hidden h-16 w-16 object-contain opacity-90 drop-shadow-[0_0_8px_rgba(0,127,255,0.4)] sm:block"
            />
          </div>
        </section>

        {/* Top 10 ofertas — carrusel */}
        <section className="mt-6 rounded-xl border border-zinc-800 bg-[#0c0c0e] p-4 sm:p-6 shadow-md">
          <div className="mb-4 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
            <h2 className="text-base font-brand font-bold uppercase text-white tracking-wider flex items-center gap-1.5">
              🔥 Top {topDeals.length > 0 ? topDeals.length : 10} ofertas del momento
            </h2>
            <span className="text-xs text-zinc-500">Los mejores descuentos de todas las categorías</span>
          </div>
          {topDeals.length > 0 ? (
            <TopDealsCarousel products={topDeals} />
          ) : (
            <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-zinc-800 text-center bg-black/20">
              <div>
                <p className="text-2xl">🛒</p>
                <p className="mt-2 text-sm font-medium text-zinc-450">Aquí aparecerán los 10 mejores chollos</p>
                <p className="mt-1 text-xs text-zinc-500">Importa tu catálogo desde el panel de administración</p>
              </div>
            </div>
          )}
        </section>

        {/* Banner de Patrocinio de CoverLens & Covers */}
        <section className="mt-6 overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-[#0c0c0e] to-black p-6 shadow-lg relative">
          <div className="absolute -right-10 -bottom-10 h-48 w-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <span className="rounded bg-primary/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">Proyecto Ecosistema</span>
                <span className="text-xs text-zinc-500">Patrocinado por CoverLens</span>
              </div>
              <h2 className="text-2xl font-brand font-black uppercase text-white tracking-wide">CoverLens App</h2>
              <p className="max-w-xl text-sm leading-relaxed text-zinc-400">
                Lleva el control de tu colección de videojuegos en tu bolsillo. Escanea códigos de barras, consulta metadatos completos y comprueba el valor de mercado al instante. Alimentado por la base de datos abierta <a href="https://covers.cholloweb.es/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">covers.cholloweb.es</a>.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/coverlens" className="rounded-lg bg-primary px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-600 active:scale-95">
                  Conocer CoverLens App
                </Link>
                <a href="https://covers.cholloweb.es/" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-zinc-850 bg-zinc-900 px-5 py-2.5 text-xs font-bold text-zinc-300 transition hover:border-zinc-700 hover:text-white active:scale-95">
                  Base de Datos de Portadas
                </a>
              </div>
            </div>
            
            <div className="relative mx-auto h-36 w-64 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-black/45 md:mx-0 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/coverlens/hero.png"
                alt="CoverLens App Banner"
                className="h-full w-full object-cover opacity-85"
              />
            </div>
          </div>
        </section>

        {/* Catálogo con filtros */}
        <div className="mt-8">
          <CatalogFilters products={products} />
        </div>

        {/* Aviso afiliados */}
        <section className="mt-12 rounded-xl border border-zinc-800 bg-[#0c0c0e] p-6 text-sm text-zinc-400">
          <p>
            Algunos enlaces de esta web son enlaces de afiliado. Si compras a través de ellos,
            podemos recibir una comisión sin coste adicional para ti.
          </p>
          <p className="mt-2 text-zinc-500">
            Los precios y disponibilidad pueden cambiar en Amazon en cualquier momento.
          </p>
        </section>
      </main>
    </div>
  );
}
