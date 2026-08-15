# Leadmap advertising operations

## Local completion versus external launch

The application, migration, campaign package, and preview can be completed locally. The following cannot be truthfully completed without the owner-controlled external accounts:

- Verified legal company name, organisation number, address, and a working `hello@leadmap.se` mailbox.
- Google Ads billing country/currency/timezone, owner-entered payment method, and advertiser/payment verification.
- Google Calendar OAuth refresh token for the booking calendar.
- Retell API key and published Swedish demo agent ID.
- Google tag ID and conversion labels.
- Supabase production migration and secrets.
- Google Ads Keyword Planner forecast and a paused account-side campaign import.

Never paste bank credentials, card details, passwords, OAuth refresh tokens, service-role keys, or Retell API keys into chat or client-side `VITE_*` variables.

## Deal inbox and sending identity

The server expects:

- `LEADMAP_OWNER_EMAIL` (defaults to `hello@leadmap.se`)
- `LEADMAP_EMAIL_FROM` (defaults to `Leadmap <hello@leadmap.se>`)
- `LEADMAP_EMAIL_SENDER_DOMAIN` (defaults to `notify.leadmap.se`)
- `LOVABLE_API_KEY`
- `LOVABLE_SEND_URL` when the provider requires a custom send endpoint

Booking and message notifications route to `LEADMAP_OWNER_EMAIL`. Before paid traffic, verify that `hello@leadmap.se` receives mail and that the sender domain is approved by the transactional email provider.

Run `npm run preflight:domain` to verify public DNS for the website, MX, SPF, DMARC, the transactional sender domain, and the configured DKIM selector. DNS success does not prove mailbox access, so complete one real inbound and outbound message test afterward.

## Google Calendar OAuth

The server expects:

- `GOOGLE_CALENDAR_CLIENT_ID`
- `GOOGLE_CALENDAR_CLIENT_SECRET`
- `GOOGLE_CALENDAR_REFRESH_TOKEN`
- `GOOGLE_CALENDAR_ID` (defaults to `primary`)

Authorize the owner account once with the minimum Calendar event/free-busy access needed by the application. Store the refresh token only as a server secret. The server lists busy events, enforces Monday–Thursday 10:00–16:00, two demos/day, 30-minute events, 15-minute buffers, and 12 hours' notice. It creates a private event with a Google Meet link and attendee invitation.

To generate the refresh token locally after creating a Google OAuth client, run:

```bash
npm run calendar:oauth
```

Use `http://127.0.0.1:4567/oauth2callback` as the OAuth redirect URI. The script prints only the refresh token value needed for `GOOGLE_CALENDAR_REFRESH_TOKEN`.

When Calendar is not connected, local development returns clearly marked preview slots. Production returns `503` and must never fire `demo_booked`.

After secrets are set in the deployment environment, run:

```bash
npm run preflight:prod
```

This checks required env values without printing secret contents, verifies Calendar and Data Manager OAuth scopes, confirms Calendar read access, and checks that protected Supabase tables expose no rows through the anonymous key.

## Retell web demo

The server expects `RETELL_API_KEY`, `RETELL_WEB_DEMO_AGENT_ID_SV`, and a random `VOICE_DEMO_RATE_LIMIT_SALT`. It requests a short-lived Retell web-call token. The client never receives the API key.

The SQL quota allows three sessions per client hash in 24 hours and 50 issued sessions/month, equivalent to the 100-minute ceiling at two minutes/session. The call override requests a 120-second maximum, basic-attributes-only storage, and one-day retention. Confirm these settings on the published Retell agent before deployment.

## Conversion flow

