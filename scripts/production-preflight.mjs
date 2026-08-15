#!/usr/bin/env node

const requiredServerSecrets = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "LEADMAP_OWNER_EMAIL",
  "LEADMAP_EMAIL_FROM",
  "LEADMAP_EMAIL_SENDER_DOMAIN",
  "LOVABLE_API_KEY",
  "GOOGLE_CALENDAR_CLIENT_ID",
  "GOOGLE_CALENDAR_CLIENT_SECRET",
  "GOOGLE_CALENDAR_REFRESH_TOKEN",
  "GOOGLE_DATA_MANAGER_CLIENT_ID",
  "GOOGLE_DATA_MANAGER_CLIENT_SECRET",
  "GOOGLE_DATA_MANAGER_REFRESH_TOKEN",
  "GOOGLE_DATA_MANAGER_PROJECT_ID",
  "GOOGLE_ADS_CUSTOMER_ID",
  "GOOGLE_ADS_QUALIFIED_LEAD_ACTION_ID",
  "GOOGLE_ADS_PILOT_WON_ACTION_ID",
  "RETELL_API_KEY",
  "RETELL_WEB_DEMO_AGENT_ID_SV",
  "VOICE_DEMO_RATE_LIMIT_SALT",
];

const requiredPublicValues = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "VITE_LEADMAP_LEGAL_NAME",
  "VITE_LEADMAP_ORG_NUMBER",
  "VITE_LEADMAP_BUSINESS_ADDRESS",
  "VITE_GOOGLE_TAG_ID",
  "VITE_GOOGLE_ADS_AUDIT_LABEL",
  "VITE_GOOGLE_ADS_DEMO_LABEL",
];

const skipNetwork = process.argv.includes("--skip-network");
const failures = [];

function value(name) {
  return process.env[name]?.trim() || "";
}

function hasValue(name) {
  return Boolean(value(name));
}

function printGroup(title, names) {
  console.log(`\n${title}`);
  for (const name of names) console.log(`${hasValue(name) ? "OK  " : "MISS"} ${name}`);
}

function fail(message) {
  failures.push(message);
  console.log(`FAIL ${message}`);
}

function pass(message) {
  console.log(`OK   ${message}`);
}

function validateConfiguration() {
  console.log("\nConfiguration validation");

  for (const name of ["SUPABASE_URL", "VITE_SUPABASE_URL"]) {
    if (!hasValue(name)) continue;
    try {
      const url = new URL(value(name));
      if (url.protocol !== "https:") fail(`${name} must use HTTPS.`);
      else pass(`${name} uses HTTPS.`);
    } catch {
      fail(`${name} is not a valid URL.`);
    }
  }

  if (
    hasValue("SUPABASE_URL") &&
    hasValue("VITE_SUPABASE_URL") &&
    value("SUPABASE_URL").replace(/\/$/, "") !== value("VITE_SUPABASE_URL").replace(/\/$/, "")
  ) {
    fail("Server and browser Supabase URLs do not match.");
  }

  if (hasValue("VITE_GOOGLE_TAG_ID") && !/^AW-\d+$/.test(value("VITE_GOOGLE_TAG_ID"))) {
    fail("VITE_GOOGLE_TAG_ID must use the AW-123456789 format.");
  }

  for (const name of [
    "GOOGLE_ADS_CUSTOMER_ID",
    "GOOGLE_ADS_LOGIN_CUSTOMER_ID",
    "GOOGLE_ADS_QUALIFIED_LEAD_ACTION_ID",
    "GOOGLE_ADS_PILOT_WON_ACTION_ID",
  ]) {
    if (hasValue(name) && !/^\d+$/.test(value(name).replaceAll("-", ""))) {
      fail(`${name} must contain a numeric Google Ads ID.`);
    }
  }

  for (const name of ["LEADMAP_OWNER_EMAIL", "LEADMAP_EMAIL_FROM"]) {
    if (hasValue(name) && !value(name).includes("@leadmap.se")) {
      fail(`${name} must use the verified leadmap.se domain.`);
    }
  }

  if (hasValue("VOICE_DEMO_RATE_LIMIT_SALT") && value("VOICE_DEMO_RATE_LIMIT_SALT").length < 32) {
    fail("VOICE_DEMO_RATE_LIMIT_SALT must contain at least 32 characters.");
  }

  for (const name of [
    "VITE_LEADMAP_LEGAL_NAME",
    "VITE_LEADMAP_ORG_NUMBER",
    "VITE_LEADMAP_BUSINESS_ADDRESS",
  ]) {
    if (hasValue(name) && /\[|\]|placeholder|to confirm/i.test(value(name))) {
      fail(`${name} still contains a placeholder.`);
    }
  }
}

