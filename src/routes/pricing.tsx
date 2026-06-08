import { createFileRoute } from "@tanstack/react-router";
import { SimpleMarketingPage } from "@/components/site/SimpleMarketingPage";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Leadmap Pricing - AI Receptionist Plans" },
      {
        name: "description",
        content:
          "Simple Leadmap pricing for AI receptionist setup, call answering, lead qualification and owner summaries for service businesses.",
      },
      { property: "og:title", content: "Leadmap Pricing" },
      { property: "og:description", content: "Clear AI receptionist pricing for service businesses." },
    ],
    links: [{ rel: "canonical", href: "https://www.leadmap.se/pricing" }],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <SimpleMarketingPage
      eyebrow="Pricing"
      title="Start small. Keep every valuable call visible."
      intro="Leadmap is priced for practical pilots first, then expands when the call flow proves its value."
      blocks={[
        {
          eyebrow: "Pilot",
          title: "Fast setup",
          body: "Launch a controlled AI receptionist pilot without replacing your whole phone system.",
        },
        {
          eyebrow: "Premium",
          title: "More coverage",
          body: "Add more call handling, summaries, and qualification workflows as volume grows.",
        },
        {
          eyebrow: "Trust",
          title: "Human fallback",
          body: "Escalate important conversations when the customer needs a person instead of automation.",
        },
      ]}
    />
  );
}
