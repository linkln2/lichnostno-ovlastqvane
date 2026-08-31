import { pageMetadata } from "@/lib/seo";
import BlogListView from "./BlogListView";

export const metadata = pageMetadata({
  title: "Блог",
  description:
    "Статии за личностно овластяване, осъзнатост и връщане на вътрешния авторитет.",
  path: "/blog",
});

export default function Page() {
  return <BlogListView />;
}
