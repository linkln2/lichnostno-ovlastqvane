import { getPayload } from "payload";
import config from "@payload-config";
import { events as staticEvents } from "./content";

export async function getPayloadInstance() {
  return getPayload({ config });
}

export async function ensureEvent(slug: string) {
  const payload = await getPayloadInstance();

  const found = await payload.find({
    collection: "events",
    where: { slug: { equals: slug } },
    limit: 1,
  });

  if (found.docs.length > 0) {
    return found.docs[0];
  }

  const data = staticEvents.find((e) => e.slug === slug);
  if (!data) {
    return null;
  }

  return payload.create({
    collection: "events",
    data: {
      title: data.title,
      slug: data.slug,
      location: data.location,
      startsAt: data.date,
      endsAt: data.dateEnd,
      capacity: data.capacity,
      status: data.status,
    } as any,
    overrideAccess: true,
  });
}
