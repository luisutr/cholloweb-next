import type { ProductCategory } from "@/lib/products";

export type MainPlatform = "playstation" | "xbox" | "nintendo" | "evercade";
export type GenerationSlug =
  | "ps3"
  | "ps4"
  | "ps5"
  | "xbox-360"
  | "xbox-one"
  | "xbox-series"
  | "switch"
  | "switch-2"
  | "evercade-handheld";

export type KindSlug = Extract<ProductCategory, "consolas" | "videojuegos" | "accesorios">;

type GenerationNode = {
  slug: GenerationSlug;
  label: string;
};

type PlatformNode = {
  slug: MainPlatform;
  label: string;
  generations: GenerationNode[];
  /** Categorías disponibles para esta plataforma. Por defecto: todas (consolas, videojuegos, accesorios). */
  kinds?: KindSlug[];
};

export const KIND_OPTIONS: Array<{ slug: KindSlug; label: string }> = [
  { slug: "consolas",    label: "Consolas" },
  { slug: "videojuegos", label: "Videojuegos" },
  { slug: "accesorios",  label: "Accesorios" },
];

export const PLATFORM_TREE: PlatformNode[] = [
  {
    slug: "playstation",
    label: "PlayStation",
    generations: [
      { slug: "ps3", label: "PS3" },
      { slug: "ps4", label: "PS4" },
      { slug: "ps5", label: "PS5" },
    ],
  },
  {
    slug: "xbox",
    label: "Xbox",
    generations: [
      { slug: "xbox-360",    label: "Xbox 360" },
      { slug: "xbox-one",    label: "Xbox One" },
      { slug: "xbox-series", label: "Xbox Series X/S" },
    ],
  },
  {
    slug: "nintendo",
    label: "Nintendo",
    generations: [
      { slug: "switch",   label: "Switch" },
      { slug: "switch-2", label: "Switch 2" },
    ],
  },
  {
    slug: "evercade",
    label: "Evercade",
    generations: [
      { slug: "evercade-handheld", label: "Evercade" },
    ],
    // Evercade no tiene accesorios propios en el catálogo
    kinds: ["consolas", "videojuegos"],
  },
];

export function isMainPlatform(value: string): value is MainPlatform {
  return PLATFORM_TREE.some((p) => p.slug === value);
}

export function isGenerationSlug(value: string): value is GenerationSlug {
  return PLATFORM_TREE.flatMap((p) => p.generations).some((g) => g.slug === value);
}

export function isKindSlug(value: string): value is KindSlug {
  return KIND_OPTIONS.some((k) => k.slug === value);
}

export function getPlatformLabel(slug: MainPlatform): string {
  return PLATFORM_TREE.find((p) => p.slug === slug)?.label ?? slug;
}

export function getGenerationLabel(slug: GenerationSlug): string {
  return (
    PLATFORM_TREE.flatMap((p) => p.generations).find((g) => g.slug === slug)?.label ?? slug
  );
}

/** Devuelve las categorías disponibles para una plataforma (respeta la restricción kinds) */
export function getPlatformKinds(slug: MainPlatform): Array<{ slug: KindSlug; label: string }> {
  const platform = PLATFORM_TREE.find((p) => p.slug === slug);
  if (!platform?.kinds) return KIND_OPTIONS;
  return KIND_OPTIONS.filter((k) => platform.kinds!.includes(k.slug));
}
