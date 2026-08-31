import { pageMetadata } from "@/lib/seo";
import SuccessView from "./SuccessView";

// Post-checkout confirmation — never indexed.
export const metadata = pageMetadata({
  title: "Благодарим ти!",
  description: "Плащането е успешно.",
  path: "/membership/success",
  noIndex: true,
});

export default function Page() {
  return <SuccessView />;
}
