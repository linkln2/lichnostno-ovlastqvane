// Email whitelist for admin/dashboard access.
// Only these emails can log in. Everyone else gets a "coming soon" gate.
export const WHITELISTED_EMAILS = [
  "elegiaood@gmail.com",
  "junginu763@gmail.com",
] as const;

export function isWhitelisted(email: string): boolean {
  return WHITELISTED_EMAILS.includes(
    email.trim().toLowerCase() as (typeof WHITELISTED_EMAILS)[number],
  );
}
