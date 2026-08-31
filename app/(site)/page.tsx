import { pageMetadata } from "@/lib/seo";
import HomeView from "./HomeView";

export const metadata = pageMetadata({
  title: "Личностно овластяване | Personal Empowerment",
  description:
    "Семинари, коучинг и общност за личностно овластяване. Върни си своя вътрешен авторитет.",
  path: "/",
});

export default function Page() {
  return <HomeView />;
}
