import { createFileRoute } from "@tanstack/react-router";
import { SimpleMarketingPage } from "@/components/site/SimpleMarketingPage";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Leadmap Features - AI Receptionist, Call Summaries and Lead Capture" },
      {
        name: "description",
        content:
          "Explore Leadmap features for AI call answering, lead qualification, appointment requests, business lead mapping and owner summaries.",
      },
      { property: "og:title", content: "Leadmap Features" },
      {
        property: "og:description",
        content: "AI receptionist features for service businesses that cannot miss valuable calls.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.leadmap.se/features" }],
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
  return (
    <SimpleMarketingPage
      eyebrow="Features"
      title="Everything after the ring, handled."
      intro="Leadmap keeps the workflow simple: answer the call, understand the lead, and send the owner a clean next step."
      blocks={[
        {
          eyebrow: "Answering",
          title: "Always-on call pickup",
          body: "The AI receptionist answers when the business is busy, driving, with customers, or closed.",
        },
        {
          eyebrow: "Qualification",
          title: "Lead details captured",
          body: "Name, need, urgency, contact details, location, and preferred time are collected before the summary is sent.",
        },
        {
          eyebrow: "Handoff",
          title: "Owner-ready summaries",
          body: "Every useful call becomes a short summary so the team knows who to call back and why it matters.",
        },
      ]}
    />
  );
}
