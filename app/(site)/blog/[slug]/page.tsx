import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { blogPosts, getPostBySlug } from "@/lib/content";
import BlogPostView from "./BlogPostView";

// Posts come from the static content module, so every slug can be rendered
// at build time.
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return pageMetadata({
      title: "Статията не е намерена",
      description: "Тази статия не съществува или е преместена.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  // Bulgarian is the default locale, so it drives the crawler-visible copy.
  return pageMetadata({
    title: post.title.bg,
    description: post.excerpt.bg,
    path: `/blog/${post.slug}`,
    image: post.cover,
    type: "article",
    publishedTime: post.date,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Resolve on the server so a bad slug 404s before any JS runs.
  if (!getPostBySlug(slug)) {
    notFound();
  }

  return <BlogPostView />;
}
