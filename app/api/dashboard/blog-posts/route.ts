import { requireStaff, createRecord, locField } from "@/lib/dashboard-api";

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
