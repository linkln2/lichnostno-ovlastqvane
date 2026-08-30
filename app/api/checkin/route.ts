import { requireStaff } from "@/lib/dashboard-api";
import { getPayloadInstance } from "@/lib/payload";
import { verifyQrToken } from "@/lib/qr";

// POST /api/checkin — verifies a QR token and marks the registration as checked in
export async function POST(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const token = String(body.token || "");

    if (!token) {
      return Response.json({ error: "No token provided" }, { status: 400 });
    }

    const decoded = verifyQrToken(token);
    if (!decoded) {
      return Response.json({
        success: false,
        status: "invalid",
        message: "Invalid QR code",
      });
    }

    const payload = await getPayloadInstance();

    // Find the registration
    const reg = await payload.findByID({
      collection: "registrations",
      id: decoded.regId,
      overrideAccess: true,
    });

    if (!reg) {
      return Response.json({
        success: false,
        status: "not_found",
        message: "Registration not found",
      });
    }

    // Check if already checked in
    if (reg.status === "checked_in") {
      return Response.json({
        success: false,
        status: "duplicate",
        message: "Already checked in",
        registration: {
          name: reg.name,
          email: reg.email,
          package: reg.package,
        },
      });
    }

    // Mark as checked in
    await payload.update({
      collection: "registrations",
      id: reg.id,
      data: { status: "checked_in" },
      overrideAccess: true,
    });

    return Response.json({
      success: true,
      status: "checked_in",
      message: "Checked in successfully",
      registration: {
        name: reg.name,
        email: reg.email,
        package: reg.package,
      },
    });
  } catch (err) {
    console.error("Check-in error:", err);
    return Response.json({ error: "Check-in failed" }, { status: 500 });
  }
}
