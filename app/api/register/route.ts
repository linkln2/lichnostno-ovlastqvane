import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.json");

type Registration = {
  eventSlug: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  package?: string;
  notes?: string;
  locale: string;
  submittedAt: string;
};

async function readRegistrations(): Promise<Registration[]> {
  try {
    const raw = await fs.readFile(REGISTRATIONS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeRegistrations(data: Registration[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.name || !body.email || !body.phone) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const registration: Registration = {
      eventSlug: body.eventSlug,
      eventTitle: body.eventTitle,
      name: String(body.name),
      email: String(body.email),
      phone: String(body.phone),
      city: body.city ? String(body.city) : undefined,
      package: body.package ? String(body.package) : undefined,
      notes: body.notes ? String(body.notes) : undefined,
      locale: body.locale || "bg",
      submittedAt: new Date().toISOString(),
    };

    const existing = await readRegistrations();
    existing.push(registration);
    await writeRegistrations(existing);

    return Response.json({ success: true });
  } catch (err) {
    return Response.json(
      { error: "Failed to save registration" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const data = await readRegistrations();
  return Response.json({ count: data.length, registrations: data });
}
