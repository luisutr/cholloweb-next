import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CONSOLE_FAMILIES } from "@/lib/console-families";
import type { PlatformFamily } from "@/lib/products";

export const metadata: Metadata = {
  title: "Consolas por plataforma | PlayStation, Xbox y Nintendo baratas | cholloweb.es",
  description:
    "Explora consolas, videojuegos y accesorios por plataforma: PlayStation (PS3, PS4, PS5), Xbox y Nintendo Switch con los mejores precios en Amazon.",
  alternates: { canonical: "/consolas" },
};

const COVER_IMAGES: Partial<Record<PlatformFamily, string>> = {
  playstation: "/portadas/ps5.avif",
  xbox:        "/portadas/xbox.jpg",
  nintendo:    "/portadas/switch.webp",
};

export default function ConsolesIndexPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-1 text-xs text-zinc-500">
          <Link href="/" className="hover:underline">Inicio</Link>
          <span>/</span>
          <span className="font-medium text-zinc-300">Consolas</span>
        </nav>

        {/* Hero */}
        <section className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-6 py-6 text-white">
          <h1 className="text-xl font-brand font-bold uppercase sm:text-2xl">Consolas y plataformas</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Elige tu plataforma favorita para ver consolas, videojuegos y accesorios
            con los mejores precios del momento en Amazon.
          </p>
        </section>

        {/* Cards de plataforma con portada */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CONSOLE_FAMILIES.map((family) => {
            const cover = COVER_IMAGES[family.slug as PlatformFamily];
            return (
              <Link
                key={family.slug}
                href={`/consolas/${family.slug}`}
                className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-surface-card shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,127,255,0.15)] hover:border-zinc-700"
              >
                {/* Imagen de fondo */}
                {cover && (
                  <div className="relative h-36 w-full overflow-hidden">
                    <Image
                      src={cover}
                      alt={family.title}
                      fill
                      className="object-cover object-center transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <h2 className="absolute bottom-3 left-4 text-xl font-brand font-black uppercase text-white drop-shadow">
                      {family.title}
                    </h2>
                  </div>
                )}
                <div className="p-4">
                  <p className="text-sm text-zinc-400 leading-relaxed">{family.description}</p>
                  <p className="mt-2 text-xs text-zinc-500">
                    {family.generations.join(" · ")}
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-primary group-hover:underline">
                    Ver ofertas →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
