import { generatePayloadCookie } from "payload";
import { getPayloadInstance } from "@/lib/payload";

// POST /api/auth/activate — set password for a member who subscribed via Stripe
// but doesn't have a customer account yet. Verifies they have an active subscription.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const name = String(body.name || "").trim();

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return Response.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const payload = await getPayloadInstance();

    // Verify this email has an active subscription
    const subsRes = await payload.find({
      collection: "subscriptions",
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    });

    if (subsRes.totalDocs === 0) {
      return Response.json(
        { error: "No membership found for this email. Please subscribe first." },
        { status: 403 },
      );
    }

    const sub = subsRes.docs[0];
    const activeStatuses = ["active", "trialing"];
    if (!activeStatuses.includes(sub.status)) {
      return Response.json(
        { error: `Your membership is ${sub.status}. Please reactivate your subscription.` },
        { status: 403 },
      );
    }

    // Check if account already exists
    const existing = await payload.find({
      collection: "customers",
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    });

    if (existing.totalDocs > 0) {
      return Response.json(
        { error: "Account already exists. Please log in instead." },
        { status: 409 },
      );
    }

    // Create the customer account
    const customer = await payload.create({
      collection: "customers",
      data: {
        email,
        password,
        name: name || email.split("@")[0],
        stripeCustomerId: sub.stripeCustomerId || undefined,
      },
      overrideAccess: true,
    });

    // Link the subscription to this customer
    await payload.update({
      collection: "subscriptions",
      id: sub.id,
      data: { customer: customer.id },
      overrideAccess: true,
    }).catch(() => {});

    // Log them in
    const result = await payload.login({
      collection: "customers",
      data: { email, password },
      overrideAccess: true,
    });

    if (!result.token) {
      return Response.json(
        { error: "Account created but login failed. Please log in." },
        { status: 500 },
      );
    }

    const customersCollection = payload.collections["customers"];
    const cookieString = generatePayloadCookie({
      collectionAuthConfig: customersCollection.config.auth,
      cookiePrefix: payload.config.cookiePrefix,
      token: result.token,
    });

    return new Response(JSON.stringify({ success: true, customerId: customer.id }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookieString,
      },
    });
  } catch (err) {
    console.error("Activation error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Activation failed" },
      { status: 500 },
    );
  }
}
