import Link from "next/link";
import { CONSOLE_FAMILIES } from "@/lib/console-families";

export const metadata = {
  title: "Consolas por plataforma | PlayStation, Xbox y Nintendo",
  description:
    "Explora la estructura por plataformas: PlayStation, Xbox y Nintendo, con sus generaciones, videojuegos y accesorios.",
};

export default function ConsolesIndexPage() {
  return (
    <div className="bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Consolas y plataformas
        </h1>
        <p className="mt-3 text-zinc-600">
          Elige la plataforma para ver consolas, videojuegos y accesorios por sistema.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONSOLE_FAMILIES.map((family) => (
            <Link
              key={family.slug}
              href={`/consolas/${family.slug}`}
              className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
            >
              <h2 className="text-lg font-semibold">{family.title}</h2>
              <p className="mt-2 text-sm text-zinc-600">{family.description}</p>
              <p className="mt-2 text-xs text-zinc-500">
                {family.generations.join(" · ")}
              </p>
              <span className="mt-3 inline-block text-sm font-medium text-blue-700">
                Ver sección
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
