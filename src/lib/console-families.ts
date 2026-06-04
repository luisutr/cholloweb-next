import type { PlatformFamily } from "@/lib/products";

export type ConsoleFamily = {
  slug: PlatformFamily;
  title: string;
  description: string;
  generations: string[];
};

export const CONSOLE_FAMILIES: ConsoleFamily[] = [
  {
    slug: "playstation",
    title: "PlayStation",
    description:
      "Sección de PlayStation con foco en PS3, PS4 y PS5: consolas, juegos y accesorios.",
    generations: ["PS3", "PS4", "PS5"],
  },
  {
    slug: "xbox",
    title: "Xbox",
    description:
      "Sección de Xbox desde Xbox 360 en adelante: consola, juegos, mandos y packs.",
    generations: ["Xbox 360", "Xbox One", "Xbox Series X/S"],
  },
  {
    slug: "nintendo",
    title: "Nintendo",
    description:
      "Sección Nintendo desde Switch en adelante, con juegos y accesorios destacados.",
    generations: ["Switch", "Switch 2"],
  },
  {
    slug: "evercade",
    title: "Evercade",
    description:
      "Consola retro de cartuchos de Blaze Entertainment. Coleccionismo y retrogaming al mejor precio.",
    generations: ["Evercade"],
  },
];

export function getConsoleFamily(slug: string): ConsoleFamily | undefined {
  return CONSOLE_FAMILIES.find((family) => family.slug === slug);
}
