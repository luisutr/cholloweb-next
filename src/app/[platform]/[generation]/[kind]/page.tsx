import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionStateFilters } from "@/components/section-state-filters";
import {
  getGenerationLabel,
  getPlatformLabel,
  isGenerationSlug,
  isKindSlug,
  isMainPlatform,
  KIND_OPTIONS,
  PLATFORM_TREE,
  type GenerationSlug,
  type KindSlug,
  type MainPlatform,
} from "@/lib/platform-hierarchy";
import { getProductsByHierarchy } from "@/lib/products";

type HierarchyPageProps = {
  params: Promise<{
    platform: string;
    generation: string;
    kind: string;
  }>;
};

export async function generateStaticParams() {
  const params: Array<{ platform: MainPlatform; generation: GenerationSlug; kind: KindSlug }> =
    [];

  for (const platform of PLATFORM_TREE) {
    for (const generation of platform.generations) {
      for (const kind of KIND_OPTIONS) {
        params.push({
          platform: platform.slug,
          generation: generation.slug,
          kind: kind.slug,
        });
      }
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: HierarchyPageProps): Promise<Metadata> {
  const { platform, generation, kind } = await params;

  if (!isMainPlatform(platform) || !isGenerationSlug(generation) || !isKindSlug(kind)) {
    return {};
  }

  const platformLabel = getPlatformLabel(platform);
  const generationLabel = getGenerationLabel(generation);
  const kindLabel = KIND_OPTIONS.find((item) => item.slug === kind)?.label ?? kind;

  return {
    title: `${kindLabel} ${generationLabel} | ${platformLabel} | cholloweb.es`,
    description: `Catálogo de ${kindLabel.toLowerCase()} para ${generationLabel}. Filtra por nuevo, reacondicionado, segunda mano y ofertas.`,
    alternates: {
      canonical: `/${platform}/${generation}/${kind}`,
    },
  };
}

export default async function HierarchyPage({ params }: HierarchyPageProps) {
  const { platform, generation, kind } = await params;

  if (!isMainPlatform(platform) || !isGenerationSlug(generation) || !isKindSlug(kind)) {
    notFound();
  }

  const products = getProductsByHierarchy(platform, generation, kind);
  const platformLabel = getPlatformLabel(platform);
  const generationLabel = getGenerationLabel(generation);
  const kindLabel = KIND_OPTIONS.find((item) => item.slug === kind)?.label ?? kind;

  return (
    <div className="bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-4 text-sm text-zinc-500">
          <Link href="/" className="hover:underline">
            Inicio
          </Link>{" "}
          /{" "}
          <Link href={`/consolas/${platform}`} className="hover:underline">
            {platformLabel}
          </Link>{" "}
          /{" "}
          <span>{generationLabel}</span> / <span>{kindLabel}</span>
        </nav>

        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h1 className="text-2xl font-bold sm:text-3xl">
            {platformLabel} {generationLabel} · {kindLabel}
          </h1>
          <p className="mt-3 text-zinc-600">
            Página específica por jerarquía de menú (nivel 1, 2 y 3) con filtros por
            estado y tipo de oferta.
          </p>
        </section>

        <SectionStateFilters products={products} />
      </main>
    </div>
  );
}
