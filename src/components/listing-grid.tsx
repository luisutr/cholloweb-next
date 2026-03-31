"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";

const PAGE_SIZE = 24;

export function ListingGrid({ products }: { products: Product[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (!products.length) {
    return (
      <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
        Aún no hay productos en esta sección. Vuelve pronto — actualizamos el catálogo
        regularmente.
      </p>
    );
  }

  const visible   = products.slice(0, visibleCount);
  const hasMore   = visibleCount < products.length;
  const remaining = products.length - visibleCount;

  return (
    <>
      <p className="mb-4 text-sm text-zinc-500">
        Mostrando{" "}
        <span className="font-medium text-zinc-700">{visible.length}</span> de{" "}
        <span className="font-medium text-zinc-700">{products.length}</span> producto(s)
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="h-1.5 w-64 overflow-hidden rounded-full bg-zinc-200">
            <div
              className="h-full rounded-full bg-[#0d1b4e] transition-all duration-300"
              style={{ width: `${Math.round((visibleCount / products.length) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-zinc-400">
            {visibleCount} de {products.length} — quedan {remaining} más
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

      {!hasMore && products.length > PAGE_SIZE && (
        <p className="mt-8 text-center text-xs text-zinc-400">
          Has visto todos los productos ({products.length})
        </p>
      )}
    </>
  );
}
