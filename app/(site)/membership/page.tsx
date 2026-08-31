import { pageMetadata } from "@/lib/seo";
import MembershipView from "./MembershipView";

export const metadata = pageMetadata({
  title: "Членство",
  description:
    "Присъедини се към общността — нива на членство, предимства и достъп до Inner Circle.",
  path: "/membership",
});

export default function Page() {
  return <MembershipView />;
}
