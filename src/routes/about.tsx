import { createFileRoute } from "@tanstack/react-router";
import { SimpleMarketingPage } from "@/components/site/SimpleMarketingPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Leadmap - AI Receptionist for Service Businesses" },
      {
        name: "description",
        content:
          "Leadmap helps local service businesses answer missed calls, qualify leads and turn phone demand into clear follow-up.",
      },
      { property: "og:title", content: "About Leadmap" },
      { property: "og:description", content: "Why Leadmap exists and who it helps." },
    ],
    links: [{ rel: "canonical", href: "https://www.leadmap.se/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SimpleMarketingPage
      eyebrow="About"
      title="Built for businesses where one missed call matters."
      intro="Leadmap is for service teams that are often away from the desk but still need every serious customer request captured."
      blocks={[
        {
          eyebrow: "Focus",
          title: "Service businesses first",
          body: "Trades, clinics, auto services, and urgent local operators are the core audience.",
        },
        {
          eyebrow: "Principle",
          title: "Simple before flashy",
          body: "The product is designed around clear calls, useful summaries, and practical follow-up.",
        },
        {
          eyebrow: "Privacy",
          title: "Careful handling",
          body: "Call content and customer information should be handled with consent, clarity, and GDPR-aware processes.",
        },
      ]}
    />
  );
}
