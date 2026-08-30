import { requireStaff } from "@/lib/dashboard-api";
import { getPayloadInstance } from "@/lib/payload";

// POST /api/dashboard/upload — upload an image to the media collection
// Returns the media ID and URL so the frontend can display the image
export async function POST(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const alt = formData.get("alt") as string | null;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert File to Buffer for Payload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const payload = await getPayloadInstance();
    const media = await payload.create({
      collection: "media",
      data: {
        alt: alt || file.name,
      } as any,
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
      overrideAccess: true,
    });

    // Resolve the URL
    const url = (media as any).url || (media as any).sizes?.thumbnail?.url || null;

    return Response.json({
      success: true,
      id: media.id,
      url,
      alt: alt || file.name,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return Response.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
