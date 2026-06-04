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
    <div className="bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-1 text-xs text-zinc-500">
          <Link href="/" className="hover:underline">Inicio</Link>
          <span>/</span>
          <span className="font-medium text-zinc-700">Consolas</span>
        </nav>

        {/* Hero */}
        <section className="rounded-xl bg-[#0d1b4e] px-6 py-6 text-white">
          <h1 className="text-xl font-bold sm:text-2xl">Consolas y plataformas</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300">
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
                className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b4e]/80 to-transparent" />
                    <h2 className="absolute bottom-3 left-4 text-xl font-bold text-white drop-shadow">
                      {family.title}
                    </h2>
                  </div>
                )}
                <div className="p-4">
                  <p className="text-sm text-zinc-600">{family.description}</p>
                  <p className="mt-2 text-xs text-zinc-400">
                    {family.generations.join(" · ")}
                  </p>
                  <span className="mt-3 inline-block text-sm font-semibold text-amber-600 group-hover:underline">
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
