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
  params: Promise<{ platform: string; generation: string; kind: string }>;
};

export async function generateStaticParams() {
  const params: Array<{ platform: MainPlatform; generation: GenerationSlug; kind: KindSlug }> = [];
  for (const platform of PLATFORM_TREE) {
    for (const generation of platform.generations) {
      for (const kind of KIND_OPTIONS) {
        params.push({ platform: platform.slug, generation: generation.slug, kind: kind.slug });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: HierarchyPageProps): Promise<Metadata> {
  const { platform, generation, kind } = await params;
  if (!isMainPlatform(platform) || !isGenerationSlug(generation) || !isKindSlug(kind)) return {};

  const pLabel = getPlatformLabel(platform);
  const gLabel = getGenerationLabel(generation);
  const kLabel = KIND_OPTIONS.find((k) => k.slug === kind)?.label ?? kind;

  const title = `${kLabel} ${gLabel} baratos | Ofertas ${pLabel} | cholloweb.es`;
  const description = buildDescription(platform, generation, kind, pLabel, gLabel, kLabel);

  return {
    title,
    description,
    alternates: { canonical: `/${platform}/${generation}/${kind}` },
  };
}

/* ── Texto SEO dinámico según combinación ─────────────────── */

function buildDescription(
  platform: MainPlatform,
  generation: GenerationSlug,
  kind: KindSlug,
  pLabel: string,
  gLabel: string,
  kLabel: string,
): string {
  if (kind === "consolas") {
    return `Encuentra las mejores ofertas en consolas ${gLabel} al mejor precio. Comparamos precios nuevos, reacondicionados y de segunda mano en Amazon España.`;
  }
  if (kind === "videojuegos") {
    return `Los mejores chollos en videojuegos de ${gLabel}. Juegos nuevos, de segunda mano y reacondicionados con los mayores descuentos en Amazon. Ahorra en tu próximo juego de ${pLabel}.`;
  }
  if (kind === "accesorios") {
    return `Accesorios para ${gLabel} al mejor precio: mandos, auriculares, fundas, cables y más. Comparamos ofertas nuevas y reacondicionadas en Amazon España.`;
  }
  return `Catálogo de ${kLabel.toLowerCase()} para ${gLabel} con las mejores ofertas en Amazon.`;
}

const PAGE_INTRO: Partial<
  Record<MainPlatform, Partial<Record<GenerationSlug, Partial<Record<KindSlug, string>>>>>
> = {
  playstation: {
    ps5: {
      videojuegos: "PS5 cuenta con uno de los catálogos más completos de la generación actual. Desde exclusivos como Spider-Man 2 y God of War Ragnarök hasta los últimos lanzamientos multiformato, aquí encontrarás los mejores precios del momento en Amazon.",
      consolas:    "La PlayStation 5 es la consola de sobremesa más vendida de la generación actual. Disponible en versión estándar con lector de discos y versión Digital Edition. Encuentra las mejores ofertas, bundles y kits en Amazon.",
      accesorios:  "Saca el máximo partido a tu PS5 con accesorios compatibles: mandos DualSense adicionales, auriculares Pulse, bases de carga, fundas protectoras y más. Compara precios y ahorra en Amazon.",
    },
    ps4: {
      videojuegos: "PS4 tiene uno de los catálogos más amplios de la historia. Exclusivos como The Last of Us, Horizon Zero Dawn o God of War a precios increíbles. Muchos juegos de PS4 son también compatibles con PS5.",
      consolas:    "PlayStation 4 y PS4 Pro siguen siendo excelentes opciones para jugar con un catálogo enorme. Encuentra consolas nuevas, reacondicionadas y de segunda mano al mejor precio en Amazon.",
      accesorios:  "Amplía tu setup de PS4 con mandos DualShock 4, auriculares, volantes, bases de carga y mucho más. Gran selección de accesorios nuevos y de segunda mano.",
    },
    ps3: {
      videojuegos: "El catálogo de PS3 es uno de los más valorados por los coleccionistas. Grandes sagas como Uncharted, Demon's Souls y Metal Gear Solid 4 a precios muy asequibles.",
      consolas:    "PlayStation 3 es una consola clásica con un catálogo de culto. Encuentra unidades en buen estado a precios de retro gaming.",
      accesorios:  "Accesorios compatibles con PS3: mandos SIXAXIS y DualShock 3, cables HDMI, discos duros y más.",
    },
  },
  xbox: {
    "xbox-series": {
      videojuegos: "Xbox Series X|S ofrece Game Pass y retrocompatibilidad total con generaciones anteriores. Encuentra los mejores juegos al mejor precio, muchos de ellos incluidos también en Xbox Game Pass.",
      consolas:    "Xbox Series X (la más potente del mercado) y Xbox Series S (la más asequible) son las opciones de Microsoft para la generación actual. Compara precios y bundles en Amazon.",
      accesorios:  "Mandos Xbox adicionales, auriculares compatibles, bases de carga, fundas y kits de juego. Accesorios para Xbox Series X|S al mejor precio.",
    },
    "xbox-one": {
      videojuegos: "Gran catálogo de Xbox One con títulos exclusivos y multiformato. Muchos juegos son retrocompatibles con Xbox Series, lo que los convierte en una compra con valor duradero.",
      consolas:    "Xbox One y Xbox One X: consolas de la generación anterior con una propuesta de precio muy atractiva. Perfectas si quieres acceder al ecosistema Xbox con un presupuesto ajustado.",
      accesorios:  "Accesorios para Xbox One: mandos adicionales, headsets, bases de carga, fundas y más. Compatible también con muchos periféricos de Xbox Series.",
    },
    "xbox-360": {
      videojuegos: "La Xbox 360 tiene un catálogo clásico con joyas como Gears of War, Halo 3 y Red Dead Redemption. Muchos títulos están disponibles a precios muy bajos.",
      consolas:    "Xbox 360: la consola que popularizó el gaming online en consolas. Clásico imprescindible del retro gaming.",
      accesorios:  "Accesorios para Xbox 360: mandos inalámbricos, cables, kits de memoria y más.",
    },
  },
  nintendo: {
    switch: {
      videojuegos: "Nintendo Switch tiene exclusivos irrepetibles: The Legend of Zelda, Mario Kart 8 Deluxe, Animal Crossing y Pokémon. Juegos para toda la familia a precios competitivos en Amazon.",
      consolas:    "Nintendo Switch es única por su versatibilidad: juega en el salón o llévala contigo. Disponible en versión estándar, Switch Lite y Switch OLED. Compara precios y bundles.",
      accesorios:  "Accesorios para Nintendo Switch: Joy-Con adicionales, fundas de transporte, bases extra, volantes y mucho más. Protege y amplía tu Switch al mejor precio.",
    },
    "switch-oled": {
      videojuegos: "Los mismos títulos de Nintendo Switch son 100% compatibles con la versión OLED. Disfruta de los mejores juegos de Nintendo con una pantalla OLED de 7 pulgadas.",
      consolas:    "Nintendo Switch OLED: la versión premium de Switch con pantalla OLED de 7 pulgadas, mayor almacenamiento interno y altavoces mejorados. Encuentra las mejores ofertas en Amazon.",
      accesorios:  "Accesorios específicos para Switch OLED y compatibles con todas las versiones de Switch: fundas, protectores de pantalla, bases y Joy-Con.",
    },
  },
};

export default async function HierarchyPage({ params }: HierarchyPageProps) {
  const { platform, generation, kind } = await params;

  if (!isMainPlatform(platform) || !isGenerationSlug(generation) || !isKindSlug(kind)) {
    notFound();
  }

  const products    = getProductsByHierarchy(platform, generation, kind);
  const pLabel      = getPlatformLabel(platform);
  const gLabel      = getGenerationLabel(generation);
  const kLabel      = KIND_OPTIONS.find((k) => k.slug === kind)?.label ?? kind;
  const introText   = PAGE_INTRO[platform]?.[generation]?.[kind];
  const siblingKinds = KIND_OPTIONS.filter((k) => k.slug !== kind);

  return (
    <div className="bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-5 flex flex-wrap items-center gap-1 text-xs text-zinc-500">
          <Link href="/" className="hover:underline">Inicio</Link>
          <span>/</span>
          <Link href={`/consolas/${platform}`} className="hover:underline">{pLabel}</Link>
          <span>/</span>
          <span className="text-zinc-700 font-medium">{gLabel} · {kLabel}</span>
        </nav>

        {/* Hero de sección */}
        <section className="rounded-xl bg-[#0d1b4e] px-6 py-6 text-white">
          <h1 className="text-xl font-bold sm:text-2xl">
            {kLabel} {gLabel}
            <span className="ml-2 text-amber-400">· Ofertas</span>
          </h1>
          {introText ? (
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-300">{introText}</p>
          ) : (
            <p className="mt-2 text-sm text-zinc-300">
              Catálogo de {kLabel.toLowerCase()} para {gLabel} con los mejores precios y descuentos en Amazon España.
            </p>
          )}

          {/* Links a las otras categorías del mismo nivel */}
          <div className="mt-4 flex flex-wrap gap-2">
            {siblingKinds.map((k) => (
              <Link
                key={k.slug}
                href={`/${platform}/${generation}/${k.slug}`}
                className="rounded-full border border-white/20 px-3 py-1 text-xs text-zinc-300 transition hover:border-amber-400 hover:text-amber-400"
              >
                {k.label} {gLabel}
              </Link>
            ))}
            <Link
              href={`/consolas/${platform}`}
              className="rounded-full border border-white/20 px-3 py-1 text-xs text-zinc-300 transition hover:border-amber-400 hover:text-amber-400"
            >
              Todo {pLabel}
            </Link>
          </div>
        </section>

        {/* Filtros y productos */}
        <SectionStateFilters products={products} />

        {/* Bloque SEO inferior (solo si hay pocos productos) */}
        {products.length < 4 && (
          <section className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
            <h2 className="mb-3 text-base font-semibold text-zinc-900">
              ¿Buscas {kLabel.toLowerCase()} de {gLabel}?
            </h2>
            <p>
              Estamos ampliando continuamente nuestro catálogo. Muy pronto tendrás disponibles
              las mejores ofertas de {kLabel.toLowerCase()} para {gLabel} con precios actualizados
              desde Amazon. También puedes explorar todo el catálogo de{" "}
              <Link href={`/consolas/${platform}`} className="font-medium text-[#0d1b4e] hover:underline">
                {pLabel}
              </Link>{" "}
              o buscar en el{" "}
              <Link href="/#catalogo" className="font-medium text-[#0d1b4e] hover:underline">
                catálogo general
              </Link>.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