async function getCalendarAccessToken() {
  const names = [
    "GOOGLE_CALENDAR_CLIENT_ID",
    "GOOGLE_CALENDAR_CLIENT_SECRET",
    "GOOGLE_CALENDAR_REFRESH_TOKEN",
  ];
  if (!names.every(hasValue)) {
    console.log("SKIP Google Calendar checks: OAuth secrets are incomplete.");
    return null;
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: value("GOOGLE_CALENDAR_CLIENT_ID"),
      client_secret: value("GOOGLE_CALENDAR_CLIENT_SECRET"),
      refresh_token: value("GOOGLE_CALENDAR_REFRESH_TOKEN"),
      grant_type: "refresh_token",
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    fail(`Google Calendar token exchange failed with status ${response.status}.`);
    return null;
  }
  pass("Google Calendar refresh token can be exchanged.");
  return data.access_token;
}

async function verifyCalendarRead() {
  const accessToken = await getCalendarAccessToken();
  if (!accessToken) return;
  const calendarId = value("GOOGLE_CALENDAR_ID") || "primary";
  const query = new URLSearchParams({
    maxResults: "1",
    singleEvents: "true",
    timeMin: new Date().toISOString(),
  });
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${query}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!response.ok)
    fail(`Google Calendar cannot read the configured calendar (${response.status}).`);
  else pass("Google Calendar can read availability.");
}

async function verifyDataManagerToken() {
  const names = [
    "GOOGLE_DATA_MANAGER_CLIENT_ID",
    "GOOGLE_DATA_MANAGER_CLIENT_SECRET",
    "GOOGLE_DATA_MANAGER_REFRESH_TOKEN",
  ];
  if (!names.every(hasValue)) {
    console.log("SKIP Google Data Manager check: OAuth secrets are incomplete.");
    return;
  }

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
    fail(`Google Data Manager token exchange failed with status ${response.status}.`);
    return;
  }

  const tokenInfoResponse = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${encodeURIComponent(data.access_token)}`,
  );
  const tokenInfo = await tokenInfoResponse.json().catch(() => ({}));
  if (
    !tokenInfoResponse.ok ||
    !String(tokenInfo.scope || "").includes("https://www.googleapis.com/auth/datamanager")
  ) {
    fail("Google Data Manager token does not include the datamanager scope.");
    return;
  }
  pass("Google Data Manager OAuth token has the required scope.");
}

async function verifySupabase() {
  if (
    !["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "VITE_SUPABASE_PUBLISHABLE_KEY"].every(hasValue)
  ) {
    console.log("SKIP Supabase checks: credentials are incomplete.");
    return;
  }

  const baseUrl = value("SUPABASE_URL").replace(/\/$/, "");
  const serviceKey = value("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = value("VITE_SUPABASE_PUBLISHABLE_KEY");
  const protectedTables = [
    "leads",
    "marketing_events",
    "demo_bookings",
    "voice_demo_sessions",
    "conversion_outbox",
  ];

  for (const table of protectedTables) {
    const endpoint = `${baseUrl}/rest/v1/${table}?select=id&limit=1`;
    const serviceResponse = await fetch(endpoint, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    });
    if (!serviceResponse.ok) {
      fail(
        `Service role cannot read ${table} (${serviceResponse.status}); migration may be missing.`,
      );
      continue;
    }
    pass(`Service role can read ${table}.`);

    const anonResponse = await fetch(endpoint, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    });
    const anonRows = anonResponse.ok ? await anonResponse.json().catch(() => null) : null;
    if (Array.isArray(anonRows) && anonRows.length > 0) {
      fail(`Anonymous access exposed rows from ${table}.`);
    } else {
      pass(`Anonymous access exposes no ${table} rows.`);
    }
  }
}

printGroup("Server secrets", requiredServerSecrets);
printGroup("Public deployment values", requiredPublicValues);

const missing = [...requiredServerSecrets, ...requiredPublicValues].filter(
  (name) => !hasValue(name),
);
for (const name of missing) failures.push(`Missing ${name}.`);
validateConfiguration();

if (skipNetwork) {
  console.log("\nSKIP Network checks requested with --skip-network.");
} else {
  console.log("\nProduction connectivity");
  try {
    await verifyCalendarRead();
  } catch (error) {
    fail(
      `Google Calendar check failed: ${error instanceof Error ? error.message : "unknown error"}.`,
    );
  }
  try {
    await verifyDataManagerToken();
  } catch (error) {
    fail(
      `Google Data Manager check failed: ${error instanceof Error ? error.message : "unknown error"}.`,
    );
  }
  try {
    await verifySupabase();
  } catch (error) {
    fail(`Supabase check failed: ${error instanceof Error ? error.message : "unknown error"}.`);
  }
}

if (failures.length > 0) {
  console.log(
    `\nPreflight blocked by ${failures.length} issue(s). Do not deploy or enable ads yet.`,
  );
  process.exitCode = 1;
} else {
  console.log(
    "\nPreflight passed. Continue with live form, booking, email, voice, and conversion verification.",
  );
}
