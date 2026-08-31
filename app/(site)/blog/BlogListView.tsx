"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { tr } from "@/lib/i18n";
import { formatDate, type BlogPost } from "@/lib/content";

export default function BlogPage({ posts }: { posts: BlogPost[] }) {
  const { locale } = useLocale();

  return (
    <>
      <section className="bg-gradient-to-b from-amber-50 to-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
            {tr("nav_blog", locale)}
          </h1>
          <p className="mt-4 text-lg text-stone-600">
            {locale === "bg"
              ? "Мисли, практики и размисли за личностно овластяване."
              : "Thoughts, practices, and reflections on personal empowerment."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition-colors hover:border-amber-300 hover:shadow-lg"
            >
              {post.cover ? (
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={post.cover}
                    alt={post.title[locale]}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="h-2 w-full bg-gradient-to-r from-amber-400 to-amber-600" />
              )}
              <div className="flex flex-1 flex-col p-6">
                <time className="text-xs text-stone-400">
                  {formatDate(post.date, locale)}
                </time>
                <h2 className="mt-2 text-lg font-bold text-stone-900 group-hover:text-amber-800">
                  {post.title[locale]}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
                  {post.excerpt[locale]}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-stone-400">
                  <span>{post.readTime[locale]}</span>
                  <span className="font-semibold text-amber-700 group-hover:text-amber-800">
                    {tr("btn_read_more", locale)} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
