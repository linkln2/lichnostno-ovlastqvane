import { generatePayloadCookie } from "payload";
import { getPayloadInstance } from "@/lib/payload";

// POST /api/auth/signup — customer self-registration
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

    // Check if email already exists
    const existing = await payload.find({
      collection: "customers",
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    });

    if (existing.totalDocs > 0) {
      return Response.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    // Create the customer
    const customer = await payload.create({
      collection: "customers",
      data: {
        email,
        password,
        name: name || email.split("@")[0],
      },
      overrideAccess: true,
    });

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
    console.error("Signup error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Signup failed" },
      { status: 500 },
    );
  }
}
