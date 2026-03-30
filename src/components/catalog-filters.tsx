"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import {
  PRODUCT_CATEGORIES,
  type Product,
  type ProductCategory,
} from "@/lib/products";

const PAGE_SIZE = 24; // múltiplo de 2, 3 y 4 → encaja en todas las columnas del grid

type CatalogFiltersProps = {
  products: Product[];
};

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  videojuegos: "Videojuegos",
  consolas: "Consolas",
  accesorios: "Accesorios",
  figuras: "Figuras",
};

export function CatalogFilters({ products }: CatalogFiltersProps) {
  const [query, setQuery]               = useState("");
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const byCategory = activeCategory === "all" || product.category === activeCategory;
      const byQuery    = !normalizedQuery || product.title.toLowerCase().includes(normalizedQuery);
      return byCategory && byQuery;
    });
  }, [activeCategory, products, query]);

  // Al cambiar filtro o búsqueda, volver a la primera página
  function setCategory(cat: ProductCategory | "all") {
    setActiveCategory(cat);
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
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            activeCategory === "all" ? "bg-zinc-900 text-white" : "bg-blue-100 text-blue-800"
          }`}
        >
          Todo
        </button>
        {PRODUCT_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setCategory(category)}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              activeCategory === category ? "bg-zinc-900 text-white" : "bg-blue-100 text-blue-800"
            }`}
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>

      {filteredProducts.length > 0 ? (
        <>
          {/* Contador */}
          <p className="mb-4 text-sm text-zinc-500">
            Mostrando <span className="font-medium text-zinc-700">{visibleProducts.length}</span>
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
              {/* Barra de progreso */}
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

          {/* Mensaje al llegar al final */}
          {!hasMore && filteredProducts.length > PAGE_SIZE && (
            <p className="mt-8 text-center text-xs text-zinc-400">
              Has visto todos los productos ({filteredProducts.length})
            </p>
          )}
        </>
      ) : (
        <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
          No hay resultados para esta categoría con la búsqueda actual.
        </p>
      )}
    </section>
  );
}
