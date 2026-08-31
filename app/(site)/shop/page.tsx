import { pageMetadata } from "@/lib/seo";
import { getProducts } from "@/lib/api";
import ShopListView from "./ShopListView";

export const metadata = pageMetadata({
  title: "Магазин",
  description:
    "Гривни, кристали и еликсири, подбрани за твоя път на осъзнаване.",
  path: "/shop",
});

// Force dynamic rendering — products come from the database at request time.
export const dynamic = "force-dynamic";

export default async function Page() {
  const products = await getProducts();
  return <ShopListView products={products} />;
}
