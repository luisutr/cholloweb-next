import Link from "next/link";
import { INTENT_SEO_PAGES } from "@/lib/intent-seo-pages";

export const metadata = {
  title: "Guías de compra gaming | Keywords long-tail",
  description:
    "Guías SEO de compra para consultas específicas: videojuegos baratos de PS5, ofertas Xbox Series y Nintendo Switch OLED en oferta.",
};

export default function GuidesIndexPage() {
  return (
    <div className="bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Guías de compra y ofertas gaming
        </h1>
        <p className="mt-3 text-zinc-600">
          Esta sección agrupa páginas orientadas a búsquedas concretas con alta
          intención de compra.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INTENT_SEO_PAGES.map((page) => (
            <Link
              key={page.slug}
              href={`/guias/${page.slug}`}
              className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
            >
              <h2 className="text-lg font-semibold">{page.shortName}</h2>
              <p className="mt-2 text-sm text-zinc-600">{page.seoDescription}</p>
              <span className="mt-3 inline-block text-sm font-medium text-blue-700">
                Ver guía
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
