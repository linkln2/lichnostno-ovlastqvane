import { getPayloadInstance } from "@/lib/payload";
import { WHITELISTED_EMAILS } from "@/lib/auth";
import { products } from "@/lib/content";

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

    // Map emails to display names
    const staffNames: Record<string, string> = {
      "elegiaood@gmail.com": "Valeria",
      "junginu763@gmail.com": "Valeria",
    };

    for (const email of WHITELISTED_EMAILS) {
      // Check if this specific email already exists
      const found = await payload.find({
        collection: "staff",
        where: { email: { equals: email } },
        limit: 1,
        overrideAccess: true,
      });
      if (found.docs.length > 0) {
        // Sync password + role + name for existing whitelisted users
        await payload.update({
          collection: "staff",
          id: found.docs[0].id,
          data: {
            password: process.env.INITIAL_STAFF_PASSWORD || "",
            role: "owner",
            name: staffNames[email] || email.split("@")[0],
          },
          overrideAccess: true,
        });
        console.log(`Synced staff user: ${email}`);
        continue;
      }

      const user = await payload.create({
        collection: "staff",
        data: {
          name: staffNames[email] || email.split("@")[0],
          email,
          role: "owner",
          password: process.env.INITIAL_STAFF_PASSWORD || "",
        },
        overrideAccess: true,
      });
      created.push({ email, id: user.id });
      console.log(`Created staff user: ${email}`);
    }

    const seededProducts = [];
    for (const product of products) {
      const found = await payload.find({
        collection: "products",
        where: { slug: { equals: product.slug } },
        limit: 1,
        overrideAccess: true,
      });
      if (found.docs.length > 0) {
        continue;
      }
      const p = await payload.create({
        collection: "products",
        data: {
          name: product.name.en,
          slug: product.slug,
          priceCents: product.price * 100,
          category: product.category === "potions" ? "physical" : "merchandise",
          productType: "physical",
          inventory: 100,
          status: "published",
        } as any,
        overrideAccess: true,
      });
      seededProducts.push({ id: p.id, slug: product.slug, name: product.name.en });
    }

    return Response.json({ success: true, created, products: seededProducts });
  } catch (err) {
    console.error("Setup error:", err);
    return Response.json(
      { error: "Setup failed", detail: String(err) },
      { status: 500 },
    );
  }
}
