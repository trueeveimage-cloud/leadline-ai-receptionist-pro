export const SITE_URL = "https://www.leadmap.se";
export const CONTACT_EMAIL = "hello@leadmap.se";

const env = import.meta.env as Record<string, string | undefined>;

export const LEGAL_ENTITY = {
  name: env.VITE_LEADMAP_LEGAL_NAME?.trim() || "Leadmap",
  organizationNumber: env.VITE_LEADMAP_ORG_NUMBER?.trim() || "",
  address: env.VITE_LEADMAP_BUSINESS_ADDRESS?.trim() || "",
};

export const PRICING = {
  pilot: {
    monthlySek: 2_900,
    setupSek: 2_000,
    includedMinutes: 500,
  },
  premium: {
    monthlySek: 4_900,
    setupSek: 0,
    includedMinutes: 1_500,
  },
  overageSekPerMinute: 2.5,
  pilotDays: 7,
  cancellationDays: 30,
  vatLabel: "exkl. moms",
} as const;
