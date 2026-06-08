import { createFileRoute } from "@tanstack/react-router";
import { SimpleMarketingPage } from "@/components/site/SimpleMarketingPage";

export const Route = createFileRoute("/lead-finder")({
  head: () => ({
    meta: [
      { title: "Lead Finder - Business Lead Discovery for Leadmap" },
      {
        name: "description",
        content:
          "Leadmap Lead Finder helps discover service businesses, map high-value prospects and find public business contact information for compliant outreach.",
      },
      { property: "og:title", content: "Leadmap Lead Finder" },
      {
        property: "og:description",
        content: "Business lead discovery and lead mapping for phone-first local service companies.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.leadmap.se/lead-finder" }],
  }),
  component: LeadFinderPage,
});

function LeadFinderPage() {
  return (
    <SimpleMarketingPage
      eyebrow="Lead Finder"
      title="Find the businesses that need better call coverage."
      intro="Lead Finder focuses on public business data, service density, websites, phone presence, and outreach readiness."
      blocks={[
        {
          eyebrow: "Discovery",
          title: "Country and city targeting",
          body: "Search markets by country, city, and service niche so prospecting stays focused instead of random.",
        },
        {
          eyebrow: "Mapping",
          title: "Coverage visibility",
          body: "Track which cities have already been scanned and where the next useful lead pockets are.",
        },
        {
          eyebrow: "Outreach",
          title: "Public contact enrichment",
          body: "Save validated public contact emails with source context and avoid duplicate outreach.",
        },
      ]}
      cta="See the CRM"
    />
  );
}
