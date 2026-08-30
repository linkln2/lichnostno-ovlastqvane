import { requireStaff, fetchCollection, createRecord, updateRecord, deleteRecord } from "@/lib/dashboard-api";

// GET /api/dashboard/social-stats — list all social stats
export async function GET(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const { docs, totalDocs } = await fetchCollection<any>("social-stats", {
    sort: "platform",
  });

  return Response.json({
    totalDocs,
    docs: docs.map((s) => ({
      id: s.id,
      platform: s.platform,
      handle: s.handle,
      followers: s.followers || 0,
      posts: s.posts || 0,
      engagementRate: s.engagementRate || 0,
      lastUpdated: s.lastUpdated,
    })),
  });
}

// POST /api/dashboard/social-stats — create a new social stat entry
export async function POST(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const record = await createRecord("social-stats", {
      platform: body.platform,
      handle: body.handle || "",
      followers: Number(body.followers) || 0,
      posts: Number(body.posts) || 0,
      engagementRate: Number(body.engagementRate) || 0,
      lastUpdated: new Date().toISOString(),
    });
    return Response.json({ success: true, id: record.id });
  } catch (err) {
    return Response.json({ error: "Failed to create" }, { status: 500 });
  }
}
