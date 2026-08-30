import { NextRequest, NextResponse } from "next/server";
import { getStripe, createSubscriptionCheckoutSession } from "@/lib/stripe";
import { getPayloadInstance } from "@/lib/payload";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventPackageId, productId, tierId, customerEmail, mode = "payment" } = body;

    const origin =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

    // ─── Subscription checkout ──────────────────────────────────
    if (mode === "subscription" || tierId) {
      if (!tierId) {
        return NextResponse.json(
          { error: "Tier ID is required for subscription checkout" },
          { status: 400 }
        );
      }

      const payload = await getPayloadInstance();
      const tier = await payload.findByID({
        collection: "subscription-tiers",
        id: tierId,
      });

      if (!tier || !tier.stripePriceId) {
        return NextResponse.json(
          { error: "Tier not configured for Stripe" },
          { status: 400 }
        );
      }

      const session = await createSubscriptionCheckoutSession({
        priceId: tier.stripePriceId as string,
        customerEmail: customerEmail || "",
        successUrl: `${origin}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/membership`,
      });

      return NextResponse.json({ url: session.url });
    }

    // ─── One-time payment checkout (products + event tickets) ───
    if (!eventPackageId && !productId) {
      return NextResponse.json(
        { error: "No item selected" },
        { status: 400 }
      );
    }

    const payload = await getPayloadInstance();
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (eventPackageId) {
      const pkg = await payload.findByID({
        collection: "event-packages",
        id: eventPackageId,
      });
      if (!pkg || !pkg.stripePriceId) {
        return NextResponse.json(
          { error: "Event package not available" },
          { status: 404 }
        );
      }
      lineItems.push({ price: pkg.stripePriceId as string, quantity: 1 });
    }

    if (productId) {
      const product = await payload.findByID({
        collection: "products",
        id: productId,
      });
      if (!product || !product.stripePriceId) {
        return NextResponse.json(
          { error: "Product not available" },
          { status: 404 }
        );
      }
      lineItems.push({ price: product.stripePriceId as string, quantity: 1 });
    }

    if (lineItems.length === 0) {
      return NextResponse.json(
        { error: "No item selected" },
        { status: 400 }
      );
    }

    const session = await getStripe().checkout.sessions.create({
      mode: mode as Stripe.Checkout.SessionCreateParams.Mode,
      line_items: lineItems,
      customer_email: customerEmail,
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      metadata: {
        eventPackageId: eventPackageId || "",
        productId: productId || "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}
