import { pageMetadata } from "@/lib/seo";
import { getHomepageContent, getEvents, getBlogPosts } from "@/lib/api";
import HomeView from "./HomeView";

export const metadata = pageMetadata({
  title: "Личностно овластяване | Personal Empowerment",
  description:
    "Семинари, коучинг и общност за личностно овластяване. Върни си своя вътрешен авторитет.",
  path: "/",
});

export const dynamic = "force-dynamic";

export default async function Page() {
  const [homepageContent, events, blogPosts] = await Promise.all([
    getHomepageContent(),
    getEvents(),
    getBlogPosts(),
  ]);
  return (
    <HomeView
      homepageContent={homepageContent}
      events={events}
      blogPosts={blogPosts}
    />
  );
}
