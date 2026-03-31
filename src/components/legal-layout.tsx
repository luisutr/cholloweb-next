import Link from "next/link";

export function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/" className="hover:underline">Inicio</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-700">{title}</span>
      </nav>

      <article className="rounded-xl border border-zinc-200 bg-white p-6 text-sm leading-relaxed text-zinc-700 sm:p-10">
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">{title}</h1>
        <p className="mt-1 text-xs text-zinc-400">Última actualización: {lastUpdated}</p>

        <div className="mt-8 space-y-8 [&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-zinc-900 [&_h3]:mt-4 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-zinc-800 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_p]:mt-3 [&_a]:text-[#0d1b4e] [&_a]:underline [&_a:hover]:text-amber-600">
          {children}
        </div>
      </article>
    </main>
  );
}
