import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProducts,
  getRelatedProducts,
  getSimilarProducts,
  withAffiliateTag,
  getDiscountPercentage,
} from "@/lib/products";
import type { Product, ProductCategory } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

type Props = { params: Promise<{ id: string }> };

/* ─── helpers ─────────────────────────────────────────────────────────── */

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

const CONDITION_LABELS: Record<string, string> = {
  nuevo: "Nuevo",
  reacondicionado: "Reacondicionado certificado",
  "segunda-mano": "Segunda mano",
};

const CONDITION_COLORS: Record<string, string> = {
  nuevo: "bg-blue-100 text-blue-800",
  reacondicionado: "bg-amber-100 text-amber-800",
  "segunda-mano": "bg-zinc-100 text-zinc-700",
};

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  videojuegos: "Videojuego",
  consolas: "Consola",
  accesorios: "Accesorio",
  figuras: "Figura · Coleccionable",
  peliculas: "Película · Serie",
};

const CATEGORY_EMOJI: Record<ProductCategory, string> = {
  videojuegos: "🎮",
  consolas: "🕹️",
  accesorios: "🎧",
  figuras: "🗿",
  peliculas: "🎬",
};

/** URL de la sección de listado donde vive el producto */
function getCategoryUrl(product: Product): string {
  if (product.category === "figuras" || product.category === "peliculas") {
    return `/${product.category}`;
  }
  if (product.platformFamily !== "multi" && product.generation) {
    return `/${product.platformFamily}/${product.generation}/${product.category}`;
  }
  return `/${product.category}`;
}

/* ─── Static params ────────────────────────────────────────────────────── */

export function generateStaticParams(): { id: string }[] {
  return getProducts()
    .filter((p) => p.price > 0)
    .map((p) => ({ id: p.id }));
}

/* ─── Metadata ──────────────────────────────────────────────────────────── */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProducts().find((p) => p.id === id);
  if (!product) return {};

  const conditionLabel = CONDITION_LABELS[product.condition] ?? product.condition;
  const priceLabel = product.price > 0 ? `${product.price.toFixed(2)} €` : "Consultar precio";

  return {
    title: `${product.title} | cholloweb.es`,
    description: `${conditionLabel} · ${product.platformLabel} · ${priceLabel}. Encuentra las mejores ofertas en cholloweb.es`,
    alternates: { canonical: `/producto/${id}` },
    openGraph: product.imageUrl
      ? {
          title: product.title,
          description: `${conditionLabel} · ${product.platformLabel} · ${priceLabel}`,
          images: [{ url: product.imageUrl, width: 800, height: 800, alt: product.title }],
        }
      : undefined,
  };
}

/* ─── Carrusel de relacionados ─────────────────────────────────────────── */

