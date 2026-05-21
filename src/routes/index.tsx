import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Stats, Testimonials } from "@/components/site/SocialProof";
import { Problem } from "@/components/site/Problem";
import { Solution } from "@/components/site/Solution";
import { Process } from "@/components/site/Process";
import { Industries } from "@/components/site/Industries";
import { Demo } from "@/components/site/Demo";
import { Pricing } from "@/components/site/Pricing";
import { FinalCTA, Footer } from "@/components/site/Footer";
import { FAQ } from "@/components/site/FAQ";
import { DialogsProvider } from "@/components/site/DialogsProvider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Leadline AI — Never miss a high-value call again" },
      {
        name: "description",
        content:
          "AI receptionists that answer, qualify, book and notify — 24/7. Built for premium service businesses.",
      },
      { property: "og:title", content: "Leadline AI — AI receptionists for high-value businesses" },
      {
        property: "og:description",
        content: "Answers. Books. Sends the summary. Live in 7 days.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <DialogsProvider>
      <div className="min-h-screen bg-background text-foreground pb-24 md:pb-0">
        <Nav />
        <main>
          <Hero />
          <Stats />
          <Problem />
          <Solution />
          <Process />
          <Industries />
          <Demo />
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

