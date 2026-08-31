import { pageMetadata } from "@/lib/seo";
import { getSubscriptionTiers } from "@/lib/api";
import MembershipView from "./MembershipView";

export const metadata = pageMetadata({
  title: "Членство",
  description:
    "Присъедини се към общността — нива на членство, предимства и достъп до Inner Circle.",
  path: "/membership",
});

export const dynamic = "force-dynamic";

export default async function Page() {
  const tiers = await getSubscriptionTiers();
  return <MembershipView tiers={tiers} />;
}
