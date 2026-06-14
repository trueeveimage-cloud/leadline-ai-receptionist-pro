import { createFileRoute } from "@tanstack/react-router";
import { SimpleMarketingPage } from "@/components/site/SimpleMarketingPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Leadmap - Book an AI Receptionist Demo" },
      {
        name: "description",
        content:
          "Contact Leadmap to book an AI receptionist demo for call answering, lead qualification and business lead follow-up.",
      },
      { property: "og:title", content: "Contact Leadmap" },
      { property: "og:description", content: "Book a Leadmap demo or ask a question." },
      { property: "og:url", content: "https://www.leadmap.se/contact" },
      { name: "twitter:title", content: "Contact Leadmap" },
      { name: "twitter:description", content: "Book a Leadmap demo or ask a question." },
    ],
    links: [{ rel: "canonical", href: "https://www.leadmap.se/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SimpleMarketingPage
      eyebrow="Contact"
      title="See how Leadmap would answer your next call."
      intro="Share your business type, call flow, and what happens when calls are missed. Leadmap can be scoped around that workflow."
      blocks={[
        {
          eyebrow: "Demo",
          title: "Walk through the call flow",
          body: "Review how an AI receptionist would answer, qualify, and summarize your customer calls.",
        },
        {
          eyebrow: "Setup",
          title: "Keep your number",
          body: "The pilot can usually start with forwarding instead of a full phone-system migration.",
        },
        {
          eyebrow: "Email",
          title: "leadmapai.se@gmail.com",
          body: "Send a short note with your company name, phone setup, and the call problem you want fixed.",
        },
      ]}
    />
  );
}
