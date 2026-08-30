import jwt from "jsonwebtoken";

const SECRET = process.env.PAYLOAD_SECRET || "dev-secret-change-me";

// Generate a signed QR token for a registration
export function generateQrToken(registrationId: number): string {
  return jwt.sign({ regId: registrationId }, SECRET, { expiresIn: "7d" });
}

// Verify a QR token (from the scanner) and return the registration ID
export function verifyQrToken(token: string): { regId: number } | null {
  try {
    const decoded = jwt.verify(token, SECRET) as { regId: number };
    return decoded;
  } catch {
    return null;
  }
}
