import { getPayloadInstance } from "@/lib/payload";
import { requireStaff } from "@/lib/auth-request";

// GET /api/dashboard/homepage — returns the homepage global
// PUT /api/dashboard/homepage — updates the homepage global
export async function GET(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const payload = await getPayloadInstance();
    const data = await payload.findGlobal({ slug: "homepage" });
    return Response.json({ data });
  } catch (err) {
    console.error("Homepage global fetch failed:", err);
    return Response.json({ data: null, error: "Not configured yet" }, { status: 200 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const payload = await getPayloadInstance();
    const data = await payload.updateGlobal({
      slug: "homepage",
      data: body,
    });
    return Response.json({ data });
  } catch (err) {
    console.error("Homepage global update failed:", err);
    return Response.json({ error: "Failed to save homepage settings" }, { status: 500 });
  }
}
