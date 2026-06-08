import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/SocialProof";
import { Process } from "@/components/site/Process";
import { Pain } from "@/components/site/Pain";
import { Industries } from "@/components/site/Industries";
import { TrustStack } from "@/components/site/TrustStack";
import { Pricing } from "@/components/site/Pricing";
import { FAQ } from "@/components/site/FAQ";
import { FinalCTA, Footer } from "@/components/site/Footer";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { CursorSpotlight } from "@/components/site/CursorSpotlight";
import { Marquee } from "@/components/site/Marquee";
import { Testimonials } from "@/components/site/Testimonials";
import { DialogsProvider } from "@/components/site/DialogsProvider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Leadmap - Never miss a valuable call again" },
      {
        name: "description",
        content:
          "AI receptionists that answer, qualify, book and notify 24/7. Built for service businesses.",
      },
      { property: "og:title", content: "Leadmap - AI receptionists for service businesses" },
      {
        property: "og:description",
        content: "Answers. Books. Sends the summary. Live in 7 days.",
      },
    ],
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
            },
            {
              "@type": "WebSite",
              name: "Leadmap",
              url: "https://www.leadmap.se",
            },
            {
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Does it confirm bookings automatically?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "In the pilot, it collects qualified booking requests and sends them to you for confirmation. Full calendar booking can be added later.",
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
        <CursorSpotlight />
        <Nav />
        <main>
          <Hero />
          <Pain />
          <Industries />
          <Process />
          <TrustStack />
          <Stats />
          <Marquee />
          <Testimonials />
          <Pricing />
          <FAQ />
          <FinalCTA />
        </main>

        <Footer />
      </div>
    </DialogsProvider>
  );
}
