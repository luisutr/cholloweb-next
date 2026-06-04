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
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 text-zinc-100">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/" className="hover:underline hover:text-zinc-300">Inicio</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-400 font-medium">{title}</span>
      </nav>

      <article className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-6 text-sm leading-relaxed text-zinc-300 sm:p-10 shadow-2xl">
        <h1 className="text-2xl font-brand font-black uppercase tracking-wider text-white sm:text-3xl">{title}</h1>
        <p className="mt-1.5 text-xs text-zinc-500">Última actualización: {lastUpdated}</p>

        <div className="mt-8 space-y-8 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-brand [&_h2]:font-bold [&_h2]:uppercase [&_h2]:text-white [&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-zinc-200 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_p]:mt-3 [&_a]:text-primary [&_a]:underline [&_a:hover]:text-blue-400">
          {children}
        </div>
      </article>
    </main>
  );
}
