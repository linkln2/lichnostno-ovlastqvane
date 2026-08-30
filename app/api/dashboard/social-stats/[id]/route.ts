import { requireStaff, updateRecord, deleteRecord } from "@/lib/dashboard-api";

// PATCH /api/dashboard/social-stats/[id] — update a social stat
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();
    await updateRecord("social-stats", id, {
      ...(body.platform !== undefined && { platform: body.platform }),
      ...(body.handle !== undefined && { handle: body.handle }),
      ...(body.followers !== undefined && { followers: Number(body.followers) }),
      ...(body.posts !== undefined && { posts: Number(body.posts) }),
      ...(body.engagementRate !== undefined && { engagementRate: Number(body.engagementRate) }),
      lastUpdated: new Date().toISOString(),
    });
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE /api/dashboard/social-stats/[id] — delete a social stat
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    await deleteRecord("social-stats", id);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Failed to delete" }, { status: 500 });
  }
}
