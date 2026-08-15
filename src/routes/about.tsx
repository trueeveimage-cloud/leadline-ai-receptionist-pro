import { createFileRoute } from "@tanstack/react-router";
import { SimpleMarketingPage } from "@/components/site/SimpleMarketingPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Om Leadmap | AI-telefonist för VVS" },
      {
        name: "description",
        content:
          "Leadmap hjälper VVS-företag att svara på missade samtal, samla rätt uppgifter och skapa tydlig återkoppling.",
      },
      { property: "og:title", content: "Om Leadmap" },
      {
        property: "og:description",
        content: "Varför Leadmap finns och hur en kontrollerad pilot fungerar.",
      },
      { property: "og:url", content: "https://www.leadmap.se/about" },
      { name: "twitter:title", content: "Om Leadmap" },
      {
        name: "twitter:description",
        content: "Varför Leadmap finns och hur en kontrollerad pilot fungerar.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.leadmap.se/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SimpleMarketingPage
      eyebrow="Om Leadmap"
      title="Byggt för VVS-företag där ett missat samtal kan vara ett tappat jobb."
      intro="Leadmap är för team som ofta är ute på jobb men fortfarande behöver fånga seriösa kundförfrågningar."
      blocks={[
        {
          eyebrow: "Fokus",
          title: "VVS först",
          body: "Den första kampanjen och piloten är avgränsad till svenska VVS-företag.",
        },
        {
          eyebrow: "Princip",
          title: "Tydligt före komplicerat",
          body: "Tjänsten byggs kring tydliga samtal, användbara sammanfattningar och manuell bekräftelse.",
        },
        {
          eyebrow: "Integritet",
          title: "Kontrollerad hantering",
          body: "Samtalsinnehåll och kunduppgifter hanteras med tydliga instruktioner, lagringstider och GDPR-anpassade processer.",
        },
      ]}
    />
  );
}
