import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apiVersion: "2024-12-18.acacia" as any,
    });
  }
  return _stripe;
}

// Create a Stripe Checkout Session for a subscription (recurring billing)
export async function createSubscriptionCheckoutSession({
  priceId,
  customerEmail,
  successUrl,
  cancelUrl,
}: {
  priceId: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}) {
  return getStripe().checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

// Create a Stripe Billing Portal session so subscribers can manage
// their own subscription (upgrade, cancel, update card) without
// needing a site-side customer login.
export async function createPortalSession({
  stripeCustomerId,
  returnUrl,
}: {
  stripeCustomerId: string;
  returnUrl: string;
}) {
  return getStripe().billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });
}
