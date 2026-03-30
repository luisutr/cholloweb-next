import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { notFound } from "next/navigation";
import { CONSOLE_FAMILIES, getConsoleFamily } from "@/lib/console-families";
import { getProductsByPlatformFamily } from "@/lib/products";

type ConsolePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return CONSOLE_FAMILIES.map((family) => ({ slug: family.slug }));
}

export async function generateMetadata({
  params,
}: ConsolePageProps): Promise<Metadata> {
  const { slug } = await params;
  const family = getConsoleFamily(slug);

  if (!family) {
    return {};
  }

  return {
    title: `${family.title} | Consolas, juegos y accesorios`,
    description: family.description,
    alternates: {
      canonical: `/consolas/${family.slug}`,
    },
  };
}

export default async function ConsolePage({ params }: ConsolePageProps) {
  const { slug } = await params;
  const family = getConsoleFamily(slug);

  if (!family) {
    notFound();
  }

  const products = getProductsByPlatformFamily(family.slug);
  const consoles = products.filter((product) => product.category === "consolas");
  const games = products.filter((product) => product.category === "videojuegos");
  const accessories = products.filter((product) => product.category === "accesorios");

  return (
    <div className="bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h1 className="text-2xl font-bold sm:text-3xl">{family.title}</h1>
          <p className="mt-3 text-zinc-600">{family.description}</p>
          <p className="mt-2 text-sm text-zinc-500">
            Generaciones: {family.generations.join(" · ")}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Consolas</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {consoles.length ? (
              consoles.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
                Pronto añadiremos más consolas de esta plataforma.
              </p>
            )}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Videojuegos</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {games.length ? (
              games.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
                Aún no hay videojuegos cargados para esta plataforma.
              </p>
            )}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Accesorios</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {accessories.length ? (
              accessories.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
                Aún no hay accesorios cargados para esta plataforma.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
