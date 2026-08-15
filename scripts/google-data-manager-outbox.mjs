#!/usr/bin/env node

import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const mode = process.argv.includes("--send")
  ? "send"
  : process.argv.includes("--validate-only")
    ? "validate"
    : "dry-run";
const limit = Math.min(
  50,
  Math.max(1, Number(process.argv.find((arg) => arg.startsWith("--limit="))?.split("=")[1] || 20)),
);

const requiredDatabase = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
const requiredGoogle = [
  "GOOGLE_DATA_MANAGER_CLIENT_ID",
  "GOOGLE_DATA_MANAGER_CLIENT_SECRET",
  "GOOGLE_DATA_MANAGER_REFRESH_TOKEN",
  "GOOGLE_DATA_MANAGER_PROJECT_ID",
  "GOOGLE_ADS_CUSTOMER_ID",
  "GOOGLE_ADS_QUALIFIED_LEAD_ACTION_ID",
  "GOOGLE_ADS_PILOT_WON_ACTION_ID",
];

function value(name) {
  return process.env[name]?.trim() || "";
}

function requireValues(names) {
  const missing = names.filter((name) => !value(name));
  if (missing.length) throw new Error(`Missing environment values: ${missing.join(", ")}`);
}

function normalizeGoogleAccountId(input) {
  return input.replace(/[^0-9]/g, "");
}

function normalizeEmail(input) {
  const compact = input.trim().toLowerCase().replace(/\s+/g, "");
  const [local, domain] = compact.split("@");
  if (!local || !domain) return null;
  if (domain === "gmail.com" || domain === "googlemail.com") {
    return `${local.split("+")[0].replaceAll(".", "")}@gmail.com`;
  }
  return `${local}@${domain}`;
}

function normalizeSwedishPhone(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  let digits = trimmed.replace(/[^0-9+]/g, "");
  if (digits.startsWith("00")) digits = `+${digits.slice(2)}`;
  if (digits.startsWith("0")) digits = `+46${digits.slice(1)}`;
  if (!/^\+[1-9]\d{7,14}$/.test(digits)) return null;
  return digits;
}

function sha256Hex(input) {
  return createHash("sha256").update(input).digest("hex");
}

function userIdentifiers(lead) {
  const identifiers = [];
  if (lead.email) {
    const email = normalizeEmail(lead.email);
    if (email) identifiers.push({ emailAddress: sha256Hex(email) });
  }
  if (lead.phone) {
    const phone = normalizeSwedishPhone(lead.phone);
    if (phone) identifiers.push({ phoneNumber: sha256Hex(phone) });
  }
  return identifiers;
}

function adIdentifiers(event) {
  return Object.fromEntries(
    ["gclid", "gbraid", "wbraid"]
      .map((key) => [key, event[key]])
      .filter(([, identifier]) => Boolean(identifier)),
  );
}

function conversionActionId(eventName) {
  return eventName === "pilot_won"
    ? value("GOOGLE_ADS_PILOT_WON_ACTION_ID")
    : value("GOOGLE_ADS_QUALIFIED_LEAD_ACTION_ID");
}

function buildRequest(row, event, lead, validateOnly) {
  if (lead.advertising_consent !== true) {
    throw new PermanentError("advertising_consent_not_granted");
  }
  if (row.event_name === "pilot_won" && !(Number(row.conversion_value_sek) > 0)) {
    throw new PermanentError("pilot_won_requires_actual_invoice_value");
  }

  const ads = adIdentifiers(event);
  const users = userIdentifiers(lead);
  if (Object.keys(ads).length === 0 && users.length === 0) {
    throw new PermanentError("no_match_identifier");
  }

  const operatingAccountId = normalizeGoogleAccountId(value("GOOGLE_ADS_CUSTOMER_ID"));
  const loginAccountId = normalizeGoogleAccountId(
    value("GOOGLE_ADS_LOGIN_CUSTOMER_ID") || operatingAccountId,
  );
  const conversionEvent = {
    transactionId: row.marketing_event_id,
    eventTimestamp: new Date(row.conversion_time).toISOString(),
    eventSource: "WEB",
    consent: {
      adUserData: "CONSENT_GRANTED",
      adPersonalization: "CONSENT_GRANTED",
    },
    ...(Object.keys(ads).length ? { adIdentifiers: ads } : {}),
    ...(users.length ? { userData: { userIdentifiers: users } } : {}),
    ...(Number(row.conversion_value_sek) > 0
      ? { conversionValue: Number(row.conversion_value_sek), currency: "SEK" }
      : {}),
  };

  return {
    destinations: [
      {
        operatingAccount: { accountType: "GOOGLE_ADS", accountId: operatingAccountId },
        loginAccount: { accountType: "GOOGLE_ADS", accountId: loginAccountId },
        productDestinationId: conversionActionId(row.event_name),
      },
    ],
    encoding: "HEX",
    consent: {
      adUserData: "CONSENT_GRANTED",
      adPersonalization: "CONSENT_GRANTED",
    },
    validateOnly,
    events: [conversionEvent],
  };
}

