import Link from "next/link";
import { ListingGrid } from "@/components/listing-grid";
import type { Product } from "@/lib/products";

type Crumb = { label: string; href?: string };

type ProductListingPageProps = {
  title: string;
  description: string;
  products: Product[];
  /** Emoji o icono para el hero (opcional) */
  icon?: string;
  /** Breadcrumbs adicionales antes del título de página */
  crumbs?: Crumb[];
  /** Subtítulo adicional en el hero (opcional) */
  badge?: string;
};

export function ProductListingPage({
  title,
  description,
  products,
  icon,
  crumbs = [],
  badge,
}: ProductListingPageProps) {
  return (
    <div className="bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-5 flex flex-wrap items-center gap-1 text-xs text-zinc-500">
          <Link href="/" className="hover:underline">Inicio</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1">
              <span>/</span>
              {c.href ? (
                <Link href={c.href} className="hover:underline">{c.label}</Link>
              ) : (
                <span>{c.label}</span>
              )}
            </span>
          ))}
          <span>/</span>
          <span className="font-medium text-zinc-700">{title}</span>
        </nav>

        {/* Hero de sección */}
        <section className="rounded-xl bg-[#0d1b4e] px-6 py-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              {badge && (
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
                  {badge}
                </p>
              )}
              <h1 className="text-xl font-bold sm:text-2xl">
                {icon && <span className="mr-2">{icon}</span>}
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
                {description}
              </p>
            </div>
            {products.length > 0 && (
              <div className="hidden shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center sm:block">
                <p className="text-2xl font-bold text-amber-400">{products.length}</p>
                <p className="text-xs text-zinc-400">productos</p>
              </div>
            )}
          </div>
        </section>

        {/* Grid con load-more */}
        <section className="mt-8">
          <ListingGrid products={products} />
        </section>
      </main>
    </div>
  );
}
