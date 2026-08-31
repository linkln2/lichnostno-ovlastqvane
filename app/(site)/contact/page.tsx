import { pageMetadata } from "@/lib/seo";
import ContactView from "./ContactView";

export const metadata = pageMetadata({
  title: "Контакти",
  description:
    "Свържи се с нас за семинари, коучинг сесии и въпроси относно членството.",
  path: "/contact",
});

export default function Page() {
  return <ContactView />;
}
