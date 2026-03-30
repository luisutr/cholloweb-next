import type { ProductCategory } from "@/lib/products";

export type MainPlatform = "playstation" | "xbox" | "nintendo";
export type GenerationSlug =
  | "ps3"
  | "ps4"
  | "ps5"
  | "xbox-360"
  | "xbox-one"
  | "xbox-series"
  | "switch"
  | "switch-oled";

export type KindSlug = Extract<ProductCategory, "consolas" | "videojuegos" | "accesorios">;

type GenerationNode = {
  slug: GenerationSlug;
  label: string;
};

type PlatformNode = {
  slug: MainPlatform;
  label: string;
  generations: GenerationNode[];
};

export const KIND_OPTIONS: Array<{ slug: KindSlug; label: string }> = [
  { slug: "consolas", label: "Consolas" },
  { slug: "videojuegos", label: "Videojuegos" },
  { slug: "accesorios", label: "Accesorios" },
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
      { slug: "xbox-360", label: "Xbox 360" },
      { slug: "xbox-one", label: "Xbox One" },
      { slug: "xbox-series", label: "Xbox Series X/S" },
    ],
  },
  {
    slug: "nintendo",
    label: "Nintendo",
    generations: [
      { slug: "switch", label: "Nintendo Switch" },
      { slug: "switch-oled", label: "Switch OLED" },
    ],
  },
];

export function isMainPlatform(value: string): value is MainPlatform {
  return PLATFORM_TREE.some((platform) => platform.slug === value);
}

export function isGenerationSlug(value: string): value is GenerationSlug {
  return PLATFORM_TREE.flatMap((platform) => platform.generations).some(
    (generation) => generation.slug === value,
  );
}

export function isKindSlug(value: string): value is KindSlug {
  return KIND_OPTIONS.some((kind) => kind.slug === value);
}

export function getPlatformLabel(slug: MainPlatform): string {
  return PLATFORM_TREE.find((platform) => platform.slug === slug)?.label ?? slug;
}

export function getGenerationLabel(slug: GenerationSlug): string {
  return (
    PLATFORM_TREE.flatMap((platform) => platform.generations).find(
      (generation) => generation.slug === slug,
    )?.label ?? slug
  );
}
