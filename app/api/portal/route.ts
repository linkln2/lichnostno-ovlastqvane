import { NextResponse } from "next/server";
import { createPortalSession } from "@/lib/stripe";
import { getPayloadInstance } from "@/lib/payload";

// Stripe Customer Portal — lets subscribers manage their own
// subscription (cancel, upgrade, update card) without a site login.
// They enter their email; we look up their stripeCustomerId and
// redirect them to Stripe's hosted portal.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const payload = await getPayloadInstance();

    // Find subscription by email (the portal-only approach — no login needed)
    const { docs } = await payload.find({
      collection: "subscriptions",
      where: { email: { equals: email } },
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
