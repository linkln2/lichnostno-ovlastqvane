import { getPayloadInstance } from "@/lib/payload";
import { WHITELISTED_EMAILS } from "@/lib/auth";

// One-time setup endpoint: creates/syncs the whitelisted staff users.
// Requires ?key=SETUP_KEY env var to prevent unauthorized password resets.
// Delete this file after initial setup.
export async function POST(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const expectedKey = process.env.SETUP_KEY;

  if (!expectedKey || key !== expectedKey) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const payload = await getPayloadInstance();
    const created = [];
    for (const email of WHITELISTED_EMAILS) {
      // Check if this specific email already exists
      const found = await payload.find({
        collection: "staff",
        where: { email: { equals: email } },
        limit: 1,
        overrideAccess: true,
      });
      if (found.docs.length > 0) {
        // Sync password + role for existing whitelisted users
        await payload.update({
          collection: "staff",
          id: found.docs[0].id,
          data: { password: process.env.INITIAL_STAFF_PASSWORD || "", role: "owner" },
          overrideAccess: true,
        });
        console.log(`Synced staff user: ${email}`);
        continue;
      }

      const user = await payload.create({
        collection: "staff",
        data: {
          name: email.split("@")[0],
          email,
          role: "owner",
          password: process.env.INITIAL_STAFF_PASSWORD || "",
        },
        overrideAccess: true,
      });
      created.push({ email, id: user.id });
      console.log(`Created staff user: ${email}`);
    }

    return Response.json({ success: true, created });
  } catch (err) {
    console.error("Setup error:", err);
    return Response.json(
      { error: "Setup failed", detail: String(err) },
      { status: 500 },
    );
  }
}
