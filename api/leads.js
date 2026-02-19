// Vercel Serverless Function — /api/leads
// Saves lead to Supabase and sends an email notification via Resend.
// Mirrors the pattern used in fixsepticnow and mesothelioma projects.

import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars not configured");
  return createClient(url, key);
}

async function sendLeadNotification(lead) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn("RESEND_API_KEY not set — skipping email notification");
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "YourWonClaim <leads@yourwonclaim.com>",
        to: ["morelyndon@pm.me"],
        subject: `🎖️ NEW LEAD: ${lead.name} — YourWonClaim`,
        html: `
          <h2 style="color:#C21818;">🎖️ New YourWonClaim Lead!</h2>
          <table style="border-collapse:collapse;width:100%;max-width:500px;">
            <tr>
              <td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Name</td>
              <td style="padding:8px;border:1px solid #ddd;">${lead.name}</td>
            </tr>
            <tr>
              <td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td>
              <td style="padding:8px;border:1px solid #ddd;"><a href="mailto:${lead.email}">${lead.email}</a></td>
            </tr>
            <tr>
              <td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Source</td>
              <td style="padding:8px;border:1px solid #ddd;">${lead.source_url || "/"}</td>
            </tr>
            ${lead.utm_source ? `
            <tr>
              <td style="padding:8px;border:1px solid #ddd;font-weight:bold;">UTM Source</td>
              <td style="padding:8px;border:1px solid #ddd;">${lead.utm_source} / ${lead.utm_medium || ""} / ${lead.utm_campaign || ""}</td>
            </tr>` : ""}
          </table>
          <p style="margin-top:20px;color:#666;">
            <strong>Reply to this email</strong> or contact them directly — the sooner the better.
          </p>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
    } else {
      console.log("Lead notification email sent successfully");
    }
  } catch (emailError) {
    console.error("Failed to send lead notification email:", emailError);
    // Non-blocking — the lead is already saved to Supabase
  }
}

async function sendCustomerWelcome({ name, email }) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const firstName = name.split(" ")[0];

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Lyndon at YourWonClaim <support@yourwonclaim.com>",
        to: [email],
        subject: "Your VA Claim Status Roadmap (+ bonus checklist inside)",
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Inter,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">

    <!-- Header -->
    <div style="background:#0B1A2F;padding:28px 32px;text-align:center;">
      <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.05em;">YOURWONCLAIM.COM</span>
    </div>

    <!-- Body -->
    <div style="padding:40px 32px;">
      <p style="font-size:16px;color:#333;margin:0 0 20px;">Hey ${firstName},</p>
      <p style="font-size:16px;color:#333;margin:0 0 20px;">
        I'm Lyndon — 100% P&T Iraq veteran, and I built YourWonClaim because I went through the VA claims process myself and know how confusing and frustrating it is.
      </p>
      <p style="font-size:16px;color:#333;margin:0 0 24px;">
        Here's what I promised you:
      </p>

      <!-- Roadmap Section -->
      <div style="background:#0B1A2F;border-radius:8px;padding:28px 28px;margin:0 0 28px;">
        <p style="color:#C21818;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 12px;">Your VA Claim Status Roadmap</p>
        <h2 style="color:#ffffff;font-size:20px;font-weight:700;margin:0 0 20px;line-height:1.3;">The 5 Stages of a VA Claim — What Each Status Actually Means</h2>

        <div style="margin:0 0 16px;">
          <p style="color:#C21818;font-weight:700;margin:0 0 4px;font-size:14px;">Stage 1: Claim Received</p>
          <p style="color:#A9B3C2;font-size:14px;margin:0;line-height:1.6;">VA has it. Nothing to do yet. Average time: 1–5 days. Don't call — it won't speed things up.</p>
        </div>
        <div style="margin:0 0 16px;">
          <p style="color:#C21818;font-weight:700;margin:0 0 4px;font-size:14px;">Stage 2: Initial Review</p>
          <p style="color:#A9B3C2;font-size:14px;margin:0;line-height:1.6;">A VSR reviews your file for completeness. If records are missing, they'll request them now. Average time: 1–4 weeks.</p>
        </div>
        <div style="margin:0 0 16px;">
          <p style="color:#C21818;font-weight:700;margin:0 0 4px;font-size:14px;">Stage 3: Evidence Gathering</p>
          <p style="color:#A9B3C2;font-size:14px;margin:0;line-height:1.6;">The VA is pulling your medical records, service records, and may schedule a C&P exam. <strong style="color:#ffffff;">This is the most critical stage.</strong> Submit any additional evidence NOW — buddy letters, private DBQs, symptom logs.</p>
        </div>
        <div style="margin:0 0 16px;">
          <p style="color:#C21818;font-weight:700;margin:0 0 4px;font-size:14px;">Stage 4: Preparation for Decision</p>
          <p style="color:#A9B3C2;font-size:14px;margin:0;line-height:1.6;">A rater is reviewing everything. No changes you make will be seen at this point. Average time: 1–3 weeks.</p>
        </div>
        <div style="margin:0 0 0px;">
          <p style="color:#C21818;font-weight:700;margin:0 0 4px;font-size:14px;">Stage 5: Preparation for Notification</p>
          <p style="color:#A9B3C2;font-size:14px;margin:0;line-height:1.6;">Decision is made. Your rating letter is being prepared. Average time: 3–10 days. Watch your mail.</p>
        </div>
      </div>

      <!-- Bonus Checklist -->
      <div style="border:1px solid #e8e8e8;border-radius:8px;padding:24px 24px;margin:0 0 28px;">
        <p style="color:#0B1A2F;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 12px;">Bonus: Evidence Checklist</p>
        <h3 style="color:#0B1A2F;font-size:17px;font-weight:700;margin:0 0 16px;">What Raters Actually Look For (PTSD &amp; Tinnitus)</h3>
        <p style="color:#555;font-size:14px;font-weight:600;margin:0 0 8px;">For PTSD, raters want to see:</p>
        <ul style="color:#555;font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px;">
          <li>How often symptoms occur (daily, weekly, during stress)</li>
          <li>Impact on occupational function (missed work, performance issues)</li>
          <li>Impact on social/relationship function</li>
          <li>Specific triggers documented with dates</li>
          <li>Sleep disruption — hours, nightmares, frequency</li>
        </ul>
        <p style="color:#555;font-size:14px;font-weight:600;margin:0 0 8px;">For Tinnitus:</p>
        <ul style="color:#555;font-size:14px;line-height:1.8;padding-left:20px;margin:0;">
          <li>Constant vs. intermittent (constant = higher rating)</li>
          <li>Effect on concentration, sleep, communication</li>
          <li>Exposure history (weapons fire, aircraft, heavy equipment)</li>
        </ul>
      </div>

      <!-- Buddy Letter tip -->
      <div style="background:#f8f8f8;border-left:4px solid #C21818;padding:20px 20px;margin:0 0 28px;border-radius:0 8px 8px 0;">
        <p style="color:#0B1A2F;font-size:14px;font-weight:700;margin:0 0 8px;">Buddy Letter Cheat Sheet</p>
        <p style="color:#555;font-size:14px;margin:0;line-height:1.6;">Ask your buddy to write: (1) how long they've known you, (2) specific behaviors they've witnessed that relate to your condition, (3) how you were before service vs. after. First-person, specific, dated incidents beat vague "he seems stressed" letters every time.</p>
      </div>

      <!-- Upsell -->
      <div style="background:#FFF5F5;border:1px solid #f5c0c0;border-radius:8px;padding:24px 24px;margin:0 0 28px;text-align:center;">
        <p style="color:#C21818;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 8px;">Take the Next Step</p>
        <p style="color:#0B1A2F;font-size:17px;font-weight:700;margin:0 0 12px;line-height:1.4;">The roadmap tells you what to do.<br>The templates help you say it right.</p>
        <p style="color:#555;font-size:14px;margin:0 0 20px;line-height:1.6;">30-day condition-specific symptom logs — written in the language VA raters actually evaluate. PTSD, Tinnitus, Back Pain, Migraines &amp; more. From $29.</p>
        <a href="https://yourwonclaim.com/products.html" style="display:inline-block;background:#C21818;color:#ffffff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:6px;text-decoration:none;">Browse Evidence Templates →</a>
      </div>

      <p style="font-size:14px;color:#777;margin:0 0 8px;">Questions? Reply to this email — I personally read every one.</p>
      <p style="font-size:14px;color:#333;margin:0;">— Lyndon Bedford<br><span style="color:#777;">100% P&T | Iraq Veteran | Founder, YourWonClaim.com</span></p>
    </div>

    <!-- Footer -->
    <div style="background:#f4f4f4;padding:20px 32px;text-align:center;border-top:1px solid #e8e8e8;">
      <p style="font-size:12px;color:#999;margin:0;">© YourWonClaim.com — Educational resource. Not affiliated with the VA. Not legal advice.</p>
      <p style="font-size:12px;color:#999;margin:8px 0 0;">You received this because you requested the free VA Claim Status Roadmap.</p>
    </div>

  </div>
</body>
</html>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Customer welcome email error:", err);
    } else {
      console.log("Customer welcome email sent to:", email);
    }
  } catch (err) {
    console.error("Failed to send customer welcome email:", err);
  }
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Basic CORS headers (Vercel handles this for same-origin, but good practice)
  res.setHeader("Access-Control-Allow-Origin", "https://yourwonclaim.com");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    const body = req.body;
    const name = (body?.name || "").trim();
    const email = (body?.email || "").trim();

    if (!name || !email) {
      return res.status(400).json({ error: "name and email are required" });
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Collect UTM params if sent
    const source_url = body.sourceUrl || "/";
    const utm_source = body.utmSource || null;
    const utm_medium = body.utmMedium || null;
    const utm_campaign = body.utmCampaign || null;

    const supabase = getSupabase();
    const { error: dbError } = await supabase.from("ywc_leads").insert({
      name,
      email,
      source_url,
      utm_source,
      utm_medium,
      utm_campaign,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return res.status(500).json({ error: "Failed to save lead" });
    }

    // Send email notification to Lyndon (non-blocking — lead already saved)
    sendLeadNotification({ name, email, source_url, utm_source, utm_medium, utm_campaign });

    // Send welcome email with roadmap to the customer (non-blocking)
    sendCustomerWelcome({ name, email });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
