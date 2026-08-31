import { pageMetadata } from "@/lib/seo";
import EventsListView from "./EventsListView";

export const metadata = pageMetadata({
  title: "Събития",
  description:
    "Предстоящи семинари, ретрийти и групови сесии за личностно овластяване.",
  path: "/events",
});

export default function Page() {
  return <EventsListView />;
}
