import { NextResponse } from "next/server";
import { createPortalSession } from "@/lib/stripe";
import { getPayloadInstance } from "@/lib/payload";
import { requireCustomer } from "@/lib/auth-request";

// Stripe Customer Portal — lets authenticated subscribers manage their
// own subscription (cancel, upgrade, update card).
// Requires a valid customer session — the email is taken from the
// verified auth token, not the request body.
export async function POST(request: Request) {
  const auth = await requireCustomer(request);
  if (!auth.ok) return auth.response;

  try {
    const payload = await getPayloadInstance();

    // Find subscription by the authenticated customer's email
    const { docs } = await payload.find({
      collection: "subscriptions",
      where: { email: { equals: auth.user.email } },
      limit: 1,
      overrideAccess: true,
    });

    const sub = docs[0];
    if (!sub?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No active subscription found for that email" },
        { status: 404 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

    const session = await createPortalSession({
      stripeCustomerId: sub.stripeCustomerId as string,
      returnUrl: `${origin}/membership`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Portal error:", err);
    return NextResponse.json(
      { error: "Failed to open billing portal" },
      { status: 500 }
    );
  }
}
