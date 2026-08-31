import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { getLegalPage, legalSlugs } from "@/lib/legal";
import LegalView from "./LegalView";

export function generateStaticParams() {
  return legalSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = getLegalPage(slug);

  if (!content) {
    return pageMetadata({
      title: "Страницата не е намерена",
      description: "Тази страница не съществува.",
      path: `/legal/${slug}`,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: content.title.bg,
    description: `${content.title.bg} — Личностно овластяване.`,
    path: `/legal/${slug}`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!getLegalPage(slug)) {
    notFound();
  }

  return <LegalView />;
}
