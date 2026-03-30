import type { MetadataRoute } from "next";
import { CONSOLE_FAMILIES } from "@/lib/console-families";
import { INTENT_SEO_PAGES } from "@/lib/intent-seo-pages";
import { KIND_OPTIONS, PLATFORM_TREE } from "@/lib/platform-hierarchy";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cholloweb.es";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${baseUrl}/consolas`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/comparativas`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/videojuegos`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/videojuegos/nuevos`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.78,
    },
    {
      url: `${baseUrl}/videojuegos/segunda-mano`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.78,
    },
    {
      url: `${baseUrl}/videojuegos/reacondicionados`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.78,
    },
    {
      url: `${baseUrl}/videojuegos/ofertas`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.82,
    },
    {
      url: `${baseUrl}/accesorios`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/accesorios/nuevos`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.73,
    },
    {
      url: `${baseUrl}/accesorios/segunda-mano`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.73,
    },
    {
      url: `${baseUrl}/accesorios/reacondicionados`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.73,
    },
    {
      url: `${baseUrl}/accesorios/ofertas`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.77,
    },
    {
      url: `${baseUrl}/destacados`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/ofertas`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/segunda-mano`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/reacondicionados`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nuevos`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/guias`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/aviso-legal`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/afiliacion`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.2,
    },
  ];

  const consoleRoutes: MetadataRoute.Sitemap = CONSOLE_FAMILIES.map((family) => ({
    url: `${baseUrl}/consolas/${family.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  const guideRoutes: MetadataRoute.Sitemap = INTENT_SEO_PAGES.map((page) => ({
    url: `${baseUrl}/guias/${page.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const hierarchyRoutes: MetadataRoute.Sitemap = PLATFORM_TREE.flatMap((platform) =>
    platform.generations.flatMap((generation) =>
      KIND_OPTIONS.map((kind) => ({
        url: `${baseUrl}/${platform.slug}/${generation.slug}/${kind.slug}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.78,
      })),
    ),
  );

  return [...staticRoutes, ...consoleRoutes, ...guideRoutes, ...hierarchyRoutes];
}
