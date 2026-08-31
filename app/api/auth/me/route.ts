import { getAuthUser } from "@/lib/auth-request";

// GET /api/auth/me — returns the currently logged-in user (customer or staff)
// Uses Payload's verified auth, not raw JWT decoding.
export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return Response.json({ user: null });
    }

    return Response.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        collection: user.collection,
      },
    });
  } catch (err) {
    console.error("Me error:", err);
    return Response.json({ user: null });
  }
}
