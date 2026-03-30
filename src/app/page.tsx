import Image from "next/image";
import Link from "next/link";
import { CatalogFilters } from "@/components/catalog-filters";
import { getProducts, getTopDeals, withAffiliateTag } from "@/lib/products";

export default function Home() {
  const products = getProducts();
  const topDeals = getTopDeals(3);

  return (
    <div className="bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-xl bg-zinc-900 px-4 py-4 text-white sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-zinc-300">
                cholloweb.es
              </p>
              <h1 className="text-lg font-bold sm:text-xl">
                Ofertas gaming y tecnología
              </h1>
            </div>
            <p className="max-w-md text-right text-xs text-zinc-300 sm:text-sm">
              Chollos en videojuegos, consolas, figuras y reacondicionados.
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
          <h2 className="text-base font-semibold text-zinc-900">Top ofertas destacadas</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {topDeals.map((product) => (
              <a
                key={`top-${product.id}`}
                href={withAffiliateTag(product.amazonUrl)}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-zinc-200 p-2 transition hover:bg-zinc-50"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-xs font-medium text-zinc-800">
                    {product.title}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900">
                    {new Intl.NumberFormat("es-ES", {
                      style: "currency",
                      currency: "EUR",
                    }).format(product.price)}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
          <h2 className="text-base font-semibold text-zinc-900">
            Estructura principal de la web
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            Navega por consolas, videojuegos, accesorios y tipo de estado del
            producto.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/consolas/playstation"
              className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
            >
              PlayStation (PS3, PS4, PS5)
            </Link>
            <Link
              href="/consolas/xbox"
              className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
            >
              Xbox (360, One, Series)
            </Link>
            <Link
              href="/consolas/nintendo"
              className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
            >
              Nintendo (Switch)
            </Link>
            <Link
              href="/ofertas"
              className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800"
            >
              Ofertas
            </Link>
            <Link
              href="/segunda-mano"
              className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800"
            >
              Segunda mano
            </Link>
            <Link
              href="/reacondicionados"
              className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800"
            >
              Reacondicionados
            </Link>
            <Link
              href="/destacados"
              className="rounded-full bg-zinc-900 px-3 py-1 text-sm font-medium text-white"
            >
              Ver destacados
            </Link>
          </div>
        </section>

        <CatalogFilters products={products} />

        <section className="mt-12 rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
          <p>
            Algunos enlaces de esta web son enlaces de afiliado. Si compras a
            través de ellos, podemos recibir una comisión sin coste adicional
            para ti.
          </p>
          <p className="mt-2">
            Importante: los precios y disponibilidad pueden cambiar en Amazon
            en cualquier momento.
          </p>
        </section>
      </main>
    </div>
  );
}
