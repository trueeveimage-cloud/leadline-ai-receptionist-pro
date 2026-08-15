#!/usr/bin/env node

import { resolve4, resolveAny, resolveMx, resolveTxt } from "node:dns/promises";

const domain = process.env.LEADMAP_DOMAIN?.trim() || "leadmap.se";
const senderDomain = process.env.LEADMAP_EMAIL_SENDER_DOMAIN?.trim() || `notify.${domain}`;
const dkimSelector = process.env.LEADMAP_DKIM_SELECTOR?.trim() || "";
let blocked = false;

async function check(label, resolver, predicate = (records) => records.length > 0) {
  try {
    const records = await resolver();
    if (!predicate(records)) throw new Error("required record not found");
    console.log(`OK   ${label}`);
    return records;
  } catch {
    blocked = true;
    console.log(`MISS ${label}`);
    return [];
  }
}

console.log(`Domain readiness for ${domain}`);
await check("Website apex resolves", () => resolve4(domain));
await check("Website www resolves", () => resolve4(`www.${domain}`));
await check("Mailbox MX exists", () => resolveMx(domain));
await check(
  "SPF policy exists",
  () => resolveTxt(domain),
  (records) => records.some((record) => record.join("").toLowerCase().startsWith("v=spf1")),
);
await check(
  "DMARC policy exists",
  () => resolveTxt(`_dmarc.${domain}`),
  (records) => records.some((record) => record.join("").toLowerCase().startsWith("v=dmarc1")),
);
await check("Transactional sender domain exists", () => resolveAny(senderDomain));

if (dkimSelector) {
  await check("DKIM selector resolves", () =>
    resolveAny(`${dkimSelector}._domainkey.${senderDomain}`),
  );
} else {
  blocked = true;
  console.log("MISS LEADMAP_DKIM_SELECTOR is not configured; DKIM cannot be verified.");
}

if (blocked) {
  console.log("\nDomain preflight incomplete. Do not send production email or paid traffic yet.");
  process.exitCode = 1;
} else {
  console.log("\nDNS records exist. Still complete one real inbound and outbound mailbox test.");
}
