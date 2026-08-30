import { getPayloadInstance } from "@/lib/payload";

// POST /api/track — increments view count for a blog post or event
// Body: { collection: "blog-posts" | "events", slug: "..." }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { collection, slug } = body;

    if (!collection || !slug) {
      return Response.json({ error: "Missing collection or slug" }, { status: 400 });
    }

    if (collection !== "blog-posts" && collection !== "events") {
      return Response.json({ error: "Invalid collection" }, { status: 400 });
    }

    const payload = await getPayloadInstance();

    // Find the document by slug
    const { docs } = await payload.find({
      collection,
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    });

    if (docs.length === 0) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const doc = docs[0] as any;
    const currentViews = doc.viewCount || 0;

    // Increment view count
    await payload.update({
      collection,
      id: doc.id,
      data: { viewCount: currentViews + 1 },
      overrideAccess: true,
    });

    return Response.json({ success: true, views: currentViews + 1 });
  } catch (err) {
    console.error("Track error:", err);
    return Response.json({ error: "Failed to track" }, { status: 500 });
  }
}
