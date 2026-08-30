import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getPayloadInstance } from "@/lib/payload";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("Stripe webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutComplete(session);
  }

  // Subscription events can be added here as they become needed.

  return NextResponse.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const payload = await getPayloadInstance();
  const { eventPackageId, productId } = session.metadata || {};

  const customerEmail =
    session.customer_details?.email || session.customer_email || "";
  const customerName = session.customer_details?.name || customerEmail;

  if (eventPackageId) {
    const pkg = await payload.findByID({
      collection: "event-packages",
      id: eventPackageId,
    });
    if (!pkg) return;

    const event = pkg.event;
    const priceCents = session.amount_total || 0;

    await payload.create({
      collection: "registrations",
      data: {
        event,
        name: customerName,
        email: customerEmail,
        phone: "",
        package: pkg.name,
        status: "confirmed",
      } as any,
      overrideAccess: true,
    });

    await payload.create({
      collection: "orders",
      data: {
        stripeSessionId: session.id,
        stripePaymentIntentId: (session.payment_intent as string) || "",
        status: "paid",
        totalCents: priceCents,
        currency: session.currency || "bgn",
        items: [
          {
            type: "event-ticket",
            eventPackage: pkg.id,
            quantity: 1,
            priceCents,
          } as any,
        ],
      } as any,
      overrideAccess: true,
    });
  }

  if (productId) {
    const product = await payload.findByID({
      collection: "products",
      id: productId,
    });
    if (!product) return;

    const priceCents = session.amount_total || 0;

    await payload.create({
      collection: "orders",
      data: {
        stripeSessionId: session.id,
        stripePaymentIntentId: (session.payment_intent as string) || "",
        status: "paid",
        totalCents: priceCents,
        currency: session.currency || "bgn",
        items: [
          {
            type: "product",
            product: product.id,
            quantity: 1,
            priceCents,
          } as any,
        ],
      } as any,
      overrideAccess: true,
    });
  }
}
