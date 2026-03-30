"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  category: string;
  asin?: string;
};

const CATEGORY_ICON: Record<string, string> = {
  consolas:    "🎮",
  videojuegos: "💿",
  accesorios:  "🕹️",
  figuras:     "🗿",
};

/**
 * Imagen de producto con fallback automático.
 *
 * Estrategia de carga:
 *  1. URL original (del JSON / PA-API)
 *  2. CDN EU de Amazon  (para ASINs con imágenes en europa)
 *  3. CDN moderno m.media-amazon.com
 *  4. Placeholder con icono de categoría (siempre funciona)
 */
export function ProductImage({ src, alt, category, asin }: Props) {
  const fallbacks = [
    src,
    asin ? `https://images-eu.ssl-images-amazon.com/images/P/${asin}.01._SL300_.jpg`  : "",
    asin ? `https://m.media-amazon.com/images/P/${asin}.01._SL300_.jpg` : "",
  ].filter(Boolean);

  const [index, setIndex] = useState(0);
  const [failed, setFailed]  = useState(false);

  function tryNext() {
    if (index + 1 < fallbacks.length) {
      setIndex((i) => i + 1);
    } else {
      setFailed(true);
    }
  }

  if (failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-zinc-100">
        <span className="text-4xl opacity-40">{CATEGORY_ICON[category] ?? "📦"}</span>
        <span className="px-4 text-center text-xs text-zinc-400 line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={fallbacks[index]}
      alt={alt}
      onError={tryNext}
      className="h-full w-full object-contain"
    />
  );
}
