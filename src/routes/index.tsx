import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/SocialProof";
import { Process } from "@/components/site/Process";
import { Pricing } from "@/components/site/Pricing";
import { FinalCTA, Footer } from "@/components/site/Footer";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { CursorSpotlight } from "@/components/site/CursorSpotlight";
import { Marquee } from "@/components/site/Marquee";
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
        <ScrollProgress />
        <Nav />
        <main>
          <Hero />
          <Stats />
          <Process />
          <Pricing />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </DialogsProvider>
  );
}

