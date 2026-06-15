import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, CircleHelp, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogsProvider } from "@/components/site/DialogsProvider";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { getUseCase, SITE_URL, utm } from "@/lib/marketing-pages";

export const Route = createFileRoute("/anvandningsfall/$niche")({
  head: ({ params }) => {
    const page = getUseCase(params.niche);
    const url = `${SITE_URL}/anvandningsfall/${params.niche}`;
    return {
      meta: [
        { title: page ? `${page.label}: AI-telefonist anvandningsfall | Leadmap` : "Anvandningsfall | Leadmap" },
        {
          name: "description",
          content: page
            ? `${page.label}: se ett tydligt exempel pa hur Leadmap svarar pa missade samtal, samlar kundinfo och skickar en kvalificerad forfragan.`
            : "Use cases for Leadmap AI-telefonist.",
        },
        { name: "robots", content: page ? "index,follow" : "noindex,follow" },
        { property: "og:title", content: page ? `${page.label}: AI-telefonist anvandningsfall` : "Leadmap anvandningsfall" },
        { property: "og:description", content: page?.pain ?? "Missade samtal blir tydliga handoffs." },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: page
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: page.faq.map(([q, a]) => ({
                  "@type": "Question",
                  name: q,
                  acceptedAnswer: { "@type": "Answer", text: a },
                })),
              }),
            },
          ]
        : [],
    };
  },
  component: UseCasePage,
});

function UseCasePage() {
  const { niche } = Route.useParams();
  const page = getUseCase(niche);

  if (!page) {
    return (
      <DialogsProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Nav />
          <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-6 pt-24">
            <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Sidan saknas</p>
            <h1 className="mt-4 text-4xl font-extralight">Det anvandningsfallet finns inte än.</h1>
          </main>
          <Footer />
        </div>
      </DialogsProvider>
    );
  }

  const auditHref = utm("/missade-samtal-audit", {
    utm_source: "seo",
    utm_medium: "use_case",
    utm_campaign: page.slug,
    case_study_page: page.slug,
    niche_page: page.slug,
  });

  return (
    <DialogsProvider>
      <div className="min-h-screen bg-background text-foreground">
        <ScrollProgress />
        <Nav />
        <main>
          <section className="relative overflow-hidden border-b border-border/60 pt-28 pb-16 md:pt-36 md:pb-24">
            <div className="mx-auto max-w-6xl px-6">
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
                Anvandningsfall / {page.label}
              </motion.p>
              <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-5 max-w-4xl text-4xl font-extralight leading-[1.02] tracking-normal md:text-7xl">
                Nar ett missat samtal fortfarande kan bli en bokning.
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 max-w-2xl text-base font-light leading-relaxed text-muted-foreground md:text-lg">
                {page.pain} Har ar ett exempel pa hur Leadmap hanterar forsta signalen utan att lova fake resultat eller automatiskt bekrafta bokningar.
              </motion.p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="brand" size="lg" className="rounded-none px-8 text-[11px] font-semibold uppercase tracking-[0.2em]">
                  <a href={auditHref}>Fa gratis missade-samtal audit</a>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-none px-8 text-[11px] font-semibold uppercase tracking-[0.2em]">
                  <Link to="/partners">Partnerprogram</Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[0.9fr_1.1fr]">
              <article className="border border-border bg-card p-6 md:p-8">
                <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  <ClipboardList className="h-4 w-4" />
                  Exempel
                </p>
                <h2 className="mt-5 text-3xl font-extralight">Scenario</h2>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">{page.scenario}</p>
                <h3 className="mt-8 text-xl font-light">Leadmap svarar</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{page.response}</p>
              </article>
              <div className="grid gap-px bg-border/70 sm:grid-cols-2">
                {page.collects.map((item) => (
                  <div key={item} className="flex items-center gap-3 bg-background p-5">
                    <CheckCircle2 className="h-4 w-4 text-brand" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-y border-border/60 py-16">
            <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[0.7fr_1fr]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.34em] text-muted-foreground">Ekonomi</p>
                <h2 className="mt-4 text-3xl font-extralight md:text-5xl">{page.value}</h2>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  Pilot fran 2 900 kr/man. Setup ingar for forsta kunder och forsta manaden har ingen bindning.
                </p>
              </div>
              <div className="space-y-3">
                {page.faq.map(([q, a]) => (
                  <article key={q} className="border border-border bg-card p-5">
                    <h3 className="flex items-center gap-3 font-medium">
                      <CircleHelp className="h-4 w-4" />
                      {q}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="mx-auto max-w-3xl px-6 text-center">
              <h2 className="text-3xl font-extralight md:text-5xl">Vill du se hur det skulle lata for ditt foretag?</h2>
              <a href={auditHref} className="mt-8 inline-flex items-center gap-2 border-b border-foreground pb-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
                Fa gratis audit <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </DialogsProvider>
  );
}
