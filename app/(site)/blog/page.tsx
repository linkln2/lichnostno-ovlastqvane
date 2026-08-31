import { pageMetadata } from "@/lib/seo";
import { getBlogPosts } from "@/lib/api";
import BlogListView from "./BlogListView";

export const metadata = pageMetadata({
  title: "Блог",
  description:
    "Статии за личностно овластяване, осъзнатост и връщане на вътрешния авторитет.",
  path: "/blog",
});

export const dynamic = "force-dynamic";

export default async function Page() {
  const posts = await getBlogPosts();
  return <BlogListView posts={posts} />;
}
