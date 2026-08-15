import { useCallback, useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import {
  CONSENT_CHANGE_EVENT,
  CONSENT_OPEN_EVENT,
  readConsent,
  writeConsent,
  type ConsentChoice,
} from "@/lib/consent";

let googleTagLoaded = false;

function loadGoogleTag() {
  if (googleTagLoaded || typeof window === "undefined") return;
  const tagId = import.meta.env.VITE_GOOGLE_TAG_ID?.trim();
  if (!tagId) return;
  googleTagLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(tagId)}`;
  script.dataset.leadmapGoogleTag = tagId;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
  });
  window.gtag("config", tagId, { anonymize_ip: true });
}

export function ConsentManager() {
  const english = useRouterState({
    select: (state) =>
      state.location.pathname === "/en" || state.location.pathname.startsWith("/en/"),
  });
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    setChoice(stored);
    setOpen(stored === null);
    if (stored === "granted") loadGoogleTag();

    const onOpen = () => setOpen(true);
    const onChange = (event: Event) => {
      const next = (event as CustomEvent<ConsentChoice>).detail;
      setChoice(next);
      if (next === "granted") loadGoogleTag();
    };
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    return () => {
      window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
      window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
    };
  }, []);

  const select = useCallback((next: ConsentChoice) => {
    writeConsent(next);
    setChoice(next);
    setOpen(false);
    if (next === "granted") loadGoogleTag();
  }, []);

  if (!open) return null;

  return (
    <aside
      aria-label={english ? "Cookie settings" : "Cookieinställningar"}
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl border border-border bg-background/98 p-5 shadow-2xl backdrop-blur md:bottom-6 md:p-6"
    >
      <div className="flex items-start gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center border border-border bg-card">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <h2 className="text-base font-medium">
            {english ? "Optional measurement" : "Valfri mätning"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {english
              ? "We use essential functions for forms and security. With your permission, we also load Google measurement to understand which campaigns lead to genuine enquiries."
              : "Vi använder nödvändiga funktioner för formulär och säkerhet. Med ditt godkännande laddar vi även Google-mätning för att förstå vilka kampanjer som leder till riktiga förfrågningar."}
          </p>
          <a href="/privacy" className="mt-2 inline-block text-xs underline underline-offset-4">
            {english ? "Read the privacy notice" : "Läs integritetspolicyn"}
          </a>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => select("granted")}
              className="bg-foreground px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-background"
            >
              {english ? "Accept measurement" : "Godkänn mätning"}
            </button>
            <button
              type="button"
              onClick={() => select("denied")}
              className="border border-border px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em]"
            >
              {english ? "Essential only" : "Endast nödvändiga"}
            </button>
          </div>
        </div>
      </div>
      <span className="sr-only">
        {english ? "Current choice" : "Nuvarande val"}:{" "}
        {choice || (english ? "not selected" : "inte valt")}
      </span>
    </aside>
  );
}
