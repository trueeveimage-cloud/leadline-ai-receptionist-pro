import { createFileRoute } from "@tanstack/react-router";
import { SimpleMarketingPage } from "@/components/site/SimpleMarketingPage";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/dental-clinics")({
  head: () => ({
    meta: [
      { title: "AI Receptionist for Dental Clinics - Leadmap" },
      {
        name: "description",
        content:
          "Leadmap helps dental clinics capture missed booking calls, new patient requests and clean handoffs with an AI receptionist.",
      },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "AI Receptionist for Dental Clinics" },
      {
        property: "og:description",
        content: "Capture booking requests and new patient calls even when the front desk is busy.",
      },
      { property: "og:url", content: "https://www.leadmap.se/dental-clinics" },
    ],
    links: [{ rel: "canonical", href: "https://www.leadmap.se/dental-clinics" }],
  }),
  component: DentalClinicsPage,
});

const copy = {
  en: {
    eyebrow: "Dental clinics",
    title: "Protect new patient calls when reception is busy.",
    intro:
      "Leadmap answers missed dental calls, captures the patient request and sends a clear summary so your team can follow up without losing the booking.",
    cta: "Book clinic demo",
    blocks: [
      {
        eyebrow: "Booking capture",
        title: "Empty slots often start as missed calls",
        body: "Leadmap helps clinics catch requests while staff are with patients, on lunch or away from the desk.",
      },
      {
        eyebrow: "Patient details",
        title: "The follow-up is already organized",
        body: "The AI captures name, phone, request, urgency, preferred time and whether the caller is a new patient.",
      },
      {
        eyebrow: "Trust",
        title: "A calm first response",
        body: "Callers get a polite answer instead of silence, and your team decides the final booking step.",
      },
    ],
  },
  sv: {
    eyebrow: "Tandkliniker",
    title: "Skydda nya patientförfrågningar när receptionen är upptagen.",
    intro:
      "Leadmap svarar på missade samtal, fångar patientens ärende och skickar en tydlig sammanfattning så teamet kan följa upp utan att tappa bokningen.",
    cta: "Boka klinikdemo",
    blocks: [
      {
        eyebrow: "Bokningsfångst",
        title: "Tomma tider börjar ofta som missade samtal",
        body: "Leadmap hjälper kliniker att fånga förfrågningar när personalen är med patienter, på lunch eller borta från receptionen.",
      },
      {
        eyebrow: "Patientdetaljer",
        title: "Uppföljningen är redan organiserad",
        body: "AI:n fångar namn, telefon, ärende, brådska, önskad tid och om personen är ny patient.",
      },
      {
        eyebrow: "Förtroende",
        title: "Ett lugnt första svar",
        body: "Den som ringer får ett professionellt svar istället för tystnad, och teamet bestämmer sista bokningssteget.",
      },
    ],
  },
} as const;

function DentalClinicsPage() {
  const { lang } = useI18n();
  const c = lang === "sv" ? copy.sv : copy.en;
  return <SimpleMarketingPage eyebrow={c.eyebrow} title={c.title} intro={c.intro} blocks={[...c.blocks]} cta={c.cta} />;
}
