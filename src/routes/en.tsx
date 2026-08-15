import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/site/HomePage";
import { SITE_URL } from "@/lib/site-config";

export const Route = createFileRoute("/en")({
  head: () => ({
    meta: [
      { title: "AI receptionist for missed service calls | Leadmap" },
      {
        name: "description",
        content:
          "Leadmap answers missed calls, qualifies the caller and sends the next step while your service team is busy or closed.",
      },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "Never miss the next valuable service call | Leadmap" },
      {
        property: "og:description",
        content: "An AI receptionist that answers, qualifies and sends a clear handoff.",
      },
      { property: "og:url", content: `${SITE_URL}/en` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/en` },
      { rel: "alternate", hrefLang: "sv-SE", href: `${SITE_URL}/` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_URL}/en` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}/` },
    ],
  }),
  component: HomePage,
});
