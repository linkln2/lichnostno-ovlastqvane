"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { tr, getLocalized } from "@/lib/i18n";
import { getPostBySlug, formatDate, blogPosts } from "@/lib/content";

export default function BlogPostPage() {
  const { locale } = useLocale();
  const params = useParams<{ slug: string }>();
  const post = getPostBySlug(params.slug);

  useEffect(() => {
    if (params.slug) {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "blog-posts", slug: params.slug }),
      }).catch(() => {});
    }
  }, [params.slug]);

  if (!post) return notFound();

  const paragraphs = getLocalized(post.content, locale).split("\n\n");
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article>
      {/* Cover image */}
      {post.cover && (
        <div className="relative w-full overflow-hidden">
          <img
            src={post.cover}
            alt={getLocalized(post.title, locale)}
            className="max-h-[600px] w-full object-contain"
          />
        </div>
      )}

      <section className={`bg-gradient-to-b from-amber-50 to-stone-50 py-16 sm:py-20 ${post.cover ? "pt-8" : ""}`}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link href="/blog" className="text-sm text-amber-700 hover:text-amber-800">
            ← {tr("nav_blog", locale)}
          </Link>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-stone-900 sm:text-4xl">
            {getLocalized(post.title, locale)}
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-stone-400">
            <time>{formatDate(post.date, locale)}</time>
            <span>·</span>
            <span>{getLocalized(post.readTime, locale)}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="space-y-5 leading-relaxed text-stone-700">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-stone-200 pt-8">
            <h2 className="text-lg font-bold text-stone-900">
              {locale === "bg" ? "Още статии" : "More posts"}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group rounded-xl border border-stone-200 bg-white p-4 transition-colors hover:border-amber-300"
                >
                  <h3 className="font-semibold text-stone-900 group-hover:text-amber-800">
                    {getLocalized(p.title, locale)}
                  </h3>
                  <p className="mt-1 text-sm text-stone-500">{getLocalized(p.excerpt, locale)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </article>
  );
}
