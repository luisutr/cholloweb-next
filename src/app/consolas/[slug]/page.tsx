import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { notFound } from "next/navigation";
import { CONSOLE_FAMILIES, getConsoleFamily } from "@/lib/console-families";
import { getProductsByPlatformFamily } from "@/lib/products";

type ConsolePageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{
    gen?: string;
    section?: string;
  }>;
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

export default async function ConsolePage({
  params,
  searchParams,
}: ConsolePageProps) {
  const { slug } = await params;
  const family = getConsoleFamily(slug);
  const filters = searchParams ? await searchParams : {};

  if (!family) {
    notFound();
  }

  const generationParam = filters?.gen?.toLowerCase() ?? "";
  const sectionParam = filters?.section?.toLowerCase() ?? "";

  const products = getProductsByPlatformFamily(family.slug).filter((product) => {
    if (!generationParam) return true;

    const haystack = `${product.title} ${product.platformLabel}`.toLowerCase();

    if (generationParam === "ps3") return haystack.includes("ps3");
    if (generationParam === "ps4") return haystack.includes("ps4");
    if (generationParam === "ps5") return haystack.includes("ps5");
    if (generationParam === "xbox-360") return haystack.includes("360");
    if (generationParam === "xbox-one") return haystack.includes("xbox one");
    if (generationParam === "xbox-series") return haystack.includes("series");
    if (generationParam === "switch") return haystack.includes("switch");
    if (generationParam === "switch-oled") return haystack.includes("oled");

    return true;
  });

  const consoles = products.filter((product) => product.category === "consolas");
  const games = products.filter((product) => product.category === "videojuegos");
  const accessories = products.filter((product) => product.category === "accesorios");
  const visibleSections: Array<"consolas" | "videojuegos" | "accesorios"> =
    sectionParam === "consolas" || sectionParam === "videojuegos" || sectionParam === "accesorios"
      ? [sectionParam]
      : ["consolas", "videojuegos", "accesorios"];

  return (
    <div className="bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h1 className="text-2xl font-bold sm:text-3xl">{family.title}</h1>
          <p className="mt-3 text-zinc-600">{family.description}</p>
          <p className="mt-2 text-sm text-zinc-500">
            Generaciones: {family.generations.join(" · ")}
          </p>
          {generationParam || sectionParam ? (
            <p className="mt-2 text-sm text-blue-700">
              Filtro activo:
              {generationParam ? ` generación ${generationParam}` : ""}
              {sectionParam ? ` · sección ${sectionParam}` : ""}
            </p>
          ) : null}
        </section>

        {visibleSections.includes("consolas") ? (
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
        ) : null}

        {visibleSections.includes("videojuegos") ? (
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
        ) : null}

        {visibleSections.includes("accesorios") ? (
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
        ) : null}
      </main>
    </div>
  );
}
