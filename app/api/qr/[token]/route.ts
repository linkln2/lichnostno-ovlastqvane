import QRCode from "qrcode";
import { verifyQrToken } from "@/lib/qr";

// GET /api/qr/[token] — returns a QR code PNG image for the given token
export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  // Verify the token is valid (but don't require it to be — the scanner does that)
  const decoded = verifyQrToken(token);
  if (!decoded) {
    return new Response("Invalid token", { status: 400 });
  }

  try {
    const pngBuffer = await QRCode.toBuffer(token, {
      width: 300,
      margin: 2,
      color: { dark: "#1c1917", light: "#ffffff" },
    });

    return new Response(new Uint8Array(pngBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("QR generation error:", err);
    return new Response("Failed to generate QR", { status: 500 });
  }
}
