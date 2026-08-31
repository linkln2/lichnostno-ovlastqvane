import { getPayloadInstance } from "@/lib/payload";
import { isWhitelisted } from "@/lib/auth";

export type AuthUser = {
  id: string;
  email: string;
  collection: "staff" | "customers";
  name?: string;
};

/**
 * Verify the payload-token cookie via Payload's own auth, which checks
 * the JWT signature. Returns the user or null.
 *
 * This replaces the old pattern of base64-decoding the JWT without
 * signature verification, which allowed token forgery.
 */
export async function getAuthUser(request: Request): Promise<AuthUser | null> {
  const cookie = request.headers.get("cookie") || "";
  if (!cookie.includes("payload-token=")) return null;

  const p = await getPayloadInstance();

  // Convert a Web Request's headers into the shape payload.auth expects
  const headers = new Headers(request.headers);

  const { user } = await p.auth({ headers });

  if (!user) return null;

  // payload.auth returns the user with a collection field
  const collection = (user as any).collection as string;
  if (collection !== "staff" && collection !== "customers") return null;

  return {
    id: String((user as any).id),
    email: (user as any).email,
    collection: collection as "staff" | "customers",
    name: (user as any).name,
  };
}

/**
 * Require a staff user. Returns either { ok: true, user } or
 * { ok: false, response } — the response is a 401 to send back.
 *
 * Checks both that the token is valid AND that the email is whitelisted.
 */
export async function requireStaff(request: Request): Promise<
  | { ok: true; user: AuthUser }
  | { ok: false; response: Response }
> {
  const user = await getAuthUser(request);

  if (!user || user.collection !== "staff") {
    return {
      ok: false,
      response: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!isWhitelisted(user.email)) {
    return {
      ok: false,
      response: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { ok: true, user };
}

/**
 * Require a customer user. Returns either { ok: true, user } or
 * { ok: false, response }.
 */
export async function requireCustomer(request: Request): Promise<
  | { ok: true; user: AuthUser }
  | { ok: false; response: Response }
> {
  const user = await getAuthUser(request);

  if (!user || user.collection !== "customers") {
    return {
      ok: false,
      response: Response.json({ error: "Not authenticated" }, { status: 401 }),
    };
  }

  return { ok: true, user };
}
