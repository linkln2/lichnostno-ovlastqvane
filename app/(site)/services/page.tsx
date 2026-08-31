import { pageMetadata } from "@/lib/seo";
import ServicesView from "./ServicesView";

export const metadata = pageMetadata({
  title: "Услуги",
  description:
    "Коучинг, Theta терапия, констелации и медитация — индивидуално и в група.",
  path: "/services",
});

export default function Page() {
  return <ServicesView />;
}
