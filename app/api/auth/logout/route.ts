// POST /api/auth/logout — clears the auth cookie
export async function POST() {
  // Clear the payload-token cookie by setting it to empty with max-age 0
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": "payload-token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax",
    },
  });
}
