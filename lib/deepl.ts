const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_BASE_URL = process.env.DEEPL_BASE_URL || "https://api-free.deepl.com/v2";

export async function translateText(
  texts: string | string[],
  sourceLang = "BG",
  targetLang = "EN"
) {
  if (!DEEPL_API_KEY) {
    throw new Error("DEEPL_API_KEY is not configured");
  }

  const textArray = Array.isArray(texts) ? texts : [texts];
  const params = new URLSearchParams();
  for (const text of textArray) {
    params.append("text", text);
  }
  params.append("source_lang", sourceLang.toUpperCase());
  params.append("target_lang", targetLang.toUpperCase());

  const res = await fetch(`${DEEPL_BASE_URL}/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DeepL request failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as { translations: { text: string }[] };
  return data.translations.map((t) => t.text);
}
