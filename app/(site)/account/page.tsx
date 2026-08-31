import { pageMetadata } from "@/lib/seo";
import AccountView from "./AccountView";

export const metadata = pageMetadata({
  title: "Моят профил",
  description:
    "Твоите поръчки, регистрации и абонамент.",
  path: "/account",
  noIndex: true,
});

export default function Page() {
  return <AccountView />;
}
