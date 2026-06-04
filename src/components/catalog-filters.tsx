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
    color: platform.slug === "playstation" ? "bg-blue-950/20 text-blue-400 border border-blue-900/60 hover:bg-blue-950/40"
         : platform.slug === "xbox"        ? "bg-emerald-950/20 text-emerald-450 border border-emerald-900/60 hover:bg-emerald-950/40"
         : platform.slug === "nintendo"    ? "bg-red-950/20 text-red-400 border border-red-900/60 hover:bg-red-950/40"
                                           : "bg-amber-950/20 text-amber-400 border border-amber-900/60 hover:bg-amber-950/40",
    activeColor: platform.slug === "playstation" ? "bg-blue-600 text-white border border-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
               : platform.slug === "xbox"        ? "bg-emerald-600 text-white border border-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.4)]"
               : platform.slug === "nintendo"    ? "bg-red-600 text-white border border-red-600 shadow-[0_0_8px_rgba(220,38,38,0.4)]"
                                                 : "bg-amber-600 text-white border border-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.4)]",
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
        <label htmlFor="q" className="mb-2 block text-sm font-medium text-zinc-400">
          Buscar producto
        </label>
        <input
          id="q"
          name="q"
          value={query}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ejemplo: zelda, ps5, xbox..."
          className="w-full rounded-lg border border-zinc-800 bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-primary transition"
        />
      </div>

      {/* Filtros de categoría */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
            activeCategory === "all"
              ? "bg-primary text-black"
              : "bg-[#141414] text-zinc-400 border border-zinc-850 hover:bg-zinc-900 hover:text-zinc-200"
          }`}
        >
          Todo
        </button>
        {PRODUCT_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setCategory(category)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeCategory === category
                ? "bg-primary text-black"
                : "bg-[#141414] text-zinc-400 border border-zinc-850 hover:bg-zinc-900 hover:text-zinc-200"
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
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              activePlatform === "all"
                ? "bg-zinc-800 text-white"
                : "bg-zinc-900/50 text-zinc-500 border border-zinc-850 hover:bg-zinc-800 hover:text-zinc-350"
            }`}
          >
            Todas las plataformas
          </button>
          {PLATFORM_CHIPS.map((chip) => (
            <button
              key={chip.generation}
              type="button"
              onClick={() => setPlatform(chip.generation)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
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
            <span className="font-semibold text-zinc-300">{visibleProducts.length}</span>
            {" "}de{" "}
            <span className="font-semibold text-zinc-300">{filteredProducts.length}</span> producto(s)
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
              <div className="h-1.5 w-64 overflow-hidden rounded-full bg-zinc-900">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${Math.round((visibleCount / filteredProducts.length) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-zinc-550">
                {visibleCount} de {filteredProducts.length} — quedan {remaining} más
              </p>
              <button
                type="button"
                onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                className="mt-1 rounded-xl border border-zinc-800 bg-zinc-900 px-8 py-2.5 text-sm font-semibold text-zinc-350 shadow-sm hover:border-zinc-700 hover:bg-zinc-850 hover:text-white transition active:scale-95"
              >
                Ver {Math.min(remaining, PAGE_SIZE)} más
              </button>
            </div>
          )}

          {!hasMore && filteredProducts.length > PAGE_SIZE && (
            <p className="mt-8 text-center text-xs text-zinc-500">
              Has visto todos los productos ({filteredProducts.length})
            </p>
          )}
        </>
      ) : (
        <p className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-6 text-sm text-zinc-450">
          No hay resultados para esta búsqueda o filtro.
        </p>
      )}
    </section>
  );
}
