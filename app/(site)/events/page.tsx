import { pageMetadata } from "@/lib/seo";
import { getEvents } from "@/lib/api";
import EventsListView from "./EventsListView";

export const metadata = pageMetadata({
  title: "Събития",
  description:
    "Предстоящи семинари, ретрийти и групови сесии за личностно овластяване.",
  path: "/events",
});

export const dynamic = "force-dynamic";

export default async function Page() {
  const events = await getEvents();
  return <EventsListView events={events} />;
}
