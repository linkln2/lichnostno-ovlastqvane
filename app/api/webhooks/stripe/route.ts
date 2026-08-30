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

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Only handle one-time payments here; subscription sessions are
        // handled by customer.subscription.created below
        if (session.mode !== "subscription") {
          await handleCheckoutComplete(session);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(sub);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(sub);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = (invoice as any).subscription as string | undefined;
        console.warn("Payment failed for subscription:", subId);
        // TODO: send Resend email once that's wired
        break;
      }

      default:
        // Unhandled event types — no action needed
        break;
    }
  } catch (err) {
    console.error(`Webhook handler error for ${event.type}:`, err);
    // Return 500 so Stripe retries
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

// ─── One-time payment checkout ───────────────────────────────────

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

// ─── Subscription lifecycle ──────────────────────────────────────

async function handleSubscriptionChange(sub: Stripe.Subscription) {
  const payload = await getPayloadInstance();
  const stripe = getStripe();

  // Retrieve the customer to get their email
  const customer = (await stripe.customers.retrieve(
    sub.customer as string
  )) as Stripe.Customer;
  const email = customer.email || "";

  // Map Stripe status to our status options
  // Stripe: active, past_due, canceled, incomplete, trialing, unpaid
  // Ours:   active, past_due, cancelled, incomplete, trialing
  const statusMap: Record<string, string> = {
    active: "active",
    past_due: "past_due",
    canceled: "cancelled",
    incomplete: "incomplete",
    trialing: "trialing",
    unpaid: "past_due",
  };
  const status = statusMap[sub.status] || "incomplete";

  // Look up the tier from the subscription's price
  let tierId: string | undefined;
  if (sub.items.data.length > 0) {
    const priceId = sub.items.data[0].price?.id;
    if (priceId) {
      const { docs } = await payload.find({
        collection: "subscription-tiers",
        where: { stripePriceId: { equals: priceId } },
        limit: 1,
        overrideAccess: true,
      });
      if (docs.length > 0) {
        tierId = String(docs[0].id);
      }
    }
  }

  // Get period dates from the first subscription item
  // (Stripe v22+ moved current_period_start/end to SubscriptionItem)
  const firstItem = sub.items.data[0];
  const currentPeriodStart = firstItem?.current_period_start
    ? new Date(firstItem.current_period_start * 1000).toISOString()
    : new Date(sub.start_date * 1000).toISOString();
  const currentPeriodEnd = firstItem?.current_period_end
    ? new Date(firstItem.current_period_end * 1000).toISOString()
    : undefined;

  // Check if a subscription row already exists
  const existing = await payload.find({
    collection: "subscriptions",
    where: { stripeSubscriptionId: { equals: sub.id } },
    limit: 1,
    overrideAccess: true,
  });

  const subscriptionData: Record<string, unknown> = {
    status,
    email,
    stripeCustomerId: sub.customer as string,
    currentPeriodStart,
  };
  if (currentPeriodEnd) {
    subscriptionData.currentPeriodEnd = currentPeriodEnd;
  }
  subscriptionData.cancelAtPeriodEnd = sub.cancel_at_period_end;
  if (tierId) {
    subscriptionData.tier = tierId;
  }

  if (existing.docs.length > 0) {
    // Update existing row
    await payload.update({
      collection: "subscriptions",
      id: existing.docs[0].id,
      data: subscriptionData as any,
      overrideAccess: true,
    });
  } else {
    // Create new row
    await payload.create({
      collection: "subscriptions",
      data: {
        stripeSubscriptionId: sub.id,
        ...subscriptionData,
      } as any,
      overrideAccess: true,
    });
  }
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  const payload = await getPayloadInstance();

  const existing = await payload.find({
    collection: "subscriptions",
    where: { stripeSubscriptionId: { equals: sub.id } },
    limit: 1,
    overrideAccess: true,
  });

  if (existing.docs.length > 0) {
    await payload.update({
      collection: "subscriptions",
      id: existing.docs[0].id,
      data: { status: "cancelled" } as any,
      overrideAccess: true,
    });
  }
}
