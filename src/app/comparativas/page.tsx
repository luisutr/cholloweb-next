import Link from "next/link";

export const metadata = {
  title: "Comparativas de consolas | cholloweb.es",
  description:
    "Sección de comparativas entre consolas y ecosistemas para ayudarte a decidir qué sistema comprar.",
};

export default function ComparisonPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-6 shadow-2xl">
          <h1 className="text-2xl font-brand font-black uppercase tracking-wider text-white sm:text-3xl">Comparativas</h1>
          <p className="mt-3 text-sm text-zinc-400">
            Esta sección agrupará comparativas de plataformas y generaciones para
            decidir mejor entre consolas, accesorios y tipo de catálogo.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              href="/consolas/playstation"
              className="rounded-full border border-blue-900/60 bg-blue-950/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400 transition hover:border-blue-600 hover:bg-blue-950/50"
            >
              PlayStation
            </Link>
            <Link
              href="/consolas/xbox"
              className="rounded-full border border-emerald-900/60 bg-emerald-950/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-450 transition hover:border-emerald-600 hover:bg-emerald-950/50"
            >
              Xbox
            </Link>
            <Link
              href="/consolas/nintendo"
              className="rounded-full border border-red-900/60 bg-red-950/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-400 transition hover:border-red-650 hover:bg-red-950/50"
            >
              Nintendo
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
