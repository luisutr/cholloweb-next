import type { MetadataRoute } from "next";
import { CONSOLE_FAMILIES } from "@/lib/console-families";
import { INTENT_SEO_PAGES } from "@/lib/intent-seo-pages";

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
      url: `${baseUrl}/accesorios`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.75,
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

  return [...staticRoutes, ...consoleRoutes, ...guideRoutes];
}
