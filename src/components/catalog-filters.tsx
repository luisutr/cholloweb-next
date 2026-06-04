"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import {
  PRODUCT_CATEGORIES,
  type Product,
  type ProductCategory,
  type PlatformFamily,
} from "@/lib/products";
import { PLATFORM_TREE, type GenerationSlug } from "@/lib/platform-hierarchy";

const PAGE_SIZE = 24;

type CatalogFiltersProps = {
  products: Product[];
};

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  videojuegos:  "Videojuegos",
  consolas:     "Consolas",
  accesorios:   "Accesorios",
  figuras:      "🗿 Figuras",
  peliculas:    "🎬 Películas",
};

/** Plataformas sin generación de hardware — no se muestran en el filtro de plataformas */
const PLATFORM_FREE_CATEGORIES: ProductCategory[] = ["figuras", "peliculas"];

type PlatformChip = {
  generation: GenerationSlug;
  label:      string;
  family:     PlatformFamily;
  color:      string; // clases Tailwind para el estado inactivo
  activeColor:string; // clases Tailwind para el estado activo
};

const PLATFORM_CHIPS: PlatformChip[] = PLATFORM_TREE.flatMap((platform) =>
  platform.generations.map((gen) => ({
    generation:  gen.slug,
    label:       gen.label,
    family:      platform.slug as PlatformFamily,
    color: platform.slug === "playstation" ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100"
         : platform.slug === "xbox"        ? "bg-green-50 text-green-700 ring-1 ring-green-200 hover:bg-green-100"
         : platform.slug === "nintendo"    ? "bg-red-50 text-red-700 ring-1 ring-red-200 hover:bg-red-100"
                                           : "bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100",
    activeColor: platform.slug === "playstation" ? "bg-blue-700 text-white ring-1 ring-blue-700"
               : platform.slug === "xbox"        ? "bg-green-700 text-white ring-1 ring-green-700"
               : platform.slug === "nintendo"    ? "bg-red-600 text-white ring-1 ring-red-600"
                                                 : "bg-amber-600 text-white ring-1 ring-amber-600",
  })),
);

export function CatalogFilters({ products }: CatalogFiltersProps) {
  const [query, setQuery]                   = useState("");
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");
  const [activePlatform, setActivePlatform] = useState<GenerationSlug | "all">("all");
  const [visibleCount, setVisibleCount]     = useState(PAGE_SIZE);

  // Si la categoría activa no tiene plataforma (figuras/peliculas), el filtro de plataforma no aplica
  const platformFilterApplies =
    activeCategory === "all" ||
    !PLATFORM_FREE_CATEGORIES.includes(activeCategory);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      const byCategory = activeCategory === "all" || product.category === activeCategory;
      const byPlatform =
        activePlatform === "all" ||
        !platformFilterApplies ||
        product.generation === activePlatform;
      const byQuery = !q || product.title.toLowerCase().includes(q);
      return byCategory && byPlatform && byQuery;
    });
  }, [activeCategory, activePlatform, platformFilterApplies, products, query]);

  function setCategory(cat: ProductCategory | "all") {
    setActiveCategory(cat);
    setActivePlatform("all");
    setVisibleCount(PAGE_SIZE);
  }
  function setPlatform(gen: GenerationSlug | "all") {
    setActivePlatform(gen);
    setVisibleCount(PAGE_SIZE);
  }
  function setSearch(q: string) {
    setQuery(q);
    setVisibleCount(PAGE_SIZE);
  }

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore         = visibleCount < filteredProducts.length;
  const remaining       = filteredProducts.length - visibleCount;

  return (
    <section id="catalogo" className="mt-8">

      {/* Buscador */}
      <div className="mb-4">
        <label htmlFor="q" className="mb-2 block text-sm font-medium text-zinc-700">
          Buscar producto
        </label>
        <input
          id="q"
          name="q"
          value={query}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ejemplo: zelda, ps5, xbox..."
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500"
        />
      </div>

      {/* Filtros de categoría */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            activeCategory === "all"
              ? "bg-zinc-900 text-white"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          Todo
        </button>
        {PRODUCT_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setCategory(category)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              activeCategory === category
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>

      {/* Filtros de plataforma — ocultos si la categoría activa no tiene plataforma */}
      {platformFilterApplies && (
        <div className="mb-5 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPlatform("all")}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              activePlatform === "all"
                ? "bg-zinc-800 text-white"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
            }`}
          >
            Todas las plataformas
          </button>
          {PLATFORM_CHIPS.map((chip) => (
            <button
              key={chip.generation}
              type="button"
              onClick={() => setPlatform(chip.generation)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                activePlatform === chip.generation ? chip.activeColor : chip.color
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <>
          {/* Contador */}
          <p className="mb-4 text-sm text-zinc-500">
            Mostrando{" "}
            <span className="font-medium text-zinc-700">{visibleProducts.length}</span>
            {" "}de{" "}
            <span className="font-medium text-zinc-700">{filteredProducts.length}</span> producto(s)
          </p>

          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Botón "Ver más" */}
          {hasMore && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <div className="h-1.5 w-64 overflow-hidden rounded-full bg-zinc-200">
                <div
                  className="h-full rounded-full bg-zinc-800 transition-all duration-300"
                  style={{ width: `${Math.round((visibleCount / filteredProducts.length) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-zinc-400">
                {visibleCount} de {filteredProducts.length} — quedan {remaining} más
              </p>
              <button
                type="button"
                onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                className="mt-1 rounded-xl border border-zinc-300 bg-white px-8 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm hover:border-zinc-400 hover:bg-zinc-50 active:scale-95"
              >
                Ver {Math.min(remaining, PAGE_SIZE)} más
              </button>
            </div>
          )}

          {!hasMore && filteredProducts.length > PAGE_SIZE && (
            <p className="mt-8 text-center text-xs text-zinc-400">
              Has visto todos los productos ({filteredProducts.length})
            </p>
          )}
        </>
      ) : (
        <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
          No hay resultados para esta búsqueda o filtro.
        </p>
      )}
    </section>
  );
}
