import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "da" | "es";

const dict = {
  en: {
    "nav.how": "How it works",
    "nav.industries": "Industries",
    "nav.pricing": "Pricing",
    "nav.faq": "FAQ",
    "nav.bookDemo": "Book demo",
    "nav.openMenu": "Open menu",
    "nav.closeMenu": "Close menu",

    "hero.badge": "AI receptionists for high-value businesses",
    "hero.title.l1": "Never miss a",
    "hero.title.l2": "high-value call",
    "hero.title.l3": "again.",
    "hero.subtitle": "AI receptionists that answer, qualify, book and notify — 24/7.",
    "hero.cta.book": "Book demo",
    "hero.cta.how": "How it works",

    "booking.title": "Book a setup call",
    "booking.subtitle": "15 minutes. No prep needed.",
    "booking.name": "Name",
    "booking.company": "Company",
    "booking.phone": "Phone",
    "booking.date": "Date",
    "booking.time": "Time",
    "booking.submit": "Request call",
    "booking.sending": "Sending…",
    "booking.done": "Done",
    "booking.success.title": "Request received.",
    "booking.success.body": "We'll call {name} within one business hour.",
    "booking.legal": "By submitting you agree to our",
    "booking.terms": "Terms",
    "booking.and": "and",
    "booking.privacy": "Privacy Policy",
    "booking.error.generic": "Couldn't send your request. Please try again.",

    "lang.label": "Language",
  },
  da: {
    "nav.how": "Sådan virker det",
    "nav.industries": "Brancher",
    "nav.pricing": "Priser",
    "nav.faq": "FAQ",
    "nav.bookDemo": "Book demo",
    "nav.openMenu": "Åbn menu",
    "nav.closeMenu": "Luk menu",

    "hero.badge": "AI-receptionister til premium virksomheder",
    "hero.title.l1": "Mist aldrig et",
    "hero.title.l2": "vigtigt opkald",
    "hero.title.l3": "igen.",
    "hero.subtitle": "AI-receptionister der svarer, kvalificerer, booker og notificerer — 24/7.",
    "hero.cta.book": "Book demo",
    "hero.cta.how": "Sådan virker det",

    "booking.title": "Book et opsætningsmøde",
    "booking.subtitle": "15 minutter. Ingen forberedelse.",
    "booking.name": "Navn",
    "booking.company": "Virksomhed",
    "booking.phone": "Telefon",
    "booking.date": "Dato",
    "booking.time": "Tidspunkt",
    "booking.submit": "Anmod om opkald",
    "booking.sending": "Sender…",
    "booking.done": "Færdig",
    "booking.success.title": "Anmodning modtaget.",
    "booking.success.body": "Vi ringer til {name} inden for én arbejdstime.",
    "booking.legal": "Ved at indsende accepterer du vores",
    "booking.terms": "Vilkår",
    "booking.and": "og",
    "booking.privacy": "Privatlivspolitik",
    "booking.error.generic": "Kunne ikke sende din anmodning. Prøv igen.",

    "lang.label": "Sprog",
  },
  es: {
    "nav.how": "Cómo funciona",
    "nav.industries": "Sectores",
    "nav.pricing": "Precios",
    "nav.faq": "FAQ",
    "nav.bookDemo": "Reservar demo",
    "nav.openMenu": "Abrir menú",
    "nav.closeMenu": "Cerrar menú",

    "hero.badge": "Recepcionistas de IA para negocios premium",
    "hero.title.l1": "Nunca pierdas una",
    "hero.title.l2": "llamada importante",
    "hero.title.l3": "más.",
    "hero.subtitle": "Recepcionistas de IA que contestan, califican, agendan y notifican — 24/7.",
    "hero.cta.book": "Reservar demo",
    "hero.cta.how": "Cómo funciona",

    "booking.title": "Reservar una llamada",
    "booking.subtitle": "15 minutos. Sin preparación.",
    "booking.name": "Nombre",
    "booking.company": "Empresa",
    "booking.phone": "Teléfono",
    "booking.date": "Fecha",
    "booking.time": "Hora",
    "booking.submit": "Solicitar llamada",
    "booking.sending": "Enviando…",
    "booking.done": "Listo",
    "booking.success.title": "Solicitud recibida.",
    "booking.success.body": "Llamaremos a {name} en menos de una hora hábil.",
    "booking.legal": "Al enviar aceptas nuestros",
    "booking.terms": "Términos",
    "booking.and": "y",
    "booking.privacy": "Política de Privacidad",
    "booking.error.generic": "No se pudo enviar tu solicitud. Inténtalo de nuevo.",

    "lang.label": "Idioma",
  },
} as const;

type Key = keyof (typeof dict)["en"];

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: Key, vars?: Record<string, string>) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (stored && ["en", "da", "es"].includes(stored)) setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {
      /* ignore */
    }
  };

  const t = (key: Key, vars?: Record<string, string>) => {
    let s: string = (dict[lang] as Record<string, string>)[key] ?? (dict.en as Record<string, string>)[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v);
    return s;
  };

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "da", label: "Dansk", flag: "🇩🇰" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];
