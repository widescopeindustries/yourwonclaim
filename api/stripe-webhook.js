// Vercel Serverless Function — /api/stripe-webhook
// Listens for Stripe checkout.session.completed events
// and emails the buyer their template download link via Resend.

import Stripe from 'stripe';

const DOWNLOAD_URL = 'https://yourwonclaim.com/pages/download.html';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY not set');
  return new Stripe(key, { apiVersion: '2023-10-16' });
}

async function sendTemplateEmail(customerEmail, customerName) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn('RESEND_API_KEY not set — skipping template email');
    return;
  }

  const displayName = customerName || 'Veteran';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'YourWonClaim <templates@yourwonclaim.com>',
      to: [customerEmail],
      subject: '🎖️ Your VA Evidence Templates Are Ready — Download Now',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Templates Are Ready</title>
</head>
<body style="margin:0;padding:0;background:#0B1A2F;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B1A2F;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background:#0B1A2F;padding:32px 40px;text-align:center;border-radius:16px 16px 0 0;border:1px solid rgba(255,255,255,0.1);">
              <table cellpadding="0" cellspacing="0" align="center">
                <tr>
                  <td style="background:#C21818;border-radius:8px;padding:8px;width:40px;height:40px;text-align:center;vertical-align:middle;">
                    <span style="color:white;font-size:20px;">🛡️</span>
                  </td>
                  <td style="padding-left:12px;">
                    <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:18px;font-weight:700;color:#F6F7FB;letter-spacing:0.05em;">YOURWONCLAIM.COM</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Success Banner -->
          <tr>
            <td style="background:rgba(34,197,94,0.08);border-left:1px solid rgba(255,255,255,0.1);border-right:1px solid rgba(255,255,255,0.1);padding:24px 40px;text-align:center;">
              <div style="display:inline-block;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.3);border-radius:999px;padding:6px 18px;margin-bottom:16px;">
                <span style="color:#4ade80;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">✓ Payment Confirmed</span>
              </div>
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#F6F7FB;line-height:1.2;">
                Your Evidence Templates<br>Are Ready, ${displayName}!
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#0d1f38;border-left:1px solid rgba(255,255,255,0.1);border-right:1px solid rgba(255,255,255,0.1);padding:40px;">
              
              <p style="margin:0 0 24px;font-size:16px;color:#A9B3C2;line-height:1.65;">
                Thank you for your purchase. Your condition-specific VA evidence log templates are ready to download. Click the button below to access your download page.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="${DOWNLOAD_URL}" 
                       style="display:inline-block;background:#C21818;color:#ffffff;font-size:18px;font-weight:700;text-decoration:none;padding:16px 48px;border-radius:8px;letter-spacing:0.02em;">
                      📥 Download My Templates
                    </a>
                  </td>
                </tr>
              </table>

              <!-- What's included -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px;margin-bottom:32px;">
                <tr>
                  <td style="padding:24px;">
                    <h3 style="margin:0 0 16px;font-size:16px;font-weight:700;color:#F6F7FB;">📋 What you received:</h3>
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr><td style="padding:6px 0;color:#A9B3C2;font-size:14px;">✅ <strong style="color:#F6F7FB;">Condition-specific 30-day evidence logs</strong> — Written in VA rater language</td></tr>
                      <tr><td style="padding:6px 0;color:#A9B3C2;font-size:14px;">✅ <strong style="color:#F6F7FB;">7-day completed examples</strong> — See exactly how to document your symptoms</td></tr>
                      <tr><td style="padding:6px 0;color:#A9B3C2;font-size:14px;">✅ <strong style="color:#F6F7FB;">Rating criteria breakdown</strong> — Know what the rater is evaluating</td></tr>
                      <tr><td style="padding:6px 0;color:#A9B3C2;font-size:14px;">✅ <strong style="color:#F6F7FB;">PDF format</strong> — Print or fill digitally, unlimited copies</td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Pro tip -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(194,24,24,0.06);border:1px solid rgba(194,24,24,0.2);border-radius:12px;margin-bottom:32px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0;font-size:14px;color:#A9B3C2;line-height:1.6;">
                      <strong style="color:#C21818;">⚡ Pro Tip:</strong> Start your 30-day log <em>today</em>. Even if your C&amp;P exam is already scheduled, every day of documentation counts. You can submit additional evidence after your exam.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:14px;color:#A9B3C2;">
                Questions? Reply to this email or contact us at <a href="mailto:support@yourwonclaim.com" style="color:#C21818;">support@yourwonclaim.com</a>
              </p>
              <p style="margin:0;font-size:14px;color:#A9B3C2;">
                Need a template for a different condition? Call/text us at <a href="tel:6829990953" style="color:#C21818;">682.999.0953</a>
              </p>
            </td>
          </tr>

          <!-- Money-back guarantee -->
          <tr>
            <td style="background:#0B1A2F;border:1px solid rgba(255,255,255,0.08);border-top:none;padding:20px 40px;text-align:center;border-radius:0 0 16px 16px;">
              <p style="margin:0;font-size:12px;color:rgba(169,179,194,0.6);">
                🛡️ 30-Day Money-Back Guarantee • Educational Resource • Not affiliated with the VA • Not legal advice
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Resend error sending template email:', err);
    throw new Error('Failed to send template email: ' + err);
  }

  console.log('Template email sent to:', customerEmail);
}

async function notifyOwner(session) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const amount = (session.amount_total / 100).toFixed(2);
  const email = session.customer_details?.email || 'unknown';
  const name = session.customer_details?.name || 'Unknown';

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'YourWonClaim <leads@yourwonclaim.com>',
      to: ['morelyndon@pm.me'],
      subject: `💰 SALE: $${amount} — ${name} — YourWonClaim`,
      html: `
        <h2 style="color:#C21818;">💰 New Template Sale!</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px;">
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Customer</td><td style="padding:8px;border:1px solid #ddd;">${name}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Amount</td><td style="padding:8px;border:1px solid #ddd;"><strong>$${amount}</strong></td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Session ID</td><td style="padding:8px;border:1px solid #ddd;font-size:12px;">${session.id}</td></tr>
        </table>
        <p>Template download email was sent to ${email}</p>
      `,
    }),
  }).catch(console.error);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  // Get raw body for signature verification
  let rawBody;
  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    rawBody = Buffer.concat(chunks).toString('utf8');
  } catch (err) {
    console.error('Failed to read body:', err);
    return res.status(400).json({ error: 'Failed to read request body' });
  }

  let event;

  if (webhookSecret) {
    const sig = req.headers['stripe-signature'];
    try {
      const stripe = getStripe();
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }
  } else {
    // Dev mode — no signature verification
    console.warn('STRIPE_WEBHOOK_SECRET not set — skipping signature verification (dev mode only)');
    try {
      event = JSON.parse(rawBody);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name;

    console.log('checkout.session.completed:', session.id, customerEmail);

    if (!customerEmail) {
      console.error('No customer email in session:', session.id);
      return res.status(200).json({ received: true, warning: 'No customer email' });
    }

    try {
      await sendTemplateEmail(customerEmail, customerName);
      await notifyOwner(session);
    } catch (err) {
      console.error('Failed to send emails:', err);
      // Still return 200 so Stripe doesn't retry — log it manually
      return res.status(200).json({ received: true, error: err.message });
    }
  }

  return res.status(200).json({ received: true });
}

// Disable body parsing for raw body access (required for Stripe webhook verification)
export const config = {
  api: {
    bodyParser: false,
  },
};
