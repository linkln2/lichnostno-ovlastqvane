import { requireStaff } from "@/lib/dashboard-api";
import { getPayloadInstance } from "@/lib/payload";
import { getStripe } from "@/lib/stripe";

// POST /api/dashboard/orders/[id]/refund — refunds a paid order via Stripe
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const payload = await getPayloadInstance();

    // Find the order
    const order = await payload.findByID({
      collection: "orders",
      id: Number(id),
      overrideAccess: true,
    });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "refunded") {
      return Response.json({ error: "Order already refunded" }, { status: 400 });
    }

    if (!order.stripePaymentIntentId) {
      return Response.json({ error: "No payment intent to refund" }, { status: 400 });
    }

    // Issue refund via Stripe
    const refund = await getStripe().refunds.create({
      payment_intent: order.stripePaymentIntentId as string,
    });

    // Update order status
    await payload.update({
      collection: "orders",
      id: order.id,
      data: { status: "refunded" },
      overrideAccess: true,
    });

    return Response.json({
      success: true,
      refundId: refund.id,
      amount: refund.amount,
    });
  } catch (err) {
    console.error("Refund error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Refund failed" },
      { status: 500 }
    );
  }
}
