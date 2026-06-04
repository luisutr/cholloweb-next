import Link from "next/link";

export type SeoLandingContent = {
  shortName: string;
  h1: string;
  intro: string;
  searchIntents: string[];
  buyingTips: string[];
  faq: Array<{ question: string; answer: string }>;
};

type SeoLandingPageProps = {
  content: SeoLandingContent;
  sectionLabel: string;
  sectionHref: string;
  sectionName: string;
};

export function SeoLandingPage({
  content,
  sectionLabel,
  sectionHref,
  sectionName,
}: SeoLandingPageProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="bg-black text-zinc-100 min-h-screen">
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-4 text-sm text-zinc-500">
          <Link href="/" className="hover:underline hover:text-zinc-300">
            Inicio
          </Link>{" "}
          /{" "}
          <Link href={sectionHref} className="hover:underline hover:text-zinc-300">
            {sectionLabel}
          </Link>{" "}
          / <span className="text-zinc-400">{content.shortName}</span>
        </nav>

        <article className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-6 sm:p-8 shadow-2xl">
          <h1 className="text-2xl font-brand font-black uppercase tracking-wider text-white sm:text-3xl leading-tight">
            {content.h1}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-350">{content.intro}</p>

          <section className="mt-8">
            <h2 className="text-lg font-bold text-zinc-200 uppercase tracking-wide">Búsquedas clave de esta página</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-350 text-sm">
              {content.searchIntents.map((intent) => (
                <li key={intent}>{intent}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-bold text-zinc-200 uppercase tracking-wide">Consejos para comprar mejor</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-350 text-sm">
              {content.buyingTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-bold text-zinc-200 uppercase tracking-wide">Preguntas frecuentes</h2>
            <div className="mt-3 space-y-3">
              {content.faq.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-lg border border-zinc-800 bg-[#141414] p-3 transition"
                >
                  <summary className="cursor-pointer font-medium text-zinc-200 group-hover:text-primary transition-colors">
                    {item.question}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-lg border border-zinc-800 bg-[#18181b] p-4 text-zinc-100">
            <h2 className="text-base font-bold text-zinc-100">Siguiente paso recomendado</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Visita también nuestra sección de {sectionName} y el catálogo general
              para detectar nuevas bajadas de precio.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <Link
                href={sectionHref}
                className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 transition"
              >
                Ver {sectionName}
              </Link>
              <Link
                href="/#catalogo"
                className="inline-block rounded-md border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-sm font-bold text-zinc-300 hover:border-zinc-500 hover:bg-zinc-900 transition"
              >
                Ver catálogo principal
              </Link>
            </div>
          </section>
        </article>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
