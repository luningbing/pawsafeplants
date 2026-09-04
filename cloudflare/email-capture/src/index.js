const ALLOWED_PRODUCTION_ORIGINS = new Set([
  "https://whichadgotsale.com",
  "https://www.whichadgotsale.com"
]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONSENT_VERSION = "shipping-scanner-email-v1-2026-09-04";

function isAllowedOrigin(origin) {
  if (ALLOWED_PRODUCTION_ORIGINS.has(origin)) return true;

  try {
    const url = new URL(origin);
    return url.protocol === "http:" && ["127.0.0.1", "localhost"].includes(url.hostname);
  } catch {
    return false;
  }
}

function corsHeaders(origin) {
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin"
  };

  if (isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function json(origin, status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: corsHeaders(origin)
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (!isAllowedOrigin(origin)) {
      return json(origin, 403, { ok: false, error: "origin_not_allowed" });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return json(origin, 405, { ok: false, error: "method_not_allowed" });
    }

    const contentType = request.headers.get("Content-Type") || "";
    if (!contentType.toLowerCase().startsWith("application/json")) {
      return json(origin, 415, { ok: false, error: "json_required" });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json(origin, 400, { ok: false, error: "invalid_json" });
    }

    // Honeypot: bots often fill fields hidden from people. Return a normal-looking
    // response without storing anything so the trap is not disclosed to the bot.
    if (typeof body.website === "string" && body.website.trim()) {
      return json(origin, 200, { ok: true });
    }

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const newsletterOptIn = body.newsletter_opt_in === true ? 1 : 0;

    if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
      return json(origin, 400, { ok: false, error: "invalid_email" });
    }

    const now = new Date().toISOString();
    const optedInAt = newsletterOptIn ? now : null;

    try {
      await env.LEADS_DB.prepare(`
        INSERT INTO leads (
          id,
          email,
          newsletter_opt_in,
          source,
          consent_version,
          first_submitted_at,
          last_submitted_at,
          newsletter_opted_in_at,
          submission_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        ON CONFLICT(email) DO UPDATE SET
          newsletter_opt_in = CASE
            WHEN excluded.newsletter_opt_in = 1 THEN 1
            ELSE leads.newsletter_opt_in
          END,
          consent_version = CASE
            WHEN excluded.newsletter_opt_in = 1 THEN excluded.consent_version
            ELSE leads.consent_version
          END,
          last_submitted_at = excluded.last_submitted_at,
          newsletter_opted_in_at = CASE
            WHEN excluded.newsletter_opt_in = 1
              THEN COALESCE(leads.newsletter_opted_in_at, excluded.newsletter_opted_in_at)
            ELSE leads.newsletter_opted_in_at
          END,
          submission_count = leads.submission_count + 1
      `).bind(
        crypto.randomUUID(),
        email,
        newsletterOptIn,
        "shipping-adjustment-scanner",
        CONSENT_VERSION,
        now,
        now,
        optedInAt
      ).run();

      return json(origin, 200, { ok: true });
    } catch {
      return json(origin, 500, { ok: false, error: "storage_unavailable" });
    }
  }
};
