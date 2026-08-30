import { generatePayloadCookie } from "payload";
import { getPayloadInstance } from "@/lib/payload";
import { isWhitelisted } from "@/lib/auth";

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

    // Gate: only whitelisted emails can log in
    if (!isWhitelisted(email)) {
      return Response.json(
        { error: "coming-soon", message: "Access is coming soon." },
        { status: 403 },
      );
    }

    const payload = await getPayloadInstance();
    const result = await payload.login({
      collection: "staff",
      data: { email, password },
      overrideAccess: true,
    });

    if (!result.token) {
      return Response.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Generate the payload-token cookie
    const staffCollection = payload.collections["staff"];
    const cookieString = generatePayloadCookie({
      collectionAuthConfig: staffCollection.config.auth,
      cookiePrefix: payload.config.cookiePrefix,
      token: result.token,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookieString,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return Response.json(
      { error: "Invalid credentials" },
      { status: 401 },
    );
  }
}
