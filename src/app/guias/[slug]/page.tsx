import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoLandingPage } from "@/components/seo-landing-page";
import { getIntentSeoPage, INTENT_SEO_PAGES } from "@/lib/intent-seo-pages";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return INTENT_SEO_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getIntentSeoPage(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: {
      canonical: `/guias/${page.slug}`,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const page = getIntentSeoPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <SeoLandingPage
      content={page}
      sectionLabel="Guías"
      sectionHref="/guias"
      sectionName="guías de compra"
    />
  );
}
