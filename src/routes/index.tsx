import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { BuyerSafety } from "@/components/site/BuyerSafety";
import { Process } from "@/components/site/Process";
import { Pricing } from "@/components/site/Pricing";
import { FAQ } from "@/components/site/FAQ";
import { FinalCTA, Footer } from "@/components/site/Footer";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { DialogsProvider } from "@/components/site/DialogsProvider";
import { Button } from "@/components/ui/button";
import {
  CallerEngagement,
  FounderTrust,
  MissedCallEconomics,
  SampleCallProof,
} from "@/components/site/ConversionSections";
import { StickyDemoNudge } from "@/components/site/StickyDemoNudge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Leadmap - AI Receptionist for Missed Calls and Lead Capture" },
      {
        name: "description",
        content:
          "Leadmap is an AI phone assistant for Swedish service businesses. It answers missed calls, captures customer details and sends qualified booking requests.",
      },
      {
        name: "keywords",
        content:
          "AI receptionist, missed call answering, lead generation, lead discovery, business lead mapping, email outreach, service business calls",
      },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "Leadmap - Missed calls become booking requests" },
      {
        property: "og:description",
        content:
          "When you are busy or closed, Leadmap answers, qualifies the caller and sends a clear booking request.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.leadmap.se/" },
      { property: "og:site_name", content: "Leadmap" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Leadmap - AI Receptionist for Missed Calls" },
      {
        name: "twitter:description",
        content: "AI call answering and lead capture for phone-first service businesses.",
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
              description:
                "AI receptionist, missed call answering, lead qualification and lead capture for service businesses.",
            },
            {
              "@type": "Service",
              name: "Leadmap phone assistant",
              provider: { "@type": "Organization", name: "Leadmap" },
              areaServed: ["SE"],
              serviceType: "AI phone assistant and missed-call capture",
              description:
                "AI call answering, customer detail capture and qualified booking request summaries for Swedish service businesses.",
            },
            {
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Does it confirm bookings automatically?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Leadmap sends qualified booking requests. You always confirm the customer yourself.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do we need to change phone system?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No, we help set it up with your current number or a forwarding number.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Who is this best for?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Businesses that get valuable calls but are often busy, driving, with customers, or closed.",
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
          <AuditStrip />
          <Process />
          <CallerEngagement />
          <SampleCallProof />
          <MissedCallEconomics />
          <BuyerSafety />
          <Pricing />
          <FAQ />
          <FounderTrust />
          <FinalCTA />
        </main>

        <Footer />
        <StickyDemoNudge />
      </div>
    </DialogsProvider>
  );
}

function AuditStrip() {
  const proof = [
    ["45 sek", "tar audit"],
    ["0 kr", "första kontroll"],
    ["ingen", "bindning"],
  ];

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-card/35 py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-5 px-6 lg:grid-cols-[1fr_auto_auto] lg:items-center">
        <div className="max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            Gratis missade-samtal audit
          </p>
          <h2 className="mt-2 text-2xl font-extralight tracking-normal md:text-3xl">
            Se hur Leadmap skulle svara åt ert företag innan ni bokar.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tar under 45 sekunder. Ingen bindning. Ingen spam.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-px border border-border bg-border">
          {proof.map(([value, label]) => (
            <div key={label} className="min-w-24 bg-background px-4 py-3 text-center">
              <div className="text-xl font-extralight tabular-nums">{value}</div>
              <div className="mt-1 text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                {label}
              </div>
            </div>
          ))}
        </div>
        <Button
          asChild
          variant="outline"
          className="rounded-none px-6 text-[11px] font-semibold uppercase tracking-[0.18em] lg:justify-self-end"
        >
          <a href="/missade-samtal-audit?utm_source=homepage&utm_medium=cta&utm_campaign=free_audit">
            Få gratis audit
          </a>
        </Button>
      </div>
    </section>
  );
}
