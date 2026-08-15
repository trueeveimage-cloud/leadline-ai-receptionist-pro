import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/site/HomePage";
import { CONTACT_EMAIL, LEGAL_ENTITY, SITE_URL } from "@/lib/site-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI-telefonist för VVS | Leadmap" },
      {
        name: "description",
        content:
          "Missa inte nästa VVS-jobb. Leadmap svarar när ni är ute på jobb eller har stängt, kvalificerar kunden och skickar nästa steg direkt.",
      },
      {
        name: "keywords",
        content:
          "AI-telefonist VVS, telefonpassning VVS, missade samtal företag, AI-receptionist Sverige",
      },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "Missa inte nästa VVS-jobb | Leadmap" },
      {
        property: "og:description",
        content: "Leadmap svarar, kvalificerar kunden och skickar nästa steg direkt.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.leadmap.se/" },
      { property: "og:site_name", content: "Leadmap" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Missa inte nästa VVS-jobb | Leadmap" },
      {
        name: "twitter:description",
        content: "Svensk AI-telefonist för VVS-företag som inte kan svara på varje samtal.",
      },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
      { rel: "alternate", hrefLang: "sv-SE", href: `${SITE_URL}/` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_URL}/en` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}/` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: LEGAL_ENTITY.name,
              alternateName: "Leadmap",
              url: SITE_URL,
              email: CONTACT_EMAIL,
            },
            {
              "@type": "WebSite",
              name: "Leadmap",
              url: "https://www.leadmap.se",
              description: "Svensk AI-telefonist för VVS-företag och missade samtal.",
            },
            {
              "@type": "Service",
              name: "Leadmap AI receptionist",
              provider: { "@type": "Organization", name: "Leadmap" },
              areaServed: "SE",
              serviceType: "AI-telefonist och samtalskvalificering för VVS",
              description:
                "Svarar på missade VVS-samtal, samlar kundens ärende och skickar en tydlig sammanfattning.",
            },
          ],
        }),
      },
    ],
  }),
  component: HomePage,
});
