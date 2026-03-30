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
    <div className="bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-4 text-sm text-zinc-500">
          <Link href="/" className="hover:underline">
            Inicio
          </Link>{" "}
          /{" "}
          <Link href={sectionHref} className="hover:underline">
            {sectionLabel}
          </Link>{" "}
          / <span>{content.shortName}</span>
        </nav>

        <article className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
            {content.h1}
          </h1>
          <p className="mt-4 text-zinc-700">{content.intro}</p>

          <section className="mt-8">
            <h2 className="text-lg font-semibold">Búsquedas clave de esta página</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-700">
              {content.searchIntents.map((intent) => (
                <li key={intent}>{intent}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-semibold">Consejos para comprar mejor</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-700">
              {content.buyingTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-semibold">Preguntas frecuentes</h2>
            <div className="mt-3 space-y-3">
              {content.faq.map((item) => (
                <details
                  key={item.question}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-3"
                >
                  <summary className="cursor-pointer font-medium text-zinc-900">
                    {item.question}
                  </summary>
                  <p className="mt-2 text-sm text-zinc-700">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-lg bg-zinc-900 p-4 text-zinc-100">
            <h2 className="text-base font-semibold">Siguiente paso recomendado</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Visita también nuestra sección de {sectionName} y el catálogo general
              para detectar nuevas bajadas de precio.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={sectionHref}
                className="inline-block rounded-md bg-white px-3 py-2 text-sm font-medium text-zinc-900"
              >
                Ver {sectionName}
              </Link>
              <Link
                href="/#catalogo"
                className="inline-block rounded-md border border-white/40 px-3 py-2 text-sm font-medium text-white"
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
