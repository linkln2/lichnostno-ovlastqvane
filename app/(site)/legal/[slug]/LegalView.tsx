"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { legalPages } from "@/lib/legal";


export default function LegalPage() {
  const { locale } = useLocale();
  const params = useParams<{ slug: string }>();
  const content = legalPages[params.slug];

  if (!content) return notFound();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-50 to-stone-50 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
            {content.title[locale]}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="space-y-8">
          {content.sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-lg font-bold text-stone-900">
                {section.heading[locale]}
              </h2>
              <p className="mt-2 leading-relaxed text-stone-600">
                {section.body[locale]}
              </p>
            </div>
          ))}
        </div>

        {/* Back link */}
        <div className="mt-12 border-t border-stone-200 pt-6">
          <Link href="/" className="text-sm text-stone-500 hover:text-stone-800">
            ← {locale === "bg" ? "Към началото" : "Back to home"}
          </Link>
        </div>
      </section>
    </>
  );
}
