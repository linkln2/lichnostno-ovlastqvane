import { generatePayloadCookie } from "payload";
import { getPayloadInstance } from "@/lib/payload";

// POST /api/auth/customer-login — customer login (separate from staff login)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const payload = await getPayloadInstance();
    const result = await payload.login({
      collection: "customers",
      data: { email, password },
      overrideAccess: true,
    });

    if (!result.token) {
      return Response.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const customersCollection = payload.collections["customers"];
    const cookieString = generatePayloadCookie({
      collectionAuthConfig: customersCollection.config.auth,
      cookiePrefix: payload.config.cookiePrefix,
      token: result.token,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookieString,
      },
    });
  } catch (err) {
    console.error("Customer login error:", err);
    return Response.json(
      { error: "Invalid credentials" },
      { status: 401 },
    );
  }
}
