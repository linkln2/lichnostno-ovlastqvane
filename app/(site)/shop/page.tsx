import { pageMetadata } from "@/lib/seo";
import ShopListView from "./ShopListView";

export const metadata = pageMetadata({
  title: "Магазин",
  description:
    "Гривни, кристали и еликсири, подбрани за твоя път на осъзнаване.",
  path: "/shop",
});

export default function Page() {
  return <ShopListView />;
}
