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

    // Send email notification (non-blocking — lead already saved)
    sendLeadNotification({ name, email, source_url, utm_source, utm_medium, utm_campaign });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
