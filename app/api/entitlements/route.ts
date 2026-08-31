import { getPayloadInstance } from "@/lib/payload";
import { getCustomerEntitlements } from "@/lib/entitlements";
import { requireCustomer } from "@/lib/auth-request";

// GET /api/entitlements — returns all entitlements for the logged-in customer
export async function GET(request: Request) {
  const auth = await requireCustomer(request);
  if (!auth.ok) return auth.response;

  try {
    const payload = await getPayloadInstance();

    const entitlements = await getCustomerEntitlements(
      payload,
      auth.user.id,
      auth.user.email,
    );

    return Response.json(entitlements);
  } catch (err) {
    console.error("Entitlements error:", err);
    return Response.json({ error: "Failed to load entitlements" }, { status: 500 });
  }
}
