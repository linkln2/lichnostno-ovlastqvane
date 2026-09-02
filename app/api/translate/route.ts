import { requireStaff } from "@/lib/auth-request";
import { translateText } from "@/lib/deepl";

export async function POST(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const { text, sourceLang = "BG", targetLang = "EN" } = body;

    if (!text || typeof text !== "string") {
      return Response.json({ error: "text is required" }, { status: 400 });
    }

    const [translated] = await translateText(text, sourceLang, targetLang);
    return Response.json({ translated });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Translate error:", err);
    return Response.json({ error: message }, { status: 500 });
  }
}
