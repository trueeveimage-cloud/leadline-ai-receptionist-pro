import { createFileRoute } from "@tanstack/react-router";
import { SimpleMarketingPage } from "@/components/site/SimpleMarketingPage";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/vvs-emergency-trades")({
  head: () => ({
    meta: [
      { title: "AI Telefonist for VVS and Emergency Trades - Leadmap" },
      {
        name: "description",
        content:
          "Leadmap helps plumbers, electricians and emergency trades answer missed calls, capture urgent jobs and send clean summaries.",
      },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "AI Telefonist for VVS and Emergency Trades" },
      {
        property: "og:description",
        content: "Capture urgent service calls before customers call the next business.",
      },
      { property: "og:url", content: "https://www.leadmap.se/vvs-emergency-trades" },
    ],
    links: [{ rel: "canonical", href: "https://www.leadmap.se/vvs-emergency-trades" }],
  }),
  component: EmergencyTradesPage,
});

const copy = {
  en: {
    eyebrow: "VVS and emergency trades",
    title: "Answer the urgent call before the next company does.",
    intro:
      "Leadmap gives plumbers, electricians, roofers and emergency service teams an AI receptionist that answers fast, captures the problem and sends a clear follow-up summary.",
    cta: "Book trade demo",
    blocks: [
      {
        eyebrow: "Missed calls",
        title: "Urgency disappears quickly",
        body: "When a pipe leaks or power fails, customers keep calling until someone answers. Leadmap keeps that demand warm.",
      },
      {
        eyebrow: "Qualification",
        title: "Know the job before calling back",
        body: "The AI captures name, number, service, location, urgency and preferred callback time.",
      },
      {
        eyebrow: "Setup",
        title: "Start with missed and after-hours calls",
        body: "Keep your number and forward only the calls you want Leadmap to handle during the pilot.",
      },
    ],
  },
  sv: {
    eyebrow: "VVS och akuta hantverkare",
    title: "Svara på det akuta samtalet innan kunden ringer nästa företag.",
    intro:
      "Leadmap ger VVS, elektriker, takläggare och akuta serviceföretag en AI-telefonist som svarar snabbt, fångar problemet och skickar en tydlig sammanfattning.",
    cta: "Boka hantverkardemo",
    blocks: [
      {
        eyebrow: "Missade samtal",
        title: "Brådska försvinner snabbt",
        body: "När ett rör läcker eller elen krånglar fortsätter kunden ringa tills någon svarar. Leadmap håller kunden kvar.",
      },
      {
        eyebrow: "Kvalificering",
        title: "Förstå jobbet innan du ringer tillbaka",
        body: "AI:n fångar namn, nummer, tjänst, plats, brådska och önskad tid för återkoppling.",
      },
      {
        eyebrow: "Start",
        title: "Börja med missade samtal och efter stängning",
        body: "Behåll ditt nummer och vidarekoppla bara de samtal du vill att Leadmap ska hantera under piloten.",
      },
    ],
  },
} as const;

function EmergencyTradesPage() {
  const { lang } = useI18n();
  const c = lang === "sv" ? copy.sv : copy.en;
  return <SimpleMarketingPage eyebrow={c.eyebrow} title={c.title} intro={c.intro} blocks={[...c.blocks]} cta={c.cta} />;
}
