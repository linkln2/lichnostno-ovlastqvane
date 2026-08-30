import { getPayload } from "payload";
import config from "../payload.config";
import { events, blogPosts } from "../lib/content";
import { WHITELISTED_EMAILS } from "../lib/auth";

async function seed() {
  const payload = await getPayload({ config });

  function toLexical(text: string) {
    const paragraphs = text
      .split(/\n\n+/)
      .filter((p) => p.trim().length > 0)
      .map((p) => ({
        type: "paragraph" as const,
        children: [{ type: "text" as const, text: p }],
        direction: "ltr" as const,
        format: "" as const,
        indent: 0,
        version: 1 as const,
      }));

    return {
      root: {
        type: "root" as const,
        children: paragraphs,
        direction: "ltr" as const,
        format: "" as const,
        indent: 0,
        version: 1 as const,
      },
    };
  }

  function toCents(price: { bg: string; en: string }): number {
    const match = price.bg.match(/\d+/);
    return match ? parseInt(match[0], 10) * 100 : 0;
  }

  const existingStaff = await payload.find({
    collection: "staff",
    limit: 1,
    overrideAccess: true,
  });
  if (existingStaff.docs.length === 0) {
    // Create the two whitelisted staff users
    for (const email of WHITELISTED_EMAILS) {
      await payload.create({
        collection: "staff",
        data: {
          name: email.split("@")[0],
          email,
          role: "owner",
          password: process.env.INITIAL_STAFF_PASSWORD || "",
        } as any,
        overrideAccess: true,
      });
      console.log(`Created staff user: ${email}`);
    }
  } else {
    console.log("Staff users already exist");
  }

  for (const event of events) {
    const existing = await payload.find({
      collection: "events",
      where: { slug: { equals: event.slug } },
      limit: 1,
      overrideAccess: true,
    });

    let eventId: string | undefined;
    if (existing.docs.length > 0) {
      eventId = existing.docs[0].id as string;
      console.log(`Event ${event.slug} already exists`);
    } else {
      const created = await payload.create({
        collection: "events",
        data: {
          title: event.title,
          slug: event.slug,
          location: event.location,
          startsAt: event.date,
          endsAt: event.dateEnd,
          capacity: event.capacity,
          status: event.status,
          description: toLexical(event.description.bg),
        } as any,
        overrideAccess: true,
      });
      eventId = created.id as string;
      console.log(`Created event ${event.slug}`);
    }

    for (const pkg of event.packages) {
      const pkgExisting = await payload.find({
        collection: "event-packages",
        where: {
          and: [
            { event: { equals: eventId } },
            { "name.bg": { equals: pkg.name.bg } },
          ],
        },
        limit: 1,
        overrideAccess: true,
      });

      if (pkgExisting.docs.length === 0) {
        await payload.create({
          collection: "event-packages",
          data: {
            event: eventId,
            name: pkg.name,
            priceCents: toCents(pkg.price),
            priceDisplay: pkg.price,
            spots: pkg.spots,
            stripePriceId: "",
          } as any,
          overrideAccess: true,
        });
        console.log(`  Created package ${pkg.name.bg}`);
      }
    }
  }

  for (const post of blogPosts) {
    const existing = await payload.find({
      collection: "blog-posts",
      where: { slug: { equals: post.slug } },
      limit: 1,
      overrideAccess: true,
    });

    if (existing.docs.length === 0) {
      await payload.create({
        collection: "blog-posts",
        data: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          body: toLexical(post.content.bg),
          status: "published",
          publishAt: post.date,
          visibility: "public",
        } as any,
        overrideAccess: true,
      });
      console.log(`Created blog post ${post.slug}`);
    } else {
      console.log(`Blog post ${post.slug} already exists`);
    }
  }

  const existingTerms = await payload.find({
    collection: "pages",
    where: { slug: { equals: "terms" } },
    limit: 1,
    overrideAccess: true,
  });

  if (existingTerms.docs.length === 0) {
    await payload.create({
      collection: "pages",
      data: {
        title: "Terms and Conditions",
        slug: "terms",
        content: toLexical("Terms and conditions content."),
      } as any,
      overrideAccess: true,
    });
    console.log("Created terms page");
  }

  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
