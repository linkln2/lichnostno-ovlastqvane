import { pageMetadata } from "@/lib/seo";
import FeedView from "./FeedView";

export const metadata = pageMetadata({
  title: "Емисия",
  description:
    "Последни видеа и публикации от Личностно овластяване.",
  path: "/feed",
});

export default function Page() {
  return <FeedView />;
}
