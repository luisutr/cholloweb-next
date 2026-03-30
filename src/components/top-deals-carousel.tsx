"use client";

import { useRef } from "react";

import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";

export function TopDealsCarousel({ products }: { products: Product[] }) {
  const rail = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    const el = rail.current;
    if (!el) return;
    // Desplaza por el ancho de una tarjeta (primer hijo)
    const card = el.firstElementChild as HTMLElement | null;
    const step = (card?.offsetWidth ?? 280) + 16; // 16 = gap-4
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  }

  if (!products.length) return null;

  return (
    <div className="relative">
      {/* Botón izquierda */}
      <button
        onClick={() => scroll("left")}
        aria-label="Anterior"
        className="absolute -left-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-md transition hover:bg-zinc-100 active:scale-95"
      >
        <svg className="h-4 w-4 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Rail deslizable */}
      <div
        ref={rail}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="[scroll-snap-align:start] w-[calc(100%-1rem)] shrink-0 sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)] lg:w-[calc(25%-0.75rem)]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Botón derecha */}
      <button
        onClick={() => scroll("right")}
        aria-label="Siguiente"
        className="absolute -right-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-md transition hover:bg-zinc-100 active:scale-95"
      >
        <svg className="h-4 w-4 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
