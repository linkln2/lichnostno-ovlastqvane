import { ensureEvent, getPayloadInstance } from "@/lib/payload";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.name || !body.email || !body.phone) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const event = await ensureEvent(String(body.eventSlug || ""));
    if (!event) {
      return Response.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const payload = await getPayloadInstance();
    const registration = await payload.create({
      collection: "registrations",
      data: {
        event: event.id,
        name: String(body.name),
        email: String(body.email),
        phone: String(body.phone),
        city: body.city ? String(body.city) : undefined,
        package: body.package ? String(body.package) : undefined,
        notes: body.notes ? String(body.notes) : undefined,
        locale: body.locale || "bg",
        status: body.status || "pending",
      },
      overrideAccess: true,
    });

    return Response.json({ success: true, id: registration.id });
  } catch (err) {
    console.error("Registration error:", err);
    return Response.json(
      { error: "Failed to save registration" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Disabled: registration data is sensitive and should only be accessed
  // through the authenticated admin dashboard once Payload auth is live.
  return Response.json({ error: "Forbidden" }, { status: 403 });
}
