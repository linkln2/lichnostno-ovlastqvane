import { pageMetadata } from "@/lib/seo";
import AboutView from "./AboutView";

export const metadata = pageMetadata({
  title: "За нас",
  description:
    "Запознай се с екипа и мисията зад Личностно овластяване — семинари, коучинг и общност в Бургас.",
  path: "/about",
});

export default function Page() {
  return <AboutView />;
}