function RelatedCarousel({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  if (!products.length) return null;

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
        <span className="text-xs text-zinc-400">{products.length} productos</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
        {products.map((p) => (
          <div key={p.id} className="w-52 shrink-0 sm:w-56">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default async function ProductoPage({ params }: Props) {
  const { id } = await params;
  const product = getProducts().find((p) => p.id === id);

  if (!product) notFound();

  const affiliateUrl = withAffiliateTag(product.amazonUrl);
  const discount = getDiscountPercentage(product);
  const unavailable = product.price === 0;

  const related = getRelatedProducts(product, 10);
  const similar = getSimilarProducts(
    product,
    related.map((p) => p.id),
    10,
  );

  const relatedTitle =
    product.platformFamily !== "multi"
      ? `Más ${CATEGORY_LABELS[product.category]} de ${product.platformLabel}`
      : `Más ${CATEGORY_LABELS[product.category]}`;

  return (
    <div className="bg-zinc-50 min-h-screen">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Breadcrumb ────────────────────────────────────────────────── */}
        <nav
          className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-zinc-500"
          aria-label="Ruta de navegación"
        >
          <Link href="/" className="hover:text-zinc-800 hover:underline">
            Inicio
          </Link>
          <span aria-hidden>/</span>
          <Link
            href={getCategoryUrl(product)}
            className="capitalize hover:text-zinc-800 hover:underline"
          >
            {CATEGORY_LABELS[product.category]}
          </Link>
          <span aria-hidden>/</span>
          <span className="max-w-xs truncate font-medium text-zinc-700">
            {product.title}
          </span>
        </nav>

        {/* ── Hero del producto ──────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex flex-col sm:flex-row">

            {/* Imagen */}
            <div className="relative flex h-72 w-full shrink-0 items-center justify-center bg-zinc-100 sm:h-auto sm:w-72 lg:w-96">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 640px) 100vw, 384px"
                  unoptimized
                  priority
                />
              ) : (
                <span className="text-7xl opacity-30" aria-hidden>
                  {CATEGORY_EMOJI[product.category]}
                </span>
              )}

              {/* Badge de descuento */}
              {discount > 0 && !unavailable && (
                <span className="absolute left-3 top-3 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-bold text-white shadow-md">
                  -{discount}%
                </span>
              )}

              {/* Badge personalizado */}
              {product.badge && !unavailable && (
                <span className="absolute right-3 top-3 rounded-lg bg-amber-500 px-2 py-1 text-xs font-bold text-white shadow">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
              <div>
                {/* Etiquetas */}
                <div className="mb-4 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${CONDITION_COLORS[product.condition] ?? "bg-zinc-100 text-zinc-700"}`}
                  >
                    {CONDITION_LABELS[product.condition] ?? product.condition}
                  </span>
                  <span className="rounded-full bg-[#0d1b4e]/10 px-3 py-1 text-xs font-semibold text-[#0d1b4e]">
                    {product.platformLabel}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                    {CATEGORY_LABELS[product.category]}
                  </span>
                  {product.featured && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      ★ Destacado
                    </span>
                  )}
                </div>

                {/* Título */}
                <h1 className="text-xl font-bold leading-snug text-zinc-900 sm:text-2xl lg:text-3xl">
                  {product.title}
                </h1>

                {/* Precio */}
                <div className="mt-5 flex items-end gap-3">
                  {unavailable ? (
                    <p className="text-lg font-semibold text-zinc-400">
                      No disponible actualmente
                    </p>
                  ) : (
                    <>
                      <span className="text-3xl font-extrabold tabular-nums text-zinc-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <span className="mb-0.5 text-base text-zinc-400 line-through">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {discount > 0 && !unavailable && (
                  <p className="mt-1 text-sm font-medium text-emerald-700">
                    Ahorro aprox. del {discount}% respecto al precio habitual
                  </p>
                )}
              </div>

              {/* CTAs */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={affiliateUrl}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  aria-disabled={unavailable}
                  className={`flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-base font-bold shadow-sm transition active:scale-95 ${
                    unavailable
                      ? "pointer-events-none bg-zinc-200 text-zinc-400"
                      : "bg-[#FF9900] text-zinc-900 hover:bg-[#e08800]"
                  }`}
                >
                  {unavailable ? "No disponible" : "Ver en Amazon"} →
                </a>

                <Link
                  href={getCategoryUrl(product)}
                  className="flex items-center justify-center gap-1 rounded-xl border border-zinc-300 px-6 py-3.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                >
                  ← Ver más ofertas
                </Link>
              </div>

              <p className="mt-4 text-xs text-zinc-400">
                Los precios pueden variar. Confirma el precio final en Amazon antes de comprar.
                Este enlace es de afiliado: si compras, recibimos una pequeña comisión sin coste extra para ti.
              </p>
            </div>
          </div>
        </div>

        {/* ── Carruseles de relacionados ─────────────────────────────────── */}
        <RelatedCarousel title={relatedTitle} products={related} />
        <RelatedCarousel title="También te puede interesar" products={similar} />

        {/* Espacio final */}
        <div className="pb-12" />
      </main>
    </div>
  );
}
