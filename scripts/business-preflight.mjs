import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const requiredDocuments = [
  "docs/vvs-pilot-order-form-draft.md",
  "docs/data-processing-agreement-draft.md",
  "docs/vvs-onboarding-questionnaire.md",
  "docs/vvs-call-flow-and-approval.md",
  "docs/vvs-pilot-scorecard.md",
  "docs/invoice-readiness-checklist.md",
];

const unresolvedMarkers = [
  "[LEGAL COMPANY NAME]",
  "[ORGANISATION NUMBER]",
  "[BUSINESS ADDRESS]",
  "[VAT NUMBER]",
  "[RETENTION TO CONFIRM]",
  "[SUBPROCESSOR LOCATION TO CONFIRM]",
  "[SAFEGUARD TO CONFIRM]",
  "[INCIDENT WINDOW TO CONFIRM]",
  "[IN ADVANCE/IN ARREARS]",
];

let blocked = false;
console.log("First-customer document pack");
for (const documentPath of requiredDocuments) {
  try {
    await access(resolve(documentPath));
    console.log(`OK   ${documentPath}`);
  } catch {
    blocked = true;
    console.log(`MISS ${documentPath}`);
  }
}

console.log("\nCommercial inputs");
const minuteCost = numberEnv("LEADMAP_BLENDED_COST_SEK_PER_MINUTE");
const sharedCost = numberEnv("LEADMAP_SHARED_COST_SEK_PER_CUSTOMER", 300);
const targetMargin = numberEnv("LEADMAP_TARGET_GROSS_MARGIN_PERCENT", 70);

if (minuteCost === undefined) {
  blocked = true;
  console.log("MISS LEADMAP_BLENDED_COST_SEK_PER_MINUTE");
} else {
  console.log(`OK   blended minute cost supplied (${minuteCost.toFixed(2)} SEK)`);
  for (const plan of [
    { name: "Pilot", monthly: 2_900, minutes: 500 },
    { name: "Premium", monthly: 4_900, minutes: 1_500 },
  ]) {
    const margin = ((plan.monthly - plan.minutes * minuteCost - sharedCost) / plan.monthly) * 100;
    const pass = margin >= targetMargin;
    if (!pass) blocked = true;
    console.log(
      `${pass ? "OK  " : "HOLD"} ${plan.name} margin at included usage: ${margin.toFixed(1)}%`,
    );
  }
  const overageMargin = ((2.5 - minuteCost) / 2.5) * 100;
  const overagePass = overageMargin >= targetMargin;
  if (!overagePass) blocked = true;
  console.log(
    `${overagePass ? "OK  " : "HOLD"} Overage margin at 2.50 SEK/min: ${overageMargin.toFixed(1)}%`,
  );
}

console.log("\nPublication blockers in drafts");
let markerCount = 0;
for (const documentPath of requiredDocuments) {
  try {
    const content = await readFile(resolve(documentPath), "utf8");
    for (const marker of unresolvedMarkers) {
      if (content.includes(marker)) {
        markerCount += 1;
        console.log(`OPEN ${documentPath}: ${marker}`);
      }
    }
  } catch {
    // Missing files were reported above.
  }
}
if (markerCount > 0) blocked = true;

console.log(
  blocked
    ? "\nBusiness preflight incomplete. Do not sign a pilot order yet."
    : "\nBusiness preflight passed. Complete legal review and production preflight before signing.",
);
process.exitCode = blocked ? 1 : 0;

function numberEnv(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) {
    blocked = true;
    console.log(`INVALID ${name}`);
    return undefined;
  }
  return value;
}