async function accessToken() {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: value("GOOGLE_DATA_MANAGER_CLIENT_ID"),
      client_secret: value("GOOGLE_DATA_MANAGER_CLIENT_SECRET"),
      refresh_token: value("GOOGLE_DATA_MANAGER_REFRESH_TOKEN"),
      grant_type: "refresh_token",
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    throw new Error(`Data Manager token exchange failed (${response.status})`);
  }
  return data.access_token;
}

async function ingest(token, body) {
  const response = await fetch("https://datamanager.googleapis.com/v1/events:ingest", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-goog-user-project": value("GOOGLE_DATA_MANAGER_PROJECT_ID"),
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message || `Data Manager request failed (${response.status})`;
    throw new Error(message);
  }
  return data;
}

function retryAt(attempts) {
  const minutes = Math.min(24 * 60, 5 * 2 ** Math.max(0, attempts - 1));
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

function cleanError(error) {
  return (error instanceof Error ? error.message : String(error)).slice(0, 1000);
}

class PermanentError extends Error {}

requireValues(requiredDatabase);
if (mode !== "dry-run") requireValues(requiredGoogle);

const supabase = createClient(value("SUPABASE_URL"), value("SUPABASE_SERVICE_ROLE_KEY"), {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { data: rows, error: outboxError } = await supabase
  .from("conversion_outbox")
  .select("*")
  .in("status", ["pending", "failed"])
  .lte("next_attempt_at", new Date().toISOString())
  .order("conversion_time", { ascending: true })
  .limit(limit);
if (outboxError) throw outboxError;

console.log(`Mode: ${mode}. Eligible outbox rows: ${(rows || []).length}.`);
let token = null;
let succeeded = 0;
let blocked = 0;

for (const row of rows || []) {
  const [{ data: event, error: eventError }, { data: lead, error: leadError }] = await Promise.all([
    supabase.from("marketing_events").select("*").eq("id", row.marketing_event_id).single(),
    supabase.from("leads").select("*").eq("id", row.lead_id).single(),
  ]);

  try {
    if (eventError || !event) throw new PermanentError("marketing_event_missing");
    if (leadError || !lead) throw new PermanentError("lead_missing");
    const request = buildRequest(row, event, lead, mode !== "send");

    if (mode === "dry-run") {
      console.log(`READY ${row.id} ${row.event_name}`);
      succeeded += 1;
      continue;
    }

    if (mode === "send") {
      const { data: claimed, error: claimError } = await supabase
        .from("conversion_outbox")
        .update({
          status: "in_progress",
          attempts: row.attempts + 1,
          last_attempt_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id)
        .in("status", ["pending", "failed"])
        .select("id")
        .maybeSingle();
      if (claimError) throw claimError;
      if (!claimed) continue;
    }

    token ||= await accessToken();
    const result = await ingest(token, request);
    if (mode === "send") {
      const { error: sentError } = await supabase
        .from("conversion_outbox")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          google_resource_name: result.requestId || null,
          last_error: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);
      if (sentError) throw sentError;
    }
    console.log(`${mode === "send" ? "SENT" : "VALID"} ${row.id} ${row.event_name}`);
    succeeded += 1;
  } catch (error) {
    blocked += 1;
    const permanent = error instanceof PermanentError;
    const attempts = Number(row.attempts || 0) + (mode === "send" ? 1 : 0);
    if (mode === "send") {
      await supabase
        .from("conversion_outbox")
        .update({
          status: permanent || attempts >= 8 ? "dead_letter" : "failed",
          attempts,
          next_attempt_at: retryAt(attempts),
          last_error: cleanError(error),
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);
    }
    console.error(`HOLD ${row.id} ${row.event_name}: ${cleanError(error)}`);
  }
}

console.log(`Complete. Ready/successful: ${succeeded}. Held/failed: ${blocked}.`);
if (blocked > 0) process.exitCode = 1;
