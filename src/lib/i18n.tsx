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

    "hero.badge": "AI receptionists for service businesses",
    "hero.title.l1": "Never miss a",
    "hero.title.l2": "valuable lead",
    "hero.title.l3": "again.",
    "hero.subtitle": "We answer. We qualify. You get the booking.",
    "hero.cta.book": "Book demo",
    "hero.cta.how": "How it works",
    "hero.trust.1": "Swedish-speaking AI receptionist",
    "hero.trust.2": "Live in 7 days",
    "hero.trust.3": "Cancel anytime",
    "hero.meta.1": "Built in Sweden",
    "hero.meta.2": "3 languages",
    "hero.meta.3": "No long contract",

    "process.eyebrow": "How it works",
    "process.demo": "Live call demo",
    "step.1": "Answer",
    "step.2": "Qualify",
    "step.3": "Notify",
    "step.1.desc": "Answers every call instantly. 24/7.",
    "step.2.desc": "Asks the right questions and filters out time-wasters.",
    "step.3.desc": "Qualified booking requests land straight in your inbox.",

    "pain.eyebrow": "The problem",
    "pain.title": "Every missed call is a lost job.",
    "pain.body": "If you don't answer, they call your competitor. Stop losing jobs to missed calls.",
    "pain.built": "For plumbers, roofers, dentists, detailers and emergency trades.",

    "pricing.eyebrow": "Pricing",
    "pricing.title.l1": "Two ways to begin.",
    "pricing.title.l2": "Both unforgettable.",
    "pricing.bullet.1": "7-day pilot",
    "pricing.bullet.2": "No long contract",
    "pricing.bullet.3": "Cancel anytime",
    "pricing.bullet.4": "Keep your number",
    "pricing.popular": "Popular",
    "pricing.month": "/ month",
    "pricing.book": "Book demo",
    "pricing.footer": "Cancel anytime · Live in 7 days",

    "pricing.pilot.name": "Pilot",
    "pricing.pilot.note": "+ 2,000 kr setup · 7-day pilot",
    "pricing.pilot.sub": "≈ the cost of one missed job.",
    "pricing.pilot.f1": "AI receptionist",
    "pricing.pilot.f2": "Call summaries",
    "pricing.pilot.f3": "Email handoff",
    "pricing.pilot.f4": "Standard voice",

    "pricing.premium.name": "Premium",
    "pricing.premium.note": "Setup included · cancel anytime",
    "pricing.premium.sub": "Pays for itself with two extra jobs.",
    "pricing.premium.f1": "Booking requests",
    "pricing.premium.f2": "Call summaries",
    "pricing.premium.f3": "Priority transfer",
    "pricing.premium.f4": "Custom voice",
    "pricing.premium.f5": "Dedicated onboarding",

    "test.eyebrow": "From the pilot",
    "test.title": "What pilot customers are saying.",
    "test.tag": "Pilot user",

    "faq.eyebrow": "FAQ",
    "faq.title": "Answers, before you ask.",
    "faq.1.q": "Will it sound robotic?",
    "faq.1.a": "No. The voice is calm and natural in Swedish, English or Spanish. Most callers don't realize it's AI.",
    "faq.2.q": "Does it work with my current number?",
    "faq.2.a": "Yes. You keep your number. We set up forwarding so Leadmap only answers when you can't.",
    "faq.3.q": "What if the AI can't answer?",
    "faq.3.a": "It takes their details and reason for the call, then sends you an instant summary.",
    "faq.4.q": "How fast can we go live?",
    "faq.4.a": "Most setups go live within 7 days. We handle voice training, script and forwarding.",
    "faq.5.q": "Does it confirm bookings?",
    "faq.5.a": "It collects qualified booking requests and sends them to you for confirmation.",
    "faq.6.q": "How is my data handled?",
    "faq.6.a": "Calls and summaries are stored securely in the EU. You can request deletion at any time.",
    "faq.7.q": "What if it's not worth it?",
    "faq.7.a": "Cancel anytime after the first month — no long contract, no termination fee.",

    "cta.eyebrow": "Ready when you are",
    "cta.title": "See it answer a call about your business.",
    "cta.body": "A 15-minute demo. Live on your number in 7 days. Cancel anytime.",
    "cta.book": "Book demo",
    "cta.contact": "Contact us",

    "footer.tagline": "AI receptionists. Built in Sweden. Live in 7 days.",
    "footer.explore": "Explore",
    "footer.contact": "Get in touch",
    "footer.replies": "Replies within 1 business day",
    "footer.rights": "All rights reserved",
    "footer.partners": "Partners with",
    "footer.terms": "Terms & Conditions",
    "footer.privacy": "Privacy",

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

    "hero.badge": "AI-receptionister för serviceföretag",
    "hero.title.l1": "Missa aldrig ett",
    "hero.title.l2": "viktigt samtal",
    "hero.title.l3": "igen.",
    "hero.subtitle": "Vi svarar. Vi kvalificerar. Du får bokningen.",
    "hero.cta.book": "Boka demo",
    "hero.cta.how": "Så fungerar det",
    "hero.trust.1": "Svensktalande AI-receptionist",
    "hero.trust.2": "Igång på 7 dagar",
    "hero.trust.3": "Säg upp när du vill",
    "hero.meta.1": "Byggt i Sverige",
    "hero.meta.2": "3 språk",
    "hero.meta.3": "Inga bindningstider",

    "process.eyebrow": "Så fungerar det",
    "process.demo": "Live-demo av ett samtal",
    "step.1": "Svarar",
    "step.2": "Kvalificerar",
    "step.3": "Meddelar dig",
    "step.1.desc": "Svarar på varje samtal direkt. Dygnet runt.",
    "step.2.desc": "Ställer rätt frågor och filtrerar bort tidstjuvar.",
    "step.3.desc": "Kvalificerade bokningsförfrågningar landar rakt i din inkorg.",

    "pain.eyebrow": "Problemet",
    "pain.title": "Varje missat samtal är ett förlorat jobb.",
    "pain.body": "Svarar du inte ringer de konkurrenten istället. Sluta förlora jobb på missade samtal.",
    "pain.built": "För rörmokare, takläggare, tandläkare, bilrekond och akuta hantverkare.",

    "pricing.eyebrow": "Priser",
    "pricing.title.l1": "Två sätt att börja.",
    "pricing.title.l2": "Båda oförglömliga.",
    "pricing.bullet.1": "7 dagars pilot",
    "pricing.bullet.2": "Inga bindningstider",
    "pricing.bullet.3": "Säg upp när du vill",
    "pricing.bullet.4": "Behåll ditt nummer",
    "pricing.popular": "Populärast",
    "pricing.month": "/ mån",
    "pricing.book": "Boka demo",
    "pricing.footer": "Säg upp när du vill · Igång på 7 dagar",

    "pricing.pilot.name": "Pilot",
    "pricing.pilot.note": "+ 2 000 kr i startavgift · 7 dagars pilot",
    "pricing.pilot.sub": "≈ vad ett missat jobb kostar.",
    "pricing.pilot.f1": "AI-receptionist",
    "pricing.pilot.f2": "Samtalssammanfattningar",
    "pricing.pilot.f3": "Överlämning via mejl",
    "pricing.pilot.f4": "Standardröst",

    "pricing.premium.name": "Premium",
    "pricing.premium.note": "Startavgift ingår · säg upp när du vill",
    "pricing.premium.sub": "Betalar sig själv med två extra jobb i månaden.",
    "pricing.premium.f1": "Bokningsförfrågningar",
    "pricing.premium.f2": "Samtalssammanfattningar",
    "pricing.premium.f3": "Prioriterad vidarekoppling",
    "pricing.premium.f4": "Skräddarsydd röst",
    "pricing.premium.f5": "Dedikerad onboarding",

    "test.eyebrow": "Från piloten",
    "test.title": "Vad våra pilotkunder säger.",
    "test.tag": "Pilotkund",

    "faq.eyebrow": "FAQ",
    "faq.title": "Svar, innan du hinner fråga.",
    "faq.1.q": "Låter den robotaktig?",
    "faq.1.a": "Nej. Rösten är lugn och naturlig på svenska, engelska eller spanska. De flesta märker inte ens att det är en AI.",
    "faq.2.q": "Fungerar det med mitt nuvarande nummer?",
    "faq.2.a": "Ja. Du behåller ditt nummer. Vi sätter upp vidarekoppling så Leadmap bara svarar när du själv inte hinner.",
    "faq.3.q": "Vad händer om AI:n inte kan svara?",
    "faq.3.a": "Den tar uppringarens uppgifter och ärende och skickar en sammanfattning direkt.",
    "faq.4.q": "Hur snabbt kan vi komma igång?",
    "faq.4.a": "De flesta är igång inom 7 dagar. Vi sköter rösten, manuset och vidarekopplingen åt dig.",
    "faq.5.q": "Bekräftar den bokningar?",
    "faq.5.a": "Den samlar in kvalificerade bokningsförfrågningar och skickar dem till dig för bekräftelse.",
    "faq.6.q": "Hur hanteras min data?",
    "faq.6.a": "Samtal och sammanfattningar lagras säkert inom EU. Du kan begära radering när du vill.",
    "faq.7.q": "Tänk om det inte är värt pengarna?",
    "faq.7.a": "Säg upp när du vill efter första månaden — inga bindningstider, ingen uppsägningsavgift.",

    "cta.eyebrow": "Redo när du är",
    "cta.title": "Hör hur den svarar på ett samtal till ditt företag.",
    "cta.body": "En 15-minuters demo. Igång på ditt nummer på 7 dagar. Säg upp när du vill.",
    "cta.book": "Boka demo",
    "cta.contact": "Kontakta oss",

    "footer.tagline": "AI-receptionister. Byggt i Sverige. Igång på 7 dagar.",
    "footer.explore": "Utforska",
    "footer.contact": "Kontakt",
    "footer.replies": "Svar inom en arbetsdag",
    "footer.rights": "Alla rättigheter förbehållna",
    "footer.partners": "Samarbetar med",
    "footer.terms": "Villkor",
    "footer.privacy": "Integritet",

    "booking.title": "Boka ett uppstartssamtal",
    "booking.subtitle": "15 minuter. Ingen förberedelse krävs.",
    "booking.name": "Namn",
    "booking.company": "Företag",
    "booking.phone": "Telefon",
    "booking.date": "Datum",
    "booking.time": "Tid",
    "booking.submit": "Boka samtal",
    "booking.sending": "Skickar…",
    "booking.done": "Klart",
    "booking.success.title": "Förfrågan mottagen.",
    "booking.success.body": "Vi ringer {name} inom en timme på vardagar.",
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

    "hero.badge": "Recepcionistas de IA para empresas de servicios",
    "hero.title.l1": "Nunca pierdas una",
    "hero.title.l2": "llamada importante",
    "hero.title.l3": "más.",
    "hero.subtitle": "Contestamos. Calificamos. Tú te llevas la cita.",
    "hero.cta.book": "Reservar demo",
    "hero.cta.how": "Cómo funciona",
    "hero.trust.1": "Recepcionista de IA en español",
    "hero.trust.2": "Listo en 7 días",
    "hero.trust.3": "Cancela cuando quieras",
    "hero.meta.1": "Hecho en Suecia",
    "hero.meta.2": "3 idiomas",
    "hero.meta.3": "Sin permanencia",

    "process.eyebrow": "Cómo funciona",
    "process.demo": "Demo de llamada en directo",
    "step.1": "Contesta",
    "step.2": "Califica",
    "step.3": "Te avisa",
    "step.1.desc": "Contesta cada llamada al instante. 24/7.",
    "step.2.desc": "Hace las preguntas adecuadas y filtra a quienes te hacen perder el tiempo.",
    "step.3.desc": "Solicitudes de reserva calificadas directas a tu bandeja de entrada.",

    "pain.eyebrow": "El problema",
    "pain.title": "Cada llamada perdida es un trabajo perdido.",
    "pain.body": "Si no contestas, llaman a tu competidor. Deja de perder trabajos por llamadas perdidas.",
    "pain.built": "Para fontaneros, techadores, dentistas, detallistas y oficios de urgencia.",

    "pricing.eyebrow": "Precios",
    "pricing.title.l1": "Dos formas de empezar.",
    "pricing.title.l2": "Las dos, inolvidables.",
    "pricing.bullet.1": "Piloto de 7 días",
    "pricing.bullet.2": "Sin permanencia",
    "pricing.bullet.3": "Cancela cuando quieras",
    "pricing.bullet.4": "Conserva tu número",
    "pricing.popular": "Más popular",
    "pricing.month": "/ mes",
    "pricing.book": "Reservar demo",
    "pricing.footer": "Cancela cuando quieras · Listo en 7 días",

    "pricing.pilot.name": "Piloto",
    "pricing.pilot.note": "+ 2.000 kr de alta · piloto de 7 días",
    "pricing.pilot.sub": "≈ lo que cuesta un trabajo perdido.",
    "pricing.pilot.f1": "Recepcionista de IA",
    "pricing.pilot.f2": "Resúmenes de cada llamada",
    "pricing.pilot.f3": "Traspaso por email",
    "pricing.pilot.f4": "Voz estándar",

    "pricing.premium.name": "Premium",
    "pricing.premium.note": "Alta incluida · cancela cuando quieras",
    "pricing.premium.sub": "Se amortiza con dos trabajos extra al mes.",
    "pricing.premium.f1": "Solicitudes de reserva",
    "pricing.premium.f2": "Resúmenes de cada llamada",
    "pricing.premium.f3": "Transferencia prioritaria",
    "pricing.premium.f4": "Voz personalizada",
    "pricing.premium.f5": "Onboarding dedicado",

    "test.eyebrow": "Desde el piloto",
    "test.title": "Lo que dicen nuestros clientes piloto.",
    "test.tag": "Cliente piloto",

    "faq.eyebrow": "FAQ",
    "faq.title": "Respuestas, antes de que preguntes.",
    "faq.1.q": "¿Va a sonar robótica?",
    "faq.1.a": "No. La voz es calmada y natural en español, inglés o sueco. La mayoría ni se da cuenta de que es IA.",
    "faq.2.q": "¿Funciona con mi número actual?",
    "faq.2.a": "Sí. Tú conservas tu número. Configuramos el desvío para que Leadmap solo conteste cuando tú no puedas.",
    "faq.3.q": "¿Y si la IA no sabe responder?",
    "faq.3.a": "Toma los datos y el motivo de la llamada, y te envía un resumen al instante.",
    "faq.4.q": "¿En cuánto tiempo está en marcha?",
    "faq.4.a": "Casi todos estamos en directo en 7 días. Nos encargamos de la voz, el guion y el desvío.",
    "faq.5.q": "¿Confirma las reservas?",
    "faq.5.a": "Recoge solicitudes de reserva ya calificadas y te las pasa para que las confirmes tú.",
    "faq.6.q": "¿Cómo se gestionan mis datos?",
    "faq.6.a": "Las llamadas y los resúmenes se guardan de forma segura en la UE. Puedes pedir su eliminación cuando quieras.",
    "faq.7.q": "¿Y si no me merece la pena?",
    "faq.7.a": "Cancela cuando quieras tras el primer mes — sin permanencia, sin penalización.",

    "cta.eyebrow": "Cuando quieras empezar",
    "cta.title": "Escucha cómo atiende una llamada de tu negocio.",
    "cta.body": "Una demo de 15 minutos. En directo en tu número en 7 días. Cancela cuando quieras.",
    "cta.book": "Reservar demo",
    "cta.contact": "Contáctanos",

    "footer.tagline": "Recepcionistas de IA. Hechos en Suecia. Listos en 7 días.",
    "footer.explore": "Explorar",
    "footer.contact": "Contacto",
    "footer.replies": "Respuesta en menos de un día hábil",
    "footer.rights": "Todos los derechos reservados",
    "footer.partners": "Colabora con",
    "footer.terms": "Términos y Condiciones",
    "footer.privacy": "Privacidad",

    "booking.title": "Reserva una llamada de arranque",
    "booking.subtitle": "15 minutos. Sin preparación.",
    "booking.name": "Nombre",
    "booking.company": "Empresa",
    "booking.phone": "Teléfono",
    "booking.date": "Fecha",
    "booking.time": "Hora",
    "booking.submit": "Reservar llamada",
    "booking.sending": "Enviando…",
    "booking.done": "Listo",
    "booking.success.title": "Solicitud recibida.",
    "booking.success.body": "Llamaremos a {name} en menos de una hora hábil.",
    "booking.legal": "Al enviar aceptas nuestros",
    "booking.terms": "Términos",
    "booking.and": "y",
    "booking.privacy": "Política de Privacidad",
    "booking.error.generic": "No pudimos enviar tu solicitud. Inténtalo de nuevo.",

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
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored && ["en", "sv", "es"].includes(stored)) {
      setLangState(stored);
    } else {
      const browserLang = navigator.language.slice(0, 2).toLowerCase();
      if (browserLang === "sv") setLangState("sv");
      else if (browserLang === "es") setLangState("es");
      else setLangState("en");
    }
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
