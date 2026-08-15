export const DEFAULT_CONTACT_EMAIL = "hello@leadmap.se";

export function getLeadmapOwnerEmail() {
  return process.env.LEADMAP_OWNER_EMAIL?.trim() || DEFAULT_CONTACT_EMAIL;
}

export function getLeadmapEmailFrom() {
  return process.env.LEADMAP_EMAIL_FROM?.trim() || `Leadmap <${DEFAULT_CONTACT_EMAIL}>`;
}

export function getLeadmapEmailSenderDomain() {
  return process.env.LEADMAP_EMAIL_SENDER_DOMAIN?.trim() || "notify.leadmap.se";
}
