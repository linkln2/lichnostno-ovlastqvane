import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

type Message = {
  name: string;
  email: string;
  message: string;
  locale: string;
  submittedAt: string;
};

async function readMessages(): Promise<Message[]> {
  try {
    const raw = await fs.readFile(MESSAGES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeMessages(data: Message[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.message) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const message: Message = {
      name: String(body.name),
      email: String(body.email),
      message: String(body.message),
      locale: body.locale || "bg",
      submittedAt: new Date().toISOString(),
    };

    const existing = await readMessages();
    existing.push(message);
    await writeMessages(existing);

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}
