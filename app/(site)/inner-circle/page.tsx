import { pageMetadata } from "@/lib/seo";
import InnerCircleView from "./InnerCircleView";

export const metadata = pageMetadata({
  title: "Inner Circle",
  description:
    "Ексклузивно пространство за членове на Личностно овластяване.",
  path: "/inner-circle",
  noIndex: true,
});

export default function Page() {
  return <InnerCircleView />;
}