- `audit_submit` and calendar-confirmed `demo_booked` are initial Google primary conversions.
- `landing_view`, `audit_start`, and `demo_open` are diagnostics.
- CRM status `qualified` queues `qualified_lead`.
- The CRM provides explicit `Qualify` and `Record pilot` actions. Recording a pilot requires the actual positive first-invoice amount; the database rejects a won status without it.
- CRM status `pilot_won`, `won`, `closed_won`, or `customer` queues `pilot_won` with that invoice value.
- `conversion_outbox` is service-role only and provides idempotent upload state. Data Manager credentials and the account-side conversion action IDs must be added after the Google Ads account exists.
- Upload actual first-invoice value only. Hash normalized first-party data at upload time and send it only when the required advertising consent exists.

### Google Data Manager outbox

The uploader uses the current Google Data Manager `events:ingest` endpoint. It sends only `qualified_lead` and `pilot_won` rows whose related lead has explicit advertising consent. Email and phone identifiers are normalized and SHA-256 hashed immediately before upload. IP addresses are never uploaded.

Required server-only values:

- `GOOGLE_DATA_MANAGER_CLIENT_ID`
- `GOOGLE_DATA_MANAGER_CLIENT_SECRET`
- `GOOGLE_DATA_MANAGER_REFRESH_TOKEN`
- `GOOGLE_DATA_MANAGER_PROJECT_ID`
- `GOOGLE_ADS_CUSTOMER_ID`
- `GOOGLE_ADS_LOGIN_CUSTOMER_ID` when a manager account is used
- `GOOGLE_ADS_QUALIFIED_LEAD_ACTION_ID`
- `GOOGLE_ADS_PILOT_WON_ACTION_ID`

The conversion action IDs must reference Google Ads `UPLOAD_CLICKS` actions. Generate the dedicated OAuth token with `npm run data-manager:oauth`. Use `http://127.0.0.1:4568/oauth2callback` as the redirect URI.

Run the stages deliberately:

```bash
npm run conversions:check
npm run conversions:validate
npm run conversions:send
```

`conversions:check` reads the outbox but sends nothing. `conversions:validate` submits `validateOnly: true` and does not alter outbox rows. Only `conversions:send` claims rows and can create real conversion uploads. It uses stable transaction IDs, retries transient errors, and dead-letters invalid or non-consented rows.

Implementation references: [Data Manager event ingestion](https://developers.google.com/data-manager/api/reference/rest/v1/events/ingest), [formatting and hashing user data](https://developers.google.com/data-manager/api/devguides/concepts/formatting), and [offline conversion destinations](https://developers.google.com/data-manager/api/devguides/events/send-events).

## Weekly scorecard

Every Monday at 09:00 Europe/Stockholm report only: spend, clicks, relevant-search percentage, audits, qualified leads, demos held, pilots won, qualified-lead CPA, and won-pilot CAC. Immediate alerts are limited to tracking/form/calendar failures, billing problems, policy disapprovals, and automatic pauses.

## First-pilot delivery and proof

The initial VVS offer is done-for-you within the agreed scope: Leadmap drafts the script, qualification, handoff, and fallback rules; helps configure forwarding; and manually reviews the seven pilot days. Customer traffic remains disconnected until the buyer approves the test call, script, fallback rules, and handoff in writing.

This is a start-safety promise, not a revenue guarantee. Operational evidence must be captured from the real pilot before the site uses a case study, testimonial, conversion percentage, or revenue claim. Use [the first-pilot sales and proof playbook](./first-vvs-pilot-sales-playbook.md) for the demo agenda, close language, objections, QA, and evidence checklist.

## Stop and scale rules

- Pause immediately if tracking, form submission, or confirmed booking fails.
- Review search terms daily and add irrelevant queries as negatives before more spend.
- Pause the campaign at 500 SEK if there are no completed audits.
- Hard stop at 1,000 SEK after 14 days.
- Keep Nomia paused while Leadmap is running.
- Unlock the 1,250 SEK reserve only after two qualified leads, one attended sales conversation, and qualified-lead cost at or below 500 SEK.
- Release reserve only in two 625 SEK tranches; stop if lead quality or acquisition cost deteriorates.
