import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY || "";
const fromEmail = process.env.FROM_EMAIL || "noreply@lichnostno-ovlastqvane.netlify.app";
const fromName = "Личностно овластяване";

let _resend: Resend | null = null;

function getResend() {
  if (!_resend) {
    _resend = new Resend(apiKey);
  }
  return _resend;
}

function isConfigured() {
  return !!apiKey;
}

// ─── Email templates ─────────────────────────────────────────────

function baseTemplate(title: string, contentHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#fafaf5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#b45309,#92400e);padding:32px 24px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">${fromName}</h1>
          <p style="margin:8px 0 0;color:#fde68a;font-size:13px;">Personal Empowerment</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px 24px;">
          ${contentHtml}
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:24px;border-top:1px solid #f5f5f4;text-align:center;">
          <p style="margin:0;color:#a8a29e;font-size:12px;">© ${new Date().getFullYear()} ${fromName}. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function button(text: string, url: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px auto;">
    <tr><td style="background:#b45309;border-radius:999px;">
      <a href="${url}" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;">${text}</a>
    </td></tr>
  </table>`;
}

// ─── Email sending functions ─────────────────────────────────────

export async function sendOrderConfirmation(
  email: string,
  orderDetails: { productName: string; priceCents: number; orderId: number }
) {
  if (!isConfigured()) {
    console.log(`[email] Order confirmation to ${email} (not configured — skipping)`);
    return;
  }

  const price = `€${(orderDetails.priceCents / 100).toFixed(2)}`;
  const html = baseTemplate(
    "Order confirmation",
    `<h2 style="margin:0 0 16px;color:#1c1917;font-size:20px;">Thank you for your purchase!</h2>
     <p style="margin:0 0 16px;color:#57534e;font-size:15px;line-height:1.6;">Your order has been confirmed. Here are the details:</p>
     <table cellpadding="0" cellspacing="0" style="width:100%;margin:16px 0;border:1px solid #e7e5e4;border-radius:12px;overflow:hidden;">
       <tr><td style="padding:16px;border-bottom:1px solid #e7e5e4;">
         <p style="margin:0;color:#a8a29e;font-size:12px;text-transform:uppercase;">Product</p>
         <p style="margin:4px 0 0;color:#1c1917;font-size:15px;font-weight:600;">${orderDetails.productName}</p>
       </td></tr>
       <tr><td style="padding:16px;">
         <p style="margin:0;color:#a8a29e;font-size:12px;text-transform:uppercase;">Amount paid</p>
         <p style="margin:4px 0 0;color:#1c1917;font-size:15px;font-weight:600;">${price}</p>
       </td></tr>
     </table>
     <p style="margin:0;color:#78716c;font-size:13px;">Order #${orderDetails.orderId}</p>`
  );

  await getResend().emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: email,
    subject: "Order confirmation",
    html,
  });
}

