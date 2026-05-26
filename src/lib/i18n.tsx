import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "sv" | "es";

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
    "hero.title.l2": "high-value lead",
    "hero.title.l3": "again.",
    "hero.subtitle": "Leadmap AI answers calls, collects customer details, and sends qualified booking requests straight to you.",
    "hero.cta.book": "Book demo",
    "hero.cta.how": "How it works",

    "step.1": "Answer",
    "step.2": "Qualify",
    "step.3": "Book",
    "step.1.desc": "Your AI receptionist picks up every incoming call in under one second — 24/7, no voicemail, no missed revenue.",
    "step.2.desc": "It asks the right questions in your tone, qualifies the lead against your services and pricing, and filters out time-wasters.",
    "step.3.desc": "Qualified callers are booked straight into your calendar, with a full transcript and summary sent to your inbox.",

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
  sv: {
    "nav.how": "Så fungerar det",
    "nav.industries": "Branscher",
    "nav.pricing": "Priser",
    "nav.faq": "FAQ",
    "nav.bookDemo": "Boka demo",
    "nav.openMenu": "Öppna meny",
    "nav.closeMenu": "Stäng meny",

    "hero.badge": "AI-receptionister för premiumföretag",
    "hero.title.l1": "Missa aldrig ett",
    "hero.title.l2": "viktigt samtal",
    "hero.title.l3": "igen.",
    "hero.subtitle": "Svarar. Kvalificerar. Bokar. 24/7.",
    "hero.cta.book": "Boka demo",
    "hero.cta.how": "Så fungerar det",

    "step.1": "Svarar",
    "step.2": "Kvalificerar",
    "step.3": "Bokar",
    "step.1.desc": "Din AI-receptionist svarar på varje samtal på under en sekund — dygnet runt, ingen röstbrevlåda, inga missade intäkter.",
    "step.2.desc": "Den ställer rätt frågor i din ton, kvalificerar leadet mot dina tjänster och priser, och sållar bort tidstjuvar.",
    "step.3.desc": "Kvalificerade kunder bokas direkt i din kalender, med full transkription och sammanfattning till din inkorg.",

    "booking.title": "Boka ett uppstartsmöte",
    "booking.subtitle": "15 minuter. Ingen förberedelse.",
    "booking.name": "Namn",
    "booking.company": "Företag",
    "booking.phone": "Telefon",
    "booking.date": "Datum",
    "booking.time": "Tid",
    "booking.submit": "Begär samtal",
    "booking.sending": "Skickar…",
    "booking.done": "Klar",
    "booking.success.title": "Förfrågan mottagen.",
    "booking.success.body": "Vi ringer {name} inom en arbetstimme.",
    "booking.legal": "Genom att skicka godkänner du våra",
    "booking.terms": "Villkor",
    "booking.and": "och",
    "booking.privacy": "Integritetspolicy",
    "booking.error.generic": "Kunde inte skicka din förfrågan. Försök igen.",

    "lang.label": "Språk",
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
    "hero.subtitle": "Contesta. Califica. Agenda. 24/7.",
    "hero.cta.book": "Reservar demo",
    "hero.cta.how": "Cómo funciona",

    "step.1": "Contesta",
    "step.2": "Califica",
    "step.3": "Agenda",
    "step.1.desc": "Tu recepcionista de IA contesta cada llamada en menos de un segundo — 24/7, sin buzón, sin ingresos perdidos.",
    "step.2.desc": "Hace las preguntas correctas en tu tono, califica al cliente según tus servicios y precios, y filtra a quienes hacen perder el tiempo.",
    "step.3.desc": "Los clientes calificados se agendan directo en tu calendario, con transcripción completa y resumen en tu correo.",

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
    if (stored && ["en", "sv", "es"].includes(stored)) setLangState(stored);
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

export const LANGS: { code: Lang; label: string; country: string }[] = [
  { code: "en", label: "English", country: "gb" },
  { code: "sv", label: "Svenska", country: "se" },
  { code: "es", label: "Español", country: "es" },
];
