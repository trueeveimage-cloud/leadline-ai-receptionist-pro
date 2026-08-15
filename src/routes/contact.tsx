import { createFileRoute } from "@tanstack/react-router";
import { SimpleMarketingPage } from "@/components/site/SimpleMarketingPage";
import { CONTACT_EMAIL } from "@/lib/site-config";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Kontakta Leadmap | AI-telefonist för VVS" },
      {
        name: "description",
        content:
          "Kontakta Leadmap för en samtalsaudit eller demo av en svensk AI-telefonist för VVS.",
      },
      { property: "og:title", content: "Kontakta Leadmap" },
      {
        property: "og:description",
        content: "Be om en samtalsaudit eller ställ en fråga om Leadmap.",
      },
      { property: "og:url", content: "https://www.leadmap.se/contact" },
      { name: "twitter:title", content: "Kontakta Leadmap" },
      {
        name: "twitter:description",
        content: "Be om en samtalsaudit eller ställ en fråga om Leadmap.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.leadmap.se/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SimpleMarketingPage
      eyebrow="Kontakt"
      title="Se hur Leadmap skulle svara på nästa VVS-samtal."
      intro="Berätta hur era samtal ser ut och vad som händer när ni inte kan svara. Vi visar ett avgränsat flöde innan ni bestämmer er."
      blocks={[
        {
          eyebrow: "Demo",
          title: "Gå igenom samtalsflödet",
          body: "Se hur AI-receptionisten svarar, ställer frågor och skickar en tydlig sammanfattning.",
        },
        {
          eyebrow: "Start",
          title: "Behåll ert nummer",
          body: "Piloten kan börja med vidarekoppling av missade samtal utan ett fullständigt byte av telefonsystem.",
        },
        {
          eyebrow: "Email",
          title: CONTACT_EMAIL,
          body: "Skicka företagsnamn, nuvarande telefonupplägg och vilket samtalsproblem ni vill lösa.",
        },
      ]}
    />
  );
}
