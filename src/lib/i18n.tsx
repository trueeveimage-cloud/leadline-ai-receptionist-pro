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
    "step.1.desc": "Your AI receptionist picks up every call in under a second. 24/7.",
    "step.2.desc": "It asks the right questions in your tone and filters out time-wasters.",
    "step.3.desc": "A qualified booking request lands in your inbox for confirmation.",

    "pain.eyebrow": "The problem",
    "pain.title": "Every missed call is a lost job.",
    "pain.body": "While you're working, the phone rings. Most callers don't leave a message — they just call the next business.",
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
    "faq.3.a": "It politely takes the caller's details and reason for the call, then sends you a summary right away.",
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

    "footer.tagline": "AI receptionists for service businesses. Built in Sweden, live in 7 days.",
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
    "hero.subtitle": "Leadmap svarar, kvalificerar leadet och skickar en bokningsklar sammanfattning till dig.",
    "hero.cta.book": "Boka demo",
    "hero.cta.how": "Så fungerar det",
    "hero.trust.1": "Svensktalande AI-receptionist",
    "hero.trust.2": "Live på 7 dagar",
    "hero.trust.3": "Säg upp när som helst",
    "hero.meta.1": "Byggt i Sverige",
    "hero.meta.2": "3 språk",
    "hero.meta.3": "Inga långa avtal",

    "process.eyebrow": "Så fungerar det",
    "process.demo": "Live-samtalsdemo",
    "step.1": "Svarar",
    "step.2": "Kvalificerar",
    "step.3": "Aviserar",
    "step.1.desc": "Din AI-receptionist svarar på varje samtal på under en sekund. Dygnet runt.",
    "step.2.desc": "Den ställer rätt frågor i din ton och sållar bort tidstjuvar.",
    "step.3.desc": "En kvalificerad bokningsförfrågan landar i din inkorg för bekräftelse.",

    "pain.eyebrow": "Problemet",
    "pain.title": "Varje missat samtal är ett förlorat jobb.",
    "pain.body": "Du är på ett tak, under ett handfat, mitt i en behandling — eller stängd. Telefonen ringer, och de flesta uppringare ringer bara nästa företag på listan.",
    "pain.built": "Byggt för rörmokare, takläggare, tandläkare, kliniker, bilrekonditionerare och akuta hantverkare.",

    "pricing.eyebrow": "Priser",
    "pricing.title.l1": "Två sätt att börja.",
    "pricing.title.l2": "Båda oförglömliga.",
    "pricing.bullet.1": "7-dagars pilot",
    "pricing.bullet.2": "Inga långa avtal",
    "pricing.bullet.3": "Säg upp när som helst",
    "pricing.bullet.4": "Behåll ditt nummer",
    "pricing.popular": "Populär",
    "pricing.month": "/ månad",
    "pricing.book": "Boka demo",
    "pricing.footer": "Säg upp när som helst · Live på 7 dagar",

    "pricing.pilot.name": "Pilot",
    "pricing.pilot.note": "+ 2 000 kr startavgift · 7-dagars pilot",
    "pricing.pilot.sub": "≈ kostnaden för ett missat jobb.",
    "pricing.pilot.f1": "AI-receptionist",
    "pricing.pilot.f2": "Samtalssammanfattningar",
    "pricing.pilot.f3": "Överlämning via mejl",
    "pricing.pilot.f4": "Standardröst",

    "pricing.premium.name": "Premium",
    "pricing.premium.note": "Startavgift ingår · säg upp när som helst",
    "pricing.premium.sub": "Betalar sig själv med två extra jobb.",
    "pricing.premium.f1": "Bokningsförfrågningar",
    "pricing.premium.f2": "Samtalssammanfattningar",
    "pricing.premium.f3": "Prioriterad koppling",
    "pricing.premium.f4": "Anpassad röst",
    "pricing.premium.f5": "Dedikerad onboarding",

    "test.eyebrow": "Från piloten",
    "test.title": "Vad pilotkunderna säger.",
    "test.tag": "Pilotkund",

    "faq.eyebrow": "FAQ",
    "faq.title": "Svar, innan du frågar.",
    "faq.1.q": "Låter den robotaktig?",
    "faq.1.a": "Nej. Rösten är lugn och naturlig på svenska, engelska eller spanska. De flesta uppringare märker inte att det är AI.",
    "faq.2.q": "Fungerar det med mitt nuvarande nummer?",
    "faq.2.a": "Ja. Du behåller ditt nummer. Vi sätter upp vidarekoppling så Leadmap bara svarar när du inte kan.",
    "faq.3.q": "Vad händer om AI:n inte kan svara?",
    "faq.3.a": "Den tar artigt uppringarens uppgifter och anledning, och skickar dig en sammanfattning direkt.",
    "faq.4.q": "Hur snabbt kan vi gå live?",
    "faq.4.a": "De flesta är live inom 7 dagar. Vi sköter rösten, manuset och vidarekopplingen.",
    "faq.5.q": "Bekräftar den bokningar?",
    "faq.5.a": "Den samlar in kvalificerade bokningsförfrågningar och skickar dem till dig för bekräftelse.",
    "faq.6.q": "Hur hanteras min data?",
    "faq.6.a": "Samtal och sammanfattningar lagras säkert inom EU. Du kan begära radering när som helst.",
    "faq.7.q": "Tänk om det inte är värt det?",
    "faq.7.a": "Säg upp när som helst efter första månaden — inga långa avtal, ingen uppsägningsavgift.",

    "cta.eyebrow": "Redo när du är",
    "cta.title": "Se den svara på ett samtal om ditt företag.",
    "cta.body": "En 15-minuters demo. Live på ditt nummer på 7 dagar. Säg upp när som helst.",
    "cta.book": "Boka demo",
    "cta.contact": "Kontakta oss",

    "footer.tagline": "AI-receptionister för serviceföretag. Byggt i Sverige, live på 7 dagar.",
    "footer.explore": "Utforska",
    "footer.contact": "Kontakt",
    "footer.replies": "Svar inom 1 arbetsdag",
    "footer.rights": "Alla rättigheter förbehållna",
    "footer.partners": "Samarbetar med",
    "footer.terms": "Villkor",
    "footer.privacy": "Integritet",

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

    "hero.badge": "Recepcionistas de IA para empresas de servicios",
    "hero.title.l1": "Nunca pierdas una",
    "hero.title.l2": "llamada importante",
    "hero.title.l3": "más.",
    "hero.subtitle": "Leadmap contesta, califica al cliente y te envía un resumen listo para reservar.",
    "hero.cta.book": "Reservar demo",
    "hero.cta.how": "Cómo funciona",
    "hero.trust.1": "Recepcionista de IA en sueco",
    "hero.trust.2": "Listo en 7 días",
    "hero.trust.3": "Cancela cuando quieras",
    "hero.meta.1": "Hecho en Suecia",
    "hero.meta.2": "3 idiomas",
    "hero.meta.3": "Sin contratos largos",

    "process.eyebrow": "Cómo funciona",
    "process.demo": "Demo de llamada en vivo",
    "step.1": "Contesta",
    "step.2": "Califica",
    "step.3": "Avisa",
    "step.1.desc": "Tu recepcionista de IA contesta cada llamada en menos de un segundo. 24/7.",
    "step.2.desc": "Hace las preguntas correctas en tu tono y filtra a los que hacen perder tiempo.",
    "step.3.desc": "Una solicitud de reserva calificada llega a tu correo para confirmar.",

    "pain.eyebrow": "El problema",
    "pain.title": "Cada llamada perdida es un trabajo perdido.",
    "pain.body": "Estás en un tejado, bajo un fregadero, en plena consulta — o cerrado. El teléfono no para, y la mayoría de quienes llaman simplemente marcan al siguiente negocio.",
    "pain.built": "Hecho para fontaneros, techadores, dentistas, clínicas, detallistas de coches y oficios de emergencia.",

    "pricing.eyebrow": "Precios",
    "pricing.title.l1": "Dos formas de empezar.",
    "pricing.title.l2": "Ambas inolvidables.",
    "pricing.bullet.1": "Piloto de 7 días",
    "pricing.bullet.2": "Sin contratos largos",
    "pricing.bullet.3": "Cancela cuando quieras",
    "pricing.bullet.4": "Conserva tu número",
    "pricing.popular": "Popular",
    "pricing.month": "/ mes",
    "pricing.book": "Reservar demo",
    "pricing.footer": "Cancela cuando quieras · Listo en 7 días",

    "pricing.pilot.name": "Piloto",
    "pricing.pilot.note": "+ 2.000 kr de alta · piloto de 7 días",
    "pricing.pilot.sub": "≈ el coste de un trabajo perdido.",
    "pricing.pilot.f1": "Recepcionista de IA",
    "pricing.pilot.f2": "Resúmenes de llamadas",
    "pricing.pilot.f3": "Traspaso por email",
    "pricing.pilot.f4": "Voz estándar",

    "pricing.premium.name": "Premium",
    "pricing.premium.note": "Alta incluida · cancela cuando quieras",
    "pricing.premium.sub": "Se paga sola con dos trabajos extra.",
    "pricing.premium.f1": "Solicitudes de reserva",
    "pricing.premium.f2": "Resúmenes de llamadas",
    "pricing.premium.f3": "Transferencia prioritaria",
    "pricing.premium.f4": "Voz personalizada",
    "pricing.premium.f5": "Onboarding dedicado",

    "test.eyebrow": "Del piloto",
    "test.title": "Qué dicen los clientes del piloto.",
    "test.tag": "Cliente piloto",

    "faq.eyebrow": "FAQ",
    "faq.title": "Respuestas, antes de preguntar.",
    "faq.1.q": "¿Sonará robótica?",
    "faq.1.a": "No. La voz es tranquila y natural en sueco, inglés o español. La mayoría no se da cuenta de que es IA.",
    "faq.2.q": "¿Funciona con mi número actual?",
    "faq.2.a": "Sí. Conservas tu número. Configuramos el desvío para que Leadmap solo conteste cuando tú no puedas.",
    "faq.3.q": "¿Y si la IA no sabe responder?",
    "faq.3.a": "Toma los datos y el motivo de la llamada con amabilidad y te envía un resumen al instante.",
    "faq.4.q": "¿En cuánto tiempo está en marcha?",
    "faq.4.a": "La mayoría está en vivo en 7 días. Nos encargamos de la voz, el guion y el desvío.",
    "faq.5.q": "¿Confirma reservas?",
    "faq.5.a": "Recoge solicitudes de reserva calificadas y te las envía para que las confirmes.",
    "faq.6.q": "¿Cómo se gestionan mis datos?",
    "faq.6.a": "Las llamadas y resúmenes se guardan de forma segura en la UE. Puedes pedir su eliminación cuando quieras.",
    "faq.7.q": "¿Y si no vale la pena?",
    "faq.7.a": "Cancela cuando quieras tras el primer mes — sin contratos largos, sin penalización.",

    "cta.eyebrow": "Cuando estés listo",
    "cta.title": "Mira cómo contesta una llamada de tu negocio.",
    "cta.body": "Una demo de 15 minutos. En vivo en tu número en 7 días. Cancela cuando quieras.",
    "cta.book": "Reservar demo",
    "cta.contact": "Contáctanos",

    "footer.tagline": "Recepcionistas de IA para empresas de servicios. Hecho en Suecia, listo en 7 días.",
    "footer.explore": "Explorar",
    "footer.contact": "Contacto",
    "footer.replies": "Respuesta en 1 día hábil",
    "footer.rights": "Todos los derechos reservados",
    "footer.partners": "Colabora con",
    "footer.terms": "Términos y Condiciones",
    "footer.privacy": "Privacidad",

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
