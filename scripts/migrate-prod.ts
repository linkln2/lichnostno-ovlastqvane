// Run with: node --import tsx scripts/migrate-prod.ts
import { getPayload } from "payload";
import config from "../payload.config";

async function migrate() {
  console.log("Starting Payload migration...");
  console.log("DATABASE_URI:", process.env.DATABASE_URI?.replace(/:[^@]+@/, ":***@"));
  
  try {
    const payload = await getPayload({ config });
    console.log("Payload initialized successfully!");
    
    const collections = [
      "staff", "customers", "media", "blog-posts", "events",
      "event-packages", "products", "subscription-tiers", "pages",
      "orders", "registrations", "subscriptions", "check-ins", "social-stats",
    ];
    
    for (const col of collections) {
      try {
        const res = await payload.find({ collection: col as any, limit: 1, overrideAccess: true });
        console.log(`  ${col}: ok (${res.totalDocs} docs)`);
      } catch (err: any) {
        console.log(`  ${col}: ERROR - ${err.message?.slice(0, 100)}`);
      }
    }
    
    console.log("Migration complete!");
    process.exit(0);
  } catch (err: any) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  }
}

migrate();
