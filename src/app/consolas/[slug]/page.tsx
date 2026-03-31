import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { notFound } from "next/navigation";
import { CONSOLE_FAMILIES, getConsoleFamily } from "@/lib/console-families";
import { getPlatformKinds, isMainPlatform } from "@/lib/platform-hierarchy";
import { getProductsByPlatformFamily } from "@/lib/products";
import type { PlatformFamily } from "@/lib/products";

/** Imagen de portada según plataforma */
const COVER_IMAGES: Partial<Record<PlatformFamily, { src: string; alt: string }>> = {
  playstation: { src: "/portadas/ps5.avif", alt: "PlayStation 5" },
  xbox:        { src: "/portadas/xbox.jpg",  alt: "Xbox Series X" },
  nintendo:    { src: "/portadas/switch.webp", alt: "Nintendo Switch" },
};

type ConsolePageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ gen?: string; section?: string }>;
};

export async function generateStaticParams() {
  return CONSOLE_FAMILIES.map((family) => ({ slug: family.slug }));
}

export async function generateMetadata({ params }: ConsolePageProps): Promise<Metadata> {
  const { slug } = await params;
  const family = getConsoleFamily(slug);
  if (!family) return {};

  const cover = COVER_IMAGES[family.slug as PlatformFamily];

  return {
    title: `${family.title} | Consolas, videojuegos y accesorios baratos`,
    description: family.description,
    alternates: { canonical: `/consolas/${family.slug}` },
    openGraph: cover
      ? {
          images: [{ url: cover.src, alt: cover.alt }],
        }
      : undefined,
  };
}

export default async function ConsolePage({ params, searchParams }: ConsolePageProps) {
  const { slug }   = await params;
  const family     = getConsoleFamily(slug);
  const filters    = searchParams ? await searchParams : {};
  if (!family) notFound();

  const cover           = COVER_IMAGES[family.slug as PlatformFamily];
  const generationParam = filters?.gen?.toLowerCase() ?? "";
  const sectionParam    = filters?.section?.toLowerCase() ?? "";

  const products = getProductsByPlatformFamily(family.slug).filter((product) => {
    if (!generationParam) return true;
    const haystack = `${product.title} ${product.platformLabel}`.toLowerCase();
    if (generationParam === "ps3")         return haystack.includes("ps3");
    if (generationParam === "ps4")         return haystack.includes("ps4");
    if (generationParam === "ps5")         return haystack.includes("ps5");
    if (generationParam === "xbox-360")    return haystack.includes("360");
    if (generationParam === "xbox-one")    return haystack.includes("xbox one");
    if (generationParam === "xbox-series") return haystack.includes("series");
    if (generationParam === "switch")      return haystack.includes("switch");
    if (generationParam === "switch-oled") return haystack.includes("oled");
    return true;
  });

  const consoles    = products.filter((p) => p.category === "consolas");
  const games       = products.filter((p) => p.category === "videojuegos");
  const accessories = products.filter((p) => p.category === "accesorios");

  // Secciones permitidas según la plataforma (Evercade no tiene accesorios)
  const allowedKinds = isMainPlatform(family.slug)
    ? getPlatformKinds(family.slug).map((k) => k.slug)
    : (["consolas", "videojuegos", "accesorios"] as const);

  const visibleSections = (
    sectionParam === "consolas" || sectionParam === "videojuegos" || sectionParam === "accesorios"
      ? [sectionParam]
      : ["consolas", "videojuegos", "accesorios"]
  ).filter((s) => allowedKinds.includes(s as "consolas" | "videojuegos" | "accesorios")) as Array<"consolas" | "videojuegos" | "accesorios">;

  return (
    <div className="bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-1 text-xs text-zinc-500">
          <Link href="/" className="hover:underline">Inicio</Link>
          <span>/</span>
          <Link href="/consolas" className="hover:underline">Consolas</Link>
          <span>/</span>
          <span className="font-medium text-zinc-700">{family.title}</span>
        </nav>

        {/* Hero con imagen de portada */}
        <section className="relative overflow-hidden rounded-xl bg-[#0d1b4e] text-white">
          {cover && (
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              className="object-cover object-center opacity-20"
              priority
              sizes="(max-width: 1152px) 100vw, 1152px"
            />
          )}
          <div className="relative px-6 py-8 sm:px-10">
            <h1 className="text-2xl font-bold sm:text-3xl">{family.title}</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-300">
              {family.description}
            </p>
            <p className="mt-3 text-xs text-zinc-400">
              Generaciones: <span className="text-amber-400">{family.generations.join(" · ")}</span>
            </p>

            {/* Links rápidos a generaciones */}
            <div className="mt-5 flex flex-wrap gap-2">
              {family.generations.map((gen) => {
                const genSlug = gen.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-");
                return (
                  <Link
                    key={gen}
                    href={`/${family.slug}/${genSlug}/videojuegos`}
                    className="rounded-full border border-white/20 px-3 py-1 text-xs text-zinc-300 transition hover:border-amber-400 hover:text-amber-400"
                  >
                    {gen}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {(generationParam || sectionParam) && (
          <p className="mt-3 text-sm text-amber-700">
            Filtro activo:
            {generationParam ? ` generación ${generationParam}` : ""}
            {sectionParam ? ` · sección ${sectionParam}` : ""}
          </p>
        )}

        {/* Secciones de productos */}
        {visibleSections.includes("consolas") && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold">Consolas {family.title}</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {consoles.length ? (
                consoles.map((p) => <ProductCard key={p.id} product={p} />)
              ) : (
                <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
                  Pronto añadiremos más consolas de esta plataforma.
                </p>
              )}
            </div>
          </section>
        )}

        {visibleSections.includes("videojuegos") && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold">Videojuegos {family.title}</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {games.length ? (
                games.map((p) => <ProductCard key={p.id} product={p} />)
              ) : (
                <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
                  Aún no hay videojuegos cargados para esta plataforma.
                </p>
              )}
            </div>
          </section>
        )}

        {visibleSections.includes("accesorios") && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold">Accesorios {family.title}</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {accessories.length ? (
                accessories.map((p) => <ProductCard key={p.id} product={p} />)
              ) : (
                <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
                  Aún no hay accesorios cargados para esta plataforma.
                </p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
