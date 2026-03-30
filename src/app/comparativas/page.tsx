import Link from "next/link";

export const metadata = {
  title: "Comparativas de consolas | cholloweb.es",
  description:
    "Sección de comparativas entre consolas y ecosistemas para ayudarte a decidir qué sistema comprar.",
};

export default function ComparisonPage() {
  return (
    <div className="bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h1 className="text-2xl font-bold sm:text-3xl">Comparativas</h1>
          <p className="mt-3 text-zinc-600">
            Esta sección agrupará comparativas de plataformas y generaciones para
            decidir mejor entre consolas, accesorios y tipo de catálogo.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/consolas/playstation"
              className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
            >
              PlayStation
            </Link>
            <Link
              href="/consolas/xbox"
              className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
            >
              Xbox
            </Link>
            <Link
              href="/consolas/nintendo"
              className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
            >
              Nintendo
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
