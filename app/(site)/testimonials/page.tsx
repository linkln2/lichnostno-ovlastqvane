import { pageMetadata } from "@/lib/seo";
import TestimonialsView from "./TestimonialsView";

export const metadata = pageMetadata({
  title: "Отзиви",
  description:
    "Истории от хора, преминали през нашите семинари и коучинг програми.",
  path: "/testimonials",
});

export default function Page() {
  return <TestimonialsView />;
}
