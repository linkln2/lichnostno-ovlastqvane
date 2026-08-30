import { requireStaff, fetchCollection, createRecord, locField, loc } from "@/lib/dashboard-api";

export async function GET(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const { docs, totalDocs } = await fetchCollection<any>("blog-posts", {
    sort: "-publishAt",
    limit: 50,
  });

  return Response.json({
    totalDocs,
    docs: docs.map((p) => ({
      id: p.id,
      title: loc(p.title),
      slug: p.slug,
      excerpt: loc(p.excerpt),
      status: p.status,
      publishAt: p.publishAt,
      visibility: p.visibility,
    })),
  });
}

export async function POST(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const record = await createRecord("blog-posts", {
      title: locField(body.titleBg || body.title || "", body.titleEn || body.title || ""),
      slug: body.slug,
      excerpt: locField(body.excerptBg || "", body.excerptEn || ""),
      status: body.status || "draft",
      visibility: body.visibility || "public",
      publishAt: body.publishAt || undefined,
    });
    return Response.json({ success: true, id: record.id });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
