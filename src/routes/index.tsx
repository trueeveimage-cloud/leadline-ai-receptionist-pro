import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { BuyerSafety } from "@/components/site/BuyerSafety";
import { Stats } from "@/components/site/SocialProof";
import { Process } from "@/components/site/Process";
import { Pricing } from "@/components/site/Pricing";
import { FAQ } from "@/components/site/FAQ";
import { FinalCTA, Footer } from "@/components/site/Footer";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { DialogsProvider } from "@/components/site/DialogsProvider";
import { Marquee } from "@/components/site/Marquee";
import { TrustStack } from "@/components/site/TrustStack";
import { ExperienceBridge } from "@/components/site/ExperienceBridge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI-receptionist för VVS-företag och elektriker | Leadmap" },
      {
        name: "description",
        content:
          "Leadmap är en svensktalande AI-receptionist för VVS-företag och elektriker. Missa aldrig en värdefull kund när du är ute på jobb.",
      },
      {
        name: "keywords",
        content:
          "AI-receptionist, VVS-företag, elektriker, missade samtal, telefonpassning, svarstjänst",
      },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "Leadmap — AI-receptionist för VVS-företag och elektriker" },
      {
        property: "og:description",
        content: "Leadmap svarar när du inte kan, kvalificerar kunden och skickar nästa steg direkt till dig.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.leadmap.se/" },
      { property: "og:site_name", content: "Leadmap" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Leadmap — Svensktalande AI-receptionist" },
      {
        name: "twitter:description",
        content: "Svensktalande AI-receptionist för VVS-företag och elektriker.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.leadmap.se/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "Leadmap",
              url: "https://www.leadmap.se",
              email: "leadmapai.se@gmail.com",
              sameAs: ["https://leadmap.se"],
            },
            {
              "@type": "WebSite",
              name: "Leadmap",
              url: "https://www.leadmap.se",
              inLanguage: "sv-SE",
              description:
                "Svensktalande AI-receptionist för VVS-företag och elektriker.",
            },
            {
              "@type": "Service",
              name: "Leadmap AI receptionist",
              provider: { "@type": "Organization", name: "Leadmap" },
              areaServed: "SE",
              serviceType: "AI-receptionist och kvalificering av inkommande samtal",
              description:
                "Leadmap svarar när du inte kan, kvalificerar kunden och skickar nästa steg direkt till dig.",
              offers: [
                {
                  "@type": "Offer",
                  name: "Pilot",
                  price: "2900",
                  priceCurrency: "SEK",
                  description: "7-dagars pilot. 500 minuter ingår. Startavgift 2 000 kr. Extra användning 2,50 kr/min.",
                },
                {
                  "@type": "Offer",
                  name: "Premium",
                  price: "4900",
                  priceCurrency: "SEK",
                  description: "1 500 minuter ingår. Startavgift ingår. Extra användning 2,50 kr/min.",
                },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Bekräftar AI:n bokningar automatiskt?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "I piloten samlar den in kvalificerade bokningsförfrågningar och skickar dem till dig för bekräftelse.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Behöver vi byta telefonsystem?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Nej. Du behåller ditt nuvarande nummer och vi hjälper till med vidarekopplingen.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Vilka företag passar Leadmap bäst för?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Svenska VVS-företag och elektriker som får värdefulla samtal medan teamet arbetar, kör eller har stängt.",
                  },
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <DialogsProvider>
      <div className="min-h-screen bg-background text-foreground">
        <ScrollProgress />
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <AuditStrip />
          <Process />
          <ExperienceBridge />
          <Stats />
          <TrustStack />
          <BuyerSafety />
          <Pricing />
          <FAQ />
          <FinalCTA />
        </main>

        <Footer />
      </div>
    </DialogsProvider>
  );
}

function AuditStrip() {
  const { t } = useI18n();
  return (
    <section className="border-y border-border/60 bg-card/35 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">{t("audit.eyebrow")}</p>
          <h2 className="mt-2 text-2xl font-extralight tracking-normal md:text-3xl">
            {t("audit.title")}
          </h2>
        </div>
        <Button asChild variant="outline" className="rounded-none px-6 text-[11px] font-semibold uppercase tracking-[0.18em]">
          <a href="/missade-samtal-audit?utm_source=homepage&utm_medium=cta&utm_campaign=free_audit">
            {t("audit.cta")}
          </a>
        </Button>
      </div>
    </section>
  );
}
