export type ConsentChoice = "granted" | "denied";

export const CONSENT_STORAGE_KEY = "leadmap-marketing-consent";
export const CONSENT_CHANGE_EVENT = "leadmap:consent-change";
export const CONSENT_OPEN_EVENT = "leadmap:consent-open";

export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(choice: ConsentChoice) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // The UI still updates even when storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: choice }));
}

export function hasMarketingConsent() {
  return readConsent() === "granted";
}

export function openConsentSettings() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
