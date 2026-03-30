"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import {
  PRODUCT_CATEGORIES,
  type Product,
  type ProductCategory,
} from "@/lib/products";

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
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">(
    "all",
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const byCategory =
        activeCategory === "all" ? true : product.category === activeCategory;
      const byQuery = normalizedQuery
        ? product.title.toLowerCase().includes(normalizedQuery)
        : true;

      return byCategory && byQuery;
    });
  }, [activeCategory, products, query]);

  return (
    <section id="catalogo" className="mt-8">
      <div className="mb-4">
        <label htmlFor="q" className="mb-2 block text-sm font-medium text-zinc-700">
          Buscar producto
        </label>
        <input
          id="q"
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ejemplo: zelda, ps5, xbox..."
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500"
        />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            activeCategory === "all"
              ? "bg-zinc-900 text-white"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          Todo
        </button>
        {PRODUCT_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              activeCategory === category
                ? "bg-zinc-900 text-white"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>

      {filteredProducts.length ? (
        <>
          <p className="mb-4 text-sm text-zinc-600">
            Mostrando {filteredProducts.length} producto(s)
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
          No hay resultados para esta categoría con la búsqueda actual.
        </p>
      )}
    </section>
  );
}
