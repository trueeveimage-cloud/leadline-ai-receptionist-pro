import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Problem } from "@/components/site/Problem";
import { Solution } from "@/components/site/Solution";
import { Industries } from "@/components/site/Industries";
import { Demo } from "@/components/site/Demo";
import { Pricing } from "@/components/site/Pricing";
import { FinalCTA, Footer } from "@/components/site/Footer";

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
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Industries />
        <Demo />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
