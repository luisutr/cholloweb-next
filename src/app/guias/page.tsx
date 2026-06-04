import Link from "next/link";
import { INTENT_SEO_PAGES } from "@/lib/intent-seo-pages";

export const metadata = {
  title: "Guías de compra gaming | Keywords long-tail",
  description:
    "Guías SEO de compra para consultas específicas: videojuegos baratos de PS5, ofertas Xbox Series y Nintendo Switch OLED en oferta.",
};

export default function GuidesIndexPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-brand font-black uppercase tracking-wider text-white sm:text-3xl">
          Guías de compra y ofertas gaming
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          Esta sección agrupa páginas orientadas a búsquedas concretas con alta
          intención de compra.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INTENT_SEO_PAGES.map((page) => (
            <Link
              key={page.slug}
              href={`/guias/${page.slug}`}
              className="group rounded-xl border border-zinc-800 bg-[#0d0d0d] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-700 hover:shadow-[0_4px_12px_rgba(0,127,255,0.15)]"
            >
              <h2 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{page.shortName}</h2>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{page.seoDescription}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-primary group-hover:underline">
                Ver guía →
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