export async function sendTicketConfirmation(
  email: string,
  ticketDetails: { eventName: string; packageName: string; priceCents: number; startsAt: string; location: string; qrToken: string }
) {
  if (!isConfigured()) {
    console.log(`[email] Ticket confirmation to ${email} (not configured — skipping)`);
    return;
  }

  const price = `€${(ticketDetails.priceCents / 100).toFixed(2)}`;
  const eventDate = new Date(ticketDetails.startsAt).toLocaleDateString("en-US", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  // QR code as data URI (using a public API since we can't easily generate server-side in email)
  const qrUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || ""}/api/qr/${ticketDetails.qrToken}`;

  const html = baseTemplate(
    "Your event ticket",
    `<h2 style="margin:0 0 16px;color:#1c1917;font-size:20px;">You're registered!</h2>
     <p style="margin:0 0 16px;color:#57534e;font-size:15px;line-height:1.6;">Here's your ticket for the upcoming event:</p>
     <table cellpadding="0" cellspacing="0" style="width:100%;margin:16px 0;border:1px solid #e7e5e4;border-radius:12px;overflow:hidden;">
       <tr><td style="padding:16px;border-bottom:1px solid #e7e5e4;">
         <p style="margin:0;color:#a8a29e;font-size:12px;text-transform:uppercase;">Event</p>
         <p style="margin:4px 0 0;color:#1c1917;font-size:15px;font-weight:600;">${ticketDetails.eventName}</p>
       </td></tr>
       <tr><td style="padding:16px;border-bottom:1px solid #e7e5e4;">
         <p style="margin:0;color:#a8a29e;font-size:12px;text-transform:uppercase;">Package</p>
         <p style="margin:4px 0 0;color:#1c1917;font-size:15px;font-weight:600;">${ticketDetails.packageName} — ${price}</p>
       </td></tr>
       <tr><td style="padding:16px;border-bottom:1px solid #e7e5e4;">
         <p style="margin:0;color:#a8a29e;font-size:12px;text-transform:uppercase;">When</p>
         <p style="margin:4px 0 0;color:#1c1917;font-size:15px;">${eventDate}</p>
       </td></tr>
       <tr><td style="padding:16px;">
         <p style="margin:0;color:#a8a29e;font-size:12px;text-transform:uppercase;">Where</p>
         <p style="margin:4px 0 0;color:#1c1917;font-size:15px;">${ticketDetails.location}</p>
       </td></tr>
     </table>
     <p style="margin:24px 0 8px;color:#1c1917;font-size:15px;font-weight:600;">Your check-in QR code:</p>
     <p style="margin:0;text-align:center;">
       <img src="${qrUrl}" alt="QR code" style="width:200px;height:200px;border:1px solid #e7e5e4;border-radius:12px;" />
     </p>
     <p style="margin:12px 0 0;color:#78716c;font-size:13px;text-align:center;">Show this code at the door for check-in.</p>`
  );

  await getResend().emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: email,
    subject: `Your ticket: ${ticketDetails.eventName}`,
    html,
  });
}

export async function sendSubscriptionWelcome(
  email: string,
  subDetails: { tierName: string; priceCents: number; interval: string }
) {
  if (!isConfigured()) {
    console.log(`[email] Subscription welcome to ${email} (not configured — skipping)`);
    return;
  }

  const price = `€${(subDetails.priceCents / 100).toFixed(2)}/${subDetails.interval}`;
  const portalUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || ""}/membership`;

  const html = baseTemplate(
    "Welcome to the community!",
    `<h2 style="margin:0 0 16px;color:#1c1917;font-size:20px;">You're in! 🎉</h2>
     <p style="margin:0 0 16px;color:#57534e;font-size:15px;line-height:1.6;">Your subscription is now active. Welcome to the community!</p>
     <table cellpadding="0" cellspacing="0" style="width:100%;margin:16px 0;border:1px solid #e7e5e4;border-radius:12px;overflow:hidden;">
       <tr><td style="padding:16px;">
         <p style="margin:0;color:#a8a29e;font-size:12px;text-transform:uppercase;">Your plan</p>
         <p style="margin:4px 0 0;color:#1c1917;font-size:15px;font-weight:600;">${subDetails.tierName} — ${price}</p>
       </td></tr>
     </table>
     <p style="margin:0 0 8px;color:#57534e;font-size:15px;line-height:1.6;">You can manage your subscription anytime:</p>
     ${button("Manage membership", portalUrl)}`
  );

  await getResend().emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: email,
    subject: "Welcome to the community!",
    html,
  });
}

export async function sendPaymentFailed(
  email: string,
  details: { amount: string; portalUrl: string }
) {
  if (!isConfigured()) {
    console.log(`[email] Payment failed to ${email} (not configured — skipping)`);
    return;
  }

  const html = baseTemplate(
    "Payment failed",
    `<h2 style="margin:0 0 16px;color:#1c1917;font-size:20px;">Payment couldn't be processed</h2>
     <p style="margin:0 0 16px;color:#57534e;font-size:15px;line-height:1.6;">We weren't able to process your payment of ${details.amount}. This usually happens when a card has expired or insufficient funds.</p>
     <p style="margin:0 0 16px;color:#57534e;font-size:15px;line-height:1.6;">Please update your payment method to keep your subscription active:</p>
     ${button("Update payment method", details.portalUrl)}
     <p style="margin:16px 0 0;color:#78716c;font-size:13px;">If you don't update your card, Stripe will retry the payment a few times before canceling the subscription.</p>`
  );

  await getResend().emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: email,
    subject: "Action needed: payment failed",
    html,
  });
}
