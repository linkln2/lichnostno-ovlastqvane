import type { Payload } from "payload";

// ─── Types ───────────────────────────────────────────────────────────

export type EntitlementType = "membership" | "event_ticket" | "product";

export type MembershipEntitlement = {
  type: "membership";
  tierId: string;
  tierName: string;
  priceCents: number;
  status: "active" | "past_due" | "cancelled" | "incomplete" | "trialing";
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

export type EventTicketEntitlement = {
  type: "event_ticket";
  eventId: string;
  eventTitle: string;
  eventSlug: string;
  eventStartsAt: string | null;
  registrationId: string;
  status: "pending" | "confirmed" | "checked_in" | "waitlisted" | "cancelled";
};

export type ProductEntitlement = {
  type: "product";
  productId: string;
  productName: string;
  orderId: string;
  fulfilled: boolean;
};

export type Entitlements = {
  customerId: string;
  email: string;
  memberships: MembershipEntitlement[];
  eventTickets: EventTicketEntitlement[];
  products: ProductEntitlement[];
  // Convenience flags
  hasActiveMembership: boolean;
  highestTierPrice: number | null;
  highestTierName: string | null;
};

// ─── Helpers ─────────────────────────────────────────────────────────

const ACTIVE_STATUSES = ["active", "trialing"];
const PAID_STATUSES = ["paid"];

// ─── Main function ───────────────────────────────────────────────────

/**
 * Returns everything a customer currently holds — memberships, event tickets,
 * and purchased products. This is the single source of truth for gating.
 */
export async function getCustomerEntitlements(
  payload: Payload,
  customerId: string,
  email: string,
): Promise<Entitlements> {
  // Fetch all three in parallel
  const [subsRes, regsRes, ordersRes] = await Promise.all([
    payload.find({
      collection: "subscriptions",
      where: { customer: { equals: customerId } },
      overrideAccess: true,
      limit: 50,
      sort: "-createdAt",
    }),
    payload.find({
      collection: "registrations",
      where: { customer: { equals: customerId } },
      overrideAccess: true,
      limit: 50,
      sort: "-createdAt",
    }),
    payload.find({
      collection: "orders",
      where: {
        and: [
          { customer: { equals: customerId } },
          { status: { in: PAID_STATUSES } },
        ],
      },
      overrideAccess: true,
      limit: 50,
      sort: "-createdAt",
    }),
  ]);

  // ─── Memberships ───────────────────────────────────────────────────
  const memberships: MembershipEntitlement[] = [];
  let highestTierPrice: number | null = null;
  let highestTierName: string | null = null;

  for (const sub of subsRes.docs) {
    // Resolve tier name + price
    let tierName = "Unknown";
    let priceCents = 0;
    if (sub.tier && typeof sub.tier === "object") {
      tierName = sub.tier.name || "Unknown";
      priceCents = sub.tier.priceCents || 0;
    } else if (sub.tier) {
      // tier is an ID — fetch it
      try {
        const tier = await payload.findByID({
          collection: "subscription-tiers",
          id: sub.tier as string,
          overrideAccess: true,
        });
        tierName = tier?.name || "Unknown";
        priceCents = tier?.priceCents || 0;
      } catch {}
    }

    const status = (sub.status || "incomplete") as MembershipEntitlement["status"];
    memberships.push({
      type: "membership",
      tierId: typeof sub.tier === "object" ? (sub.tier as any).id : String(sub.tier),
      tierName,
      priceCents,
      status,
      currentPeriodEnd: sub.currentPeriodEnd || null,
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd || false,
    });

    // Track highest active tier
    if (ACTIVE_STATUSES.includes(status) && priceCents > (highestTierPrice ?? 0)) {
      highestTierPrice = priceCents;
      highestTierName = tierName;
    }
  }

  // ─── Event tickets ─────────────────────────────────────────────────
  const eventTickets: EventTicketEntitlement[] = [];

  for (const reg of regsRes.docs) {
    let eventTitle = "Unknown event";
    let eventSlug = "";
    let eventStartsAt: string | null = null;

    if (reg.event && typeof reg.event === "object") {
      eventTitle = reg.event.title || "Unknown event";
      eventSlug = reg.event.slug || "";
      eventStartsAt = reg.event.startsAt || null;
    } else if (reg.event) {
      try {
        const event = await payload.findByID({
          collection: "events",
          id: reg.event as string,
          overrideAccess: true,
        });
        eventTitle = event?.title || "Unknown event";
        eventSlug = event?.slug || "";
        eventStartsAt = event?.startsAt || null;
      } catch {}
    }

    eventTickets.push({
      type: "event_ticket",
      eventId: typeof reg.event === "object" ? (reg.event as any).id : String(reg.event),
      eventTitle,
      eventSlug,
      eventStartsAt,
      registrationId: String(reg.id),
      status: (reg.status || "pending") as EventTicketEntitlement["status"],
    });
  }

  // ─── Products ──────────────────────────────────────────────────────
  const products: ProductEntitlement[] = [];

  for (const order of ordersRes.docs) {
    const items = (order.items || []) as any[];
    for (const item of items) {
      if (item.type !== "product" || !item.product) continue;

      let productName = "Unknown product";
      if (typeof item.product === "object") {
        productName = item.product.name || "Unknown product";
      } else {
        try {
          const product = await payload.findByID({
            collection: "products",
            id: item.product as string,
            overrideAccess: true,
          });
          productName = product?.name || "Unknown product";
        } catch {}
      }

      products.push({
        type: "product",
        productId: typeof item.product === "object" ? item.product.id : String(item.product),
        productName,
        orderId: String(order.id),
        fulfilled: order.status === "paid",
      });
    }
  }

  return {
    customerId,
    email,
    memberships,
    eventTickets,
    products,
    hasActiveMembership: memberships.some((m) => ACTIVE_STATUSES.includes(m.status)),
    highestTierPrice,
    highestTierName,
  };
}

// ─── Convenience checks ──────────────────────────────────────────────

/** Does the customer have any active membership? */
export function hasMembership(e: Entitlements): boolean {
  return e.hasActiveMembership;
}

/** Does the customer have a membership at or above the given tier price? */
export function hasTierAtLeast(e: Entitlements, minPriceCents: number): boolean {
  return e.memberships.some(
    (m) => ACTIVE_STATUSES.includes(m.status) && m.priceCents >= minPriceCents,
  );
}

/** Does the customer hold a ticket (confirmed or checked_in) for a specific event? */
export function hasEventTicket(e: Entitlements, eventId: string): boolean {
  return e.eventTickets.some(
    (t) => t.eventId === eventId && ["confirmed", "checked_in"].includes(t.status),
  );
}

/** Does the customer own a specific product? */
export function ownsProduct(e: Entitlements, productId: string): boolean {
  return e.products.some((p) => p.productId === productId);
}
