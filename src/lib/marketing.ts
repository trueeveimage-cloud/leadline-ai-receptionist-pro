import { hasMarketingConsent } from "@/lib/consent";

export type MarketingEventName =
  | "landing_view"
  | "audit_start"
  | "audit_submit"
  | "demo_open"
  | "demo_booked"
  | "qualified_lead"
  | "pilot_won";

export type MarketingAttribution = {
  source_page: string;
  landing_path: string;
  page_type: string;
  cta_variant: string;
  niche: string;
  city: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  gclid: string;
  gbraid: string;
  wbraid: string;
  fbclid: string;
  referrer: string;
};

const ATTRIBUTION_STORAGE_KEY = "leadmap-session-attribution";
const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
] as const;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function pageType(pathname: string) {
  if (pathname === "/") return "homepage";
  if (pathname === "/en") return "homepage_en";
  if (pathname === "/missade-samtal-audit") return "audit";
  if (pathname.startsWith("/anvandningsfall/vvs")) return "vvs_landing";
  if (pathname.startsWith("/anvandningsfall/")) return "use_case";
  if (pathname.startsWith("/ai-telefonist/")) return "city_landing";
  return "marketing_page";
}

function readStoredAttribution(): Partial<MarketingAttribution> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(
      window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) || "{}",
    ) as Partial<MarketingAttribution>;
  } catch {
    return {};
  }
}

function storeAttribution(attribution: MarketingAttribution) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Attribution still travels with the current request when storage is unavailable.
  }
}

export function captureMarketingAttribution(
  overrides: Partial<MarketingAttribution> = {},
): MarketingAttribution {
  if (typeof window === "undefined") {
    return {
      source_page: overrides.source_page || "server",
      landing_path: overrides.landing_path || "server",
      page_type: overrides.page_type || "unknown",
      cta_variant: overrides.cta_variant || "unknown",
      niche: overrides.niche || "",
      city: overrides.city || "",
      utm_source: overrides.utm_source || "",
      utm_medium: overrides.utm_medium || "",
      utm_campaign: overrides.utm_campaign || "",
      utm_term: overrides.utm_term || "",
      utm_content: overrides.utm_content || "",
      gclid: overrides.gclid || "",
      gbraid: overrides.gbraid || "",
      wbraid: overrides.wbraid || "",
      fbclid: overrides.fbclid || "",
      referrer: overrides.referrer || "",
    };
  }

  const stored = readStoredAttribution();
  const params = new URLSearchParams(window.location.search);
  const path = window.location.pathname;
  const campaignValues = Object.fromEntries(
    ATTRIBUTION_KEYS.map((key) => [key, params.get(key) || stored[key] || ""]),
  ) as Pick<MarketingAttribution, (typeof ATTRIBUTION_KEYS)[number]>;

  const attribution: MarketingAttribution = {
    source_page: params.get("source_page") || overrides.source_page || stored.source_page || path,
    landing_path: stored.landing_path || path,
    page_type: overrides.page_type || pageType(path),
    cta_variant: overrides.cta_variant || params.get("cta_variant") || "primary",
    niche:
      overrides.niche ||
      params.get("niche_page") ||
      stored.niche ||
      (path.includes("/vvs") ? "vvs" : ""),
    city: overrides.city || params.get("city_page") || stored.city || "",
    ...campaignValues,
    referrer: stored.referrer || document.referrer || "",
  };

  storeAttribution(attribution);
  return { ...attribution, ...overrides };
}

export function createSubmissionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (token) => {
    const random = Math.floor(Math.random() * 16);
    const value = token === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function googleConversionTarget(eventName: MarketingEventName) {
  const tagId = import.meta.env.VITE_GOOGLE_TAG_ID?.trim();
  if (!tagId) return undefined;
  if (eventName === "audit_submit") {
    const label = import.meta.env.VITE_GOOGLE_ADS_AUDIT_LABEL?.trim();
    return label ? `${tagId}/${label}` : undefined;
  }
  if (eventName === "demo_booked") {
    const label = import.meta.env.VITE_GOOGLE_ADS_DEMO_LABEL?.trim();
    return label ? `${tagId}/${label}` : undefined;
  }
  return undefined;
}

export function trackGoogleEvent(
  eventName: MarketingEventName,
  attribution: MarketingAttribution = captureMarketingAttribution(),
) {
  if (!hasMarketingConsent() || typeof window === "undefined" || !window.gtag) return;
  const sendTo = googleConversionTarget(eventName);
  window.gtag("event", sendTo ? "conversion" : eventName, {
    page_path: window.location.pathname,
    campaign_source: attribution.utm_source || undefined,
    campaign_medium: attribution.utm_medium || undefined,
    campaign_name: attribution.utm_campaign || undefined,
    send_to: sendTo,
  });
}

export function recordMarketingEvent(
  eventName: Exclude<MarketingEventName, "qualified_lead" | "pilot_won">,
  options: {
    eventId?: string;
    attribution?: MarketingAttribution;
    metadata?: Record<string, string | number | boolean | null>;
    server?: boolean;
  } = {},
) {
  if (typeof window === "undefined") return;
  const attribution = options.attribution || captureMarketingAttribution();
  const eventId = options.eventId || createSubmissionId();

  trackGoogleEvent(eventName, attribution);
  if (options.server === false) return;

  const body = JSON.stringify({
    eventId,
    eventName,
    attribution,
    metadata: options.metadata || {},
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/public/marketing-events",
      new Blob([body], { type: "application/json" }),
    );
    return;
  }

  void fetch("/api/public/marketing-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}
