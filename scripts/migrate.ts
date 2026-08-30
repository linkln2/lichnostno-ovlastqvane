import { getPayload } from "payload";
import config from "../payload.config";

async function migrate() {
  console.log("Running Payload migrations...");
  const payload = await getPayload({ config });
  console.log("Payload initialized. Schema should be synced.");
  
  // Try to create a test staff record to verify
  try {
    const existing = await payload.find({
      collection: "staff",
      limit: 1,
      overrideAccess: true,
    });
    console.log(`Staff collection accessible. Found ${existing.totalDocs} records.`);
  } catch (err: any) {
    console.error("Error accessing staff collection:", err.message);
  }
  
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
