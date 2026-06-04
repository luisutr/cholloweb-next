"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { Product, ProductCondition } from "@/lib/products";

type SectionFilter = "all" | ProductCondition | "oferta";

type SectionStateFiltersProps = {
  products: Product[];
};

const FILTER_LABELS: Record<SectionFilter, string> = {
  all: "Todo",
  nuevo: "Nuevo",
  "segunda-mano": "Segunda mano",
  reacondicionado: "Reacondicionado",
  oferta: "Oferta",
};

export function SectionStateFilters({ products }: SectionStateFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<SectionFilter>("all");
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const byQuery = normalizedQuery
        ? product.title.toLowerCase().includes(normalizedQuery)
        : true;

      const byFilter =
        activeFilter === "all"
          ? true
          : activeFilter === "oferta"
            ? Boolean(product.oldPrice && product.oldPrice > product.price)
            : product.condition === activeFilter;

      return byQuery && byFilter;
    });
  }, [activeFilter, products, query]);

  const filterOptions: SectionFilter[] = [
    "all",
    "nuevo",
    "reacondicionado",
    "segunda-mano",
    "oferta",
  ];

  return (
    <section className="mt-6">
      <div className="mb-4">
        <label htmlFor="section-search" className="mb-2 block text-sm font-medium text-zinc-400">
          Buscar en esta sección
        </label>
        <input
          id="section-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar producto..."
          className="w-full rounded-lg border border-zinc-800 bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-primary transition"
        />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {filterOptions.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
              activeFilter === filter
                ? "bg-primary text-black"
                : "bg-[#141414] text-zinc-400 border border-zinc-800 hover:bg-[#1c1c1c] hover:text-zinc-200"
            }`}
          >
            {FILTER_LABELS[filter]}
          </button>
        ))}
      </div>

      {filteredProducts.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-6 text-sm text-zinc-450">
          No hay resultados para este filtro en la sección.
        </p>
      )}
    </section>
  );
}
