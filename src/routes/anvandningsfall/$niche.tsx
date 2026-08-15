import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  ClipboardList,
  Eye,
  FileText,
  Gauge,
  Mic,
  PhoneForwarded,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogsProvider, useDialogs } from "@/components/site/DialogsProvider";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { ConversationPreview } from "@/components/site/ConversationPreview";
import { getUseCase, SITE_URL, utm } from "@/lib/marketing-pages";

const VVS_FAQ: [string, string][] = [
  [
    "Behöver vi byta telefonnummer?",
    "Nej. Ni behåller ert nummer och vidarekopplar bara missade samtal eller samtal efter stängning.",
  ],
  [
    "Bekräftar AI:n bokningen?",
    "Nej. Under piloten skickas en kvalificerad återkopplingsförfrågan som ni själva bekräftar.",
  ],
  [
    "Vad händer om AI:n inte kan svara?",
    "Den samlar kontaktuppgifter och ärende och markerar att manuell återkoppling krävs.",
  ],
  [
    "Hur snabbt kan vi komma igång?",
    "En kontrollerad pilot kan normalt vara igång inom sju dagar efter att manus och överlämning har godkänts.",
  ],
  [
    "Vad händer om vi inte godkänner testflödet?",
    "Då kopplas ingen kundtrafik på. Piloten startar först när ni skriftligen har godkänt röst, manus, fallback-regler och överlämning.",
  ],
];

export const Route = createFileRoute("/anvandningsfall/$niche")({
  head: ({ params }) => {
    const page = getUseCase(params.niche);
    const url = `${SITE_URL}/anvandningsfall/${params.niche}`;
    const isVvs = params.niche === "vvs";
    return {
      meta: [
        {
          title: isVvs
            ? "AI-telefonist för VVS | Leadmap"
            : page
              ? `${page.label}: användningsfall | Leadmap`
              : "Användningsfall | Leadmap",
        },
        {
          name: "description",
          content: isVvs
            ? "Leadmap svarar när VVS-företaget är ute på jobb eller har stängt, kvalificerar kunden och skickar nästa steg direkt."
            : page
              ? `${page.label}: se ett exempel på hur Leadmap svarar på missade samtal och skickar en tydlig förfrågan.`
              : "Användningsfall för Leadmap AI-telefonist.",
        },
        { name: "robots", content: isVvs ? "index,follow" : "noindex,follow" },
        {
          property: "og:title",
          content: isVvs
            ? "Missa inte nästa VVS-jobb | Leadmap"
            : page
              ? `${page.label}: användningsfall`
              : "Leadmap användningsfall",
        },
        {
          property: "og:description",
          content: page?.pain ?? "Missade samtal blir tydliga handoffs.",
        },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts:
        isVvs && page
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: VVS_FAQ.map(([q, a]) => ({
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
            <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              Sidan saknas
            </p>
            <h1 className="mt-4 text-4xl font-extralight">Det användningsfallet finns inte än.</h1>
          </main>
          <Footer />
        </div>
      </DialogsProvider>
    );
  }

  const auditHref = utm("/missade-samtal-audit", {
    utm_source: "website",
    utm_medium: "vvs_landing",
    utm_campaign: "vvs_audit",
    case_study_page: page.slug,
    niche_page: page.slug,
    cta_variant: "vvs_landing",
  });

  if (niche === "vvs") return <VvsLandingPage auditHref={auditHref} />;

  return (
    <DialogsProvider>
      <div className="min-h-screen bg-background text-foreground">
        <ScrollProgress />
        <Nav />
        <main>
          <section className="relative overflow-hidden border-b border-border/60 pt-28 pb-16 md:pt-36 md:pb-24">
            <div className="mx-auto max-w-6xl px-6">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] uppercase tracking-[0.34em] text-muted-foreground"
              >
                Användningsfall / {page.label}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mt-5 max-w-4xl text-4xl font-extralight leading-[1.02] tracking-normal md:text-7xl"
              >
                När ett missat samtal fortfarande kan bli en förfrågan.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6 max-w-2xl text-base font-light leading-relaxed text-muted-foreground md:text-lg"
              >
                {page.pain} Här är ett tydligt exempel på hur Leadmap hanterar den första signalen
                utan att automatiskt bekräfta en bokning.
              </motion.p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  variant="brand"
                  size="lg"
                  className="rounded-none px-8 text-[11px] font-semibold uppercase tracking-[0.2em]"
                >
                  <a href={auditHref}>Få gratis samtalsaudit</a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-none px-8 text-[11px] font-semibold uppercase tracking-[0.2em]"
                >
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
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                  {page.scenario}
                </p>
                <h3 className="mt-8 text-xl font-light">Leadmap svarar</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {page.response}
                </p>
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
                <p className="text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
                  Ekonomi
                </p>
                <h2 className="mt-4 text-3xl font-extralight md:text-5xl">{page.value}</h2>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  Pilot från 2 900 kr/mån exkl. moms. Efter första månaden gäller 30 dagars
                  uppsägning.
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
              <h2 className="text-3xl font-extralight md:text-5xl">
                Vill du se hur det skulle låta för ditt företag?
              </h2>
              <a
                href={auditHref}
                className="mt-8 inline-flex items-center gap-2 border-b border-foreground pb-2 text-[11px] font-semibold uppercase tracking-[0.2em]"
              >
                Få gratis audit <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </DialogsProvider>
  );
}

function VvsLandingPage({ auditHref }: { auditHref: string }) {
  return (
    <DialogsProvider>
      <div className="min-h-screen bg-background text-foreground">
        <ScrollProgress />
        <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <span className="h-2 w-2 rounded-full bg-brand" /> Leadmap
            </a>
            <Button
              asChild
              variant="brand"
              size="sm"
              className="rounded-none px-5 text-[10px] font-semibold uppercase tracking-[0.16em]"
            >
              <a href={auditHref}>Få gratis samtalsaudit</a>
            </Button>
          </div>
        </header>

        <main>
          <section className="relative overflow-hidden border-b border-border/60 pb-20 pt-32 md:pb-28 md:pt-40">
            <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
              <div className="h-full w-full bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:44px_44px]" />
            </div>
            <div className="relative mx-auto max-w-6xl px-6 text-center">
              <p className="text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
                Svensk AI-telefonist för VVS
              </p>
              <h1 className="mx-auto mt-6 max-w-5xl text-5xl font-extralight leading-[0.96] tracking-tight md:text-8xl">
                Missa inte nästa <span className="font-serif italic">VVS-jobb.</span>
              </h1>
              <p className="mx-auto mt-7 max-w-2xl text-base font-light leading-relaxed text-muted-foreground md:text-xl">
                Leadmap svarar när ni är ute på jobb eller har stängt, kvalificerar kunden och
                skickar nästa steg direkt.
              </p>
              <div className="mt-9">
                <Button
                  asChild
                  variant="brand"
                  size="lg"
                  className="rounded-none px-9 text-[11px] font-semibold uppercase tracking-[0.2em]"
                >
                  <a href={auditHref}>Få en gratis samtalsaudit</a>
                </Button>
              </div>
              <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
                {[
                  "Behåll ert nummer",
                  "Svensktalande AI",
                  "Pilot på 7 dagar",
                  "Vi sköter uppstarten",
                  "Ni bekräftar nästa steg",
                ].map((item) => (
                  <span
                    key={item}
                    className="border border-border bg-background/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section id="samtal" className="bg-[#0a0a0a] py-20 text-[#f5f3ee] md:py-28">
            <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-[10px] uppercase tracking-[0.34em] text-white/50">
                  Tydligt märkt simulering
                </p>
                <h2 className="mt-5 text-4xl font-extralight leading-tight md:text-6xl">
                  Se samtalet från första signal till överlämning.
                </h2>
                <p className="mt-6 max-w-lg text-sm font-light leading-relaxed text-white/60">
                  Exemplet använder syntetiska uppgifter och inget ljud. Det visar hur ett akut
                  VVS-ärende kan samlas in utan att lova en bekräftad bokning.
                </p>
                <VoiceDemoButton />
              </div>
              <ConversationPreview />
            </div>
          </section>

          <section className="border-b border-border/60 py-16 md:py-24">
            <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
                  Exempel på överlämning
                </p>
                <h2 className="mt-5 text-3xl font-extralight md:text-5xl">
                  Ett underlag ni kan agera på.
                </h2>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Leadmap samlar bara den information ni har godkänt och lämnar slutlig bokning och
                  prioritering till er.
                </p>
              </div>
              <article className="border border-border bg-card p-6 md:p-8">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    Demo · syntetiska uppgifter
                  </span>
                  <FileText className="h-4 w-4" />
                </div>
                <h3 className="mt-6 text-2xl font-light">Brådskande återkoppling · vattenläcka</h3>
                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    ["Kund", "Exempelkund"],
                    ["Plats", "Solna"],
                    ["Läge", "Vattnet avstängt"],
                    ["Nästa steg", "Ring tillbaka snarast"],
                  ].map(([term, value]) => (
                    <div key={term} className="border-l border-border pl-4">
                      <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {term}
                      </dt>
                      <dd className="mt-2 text-sm">{value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </div>
          </section>

          <section className="border-b border-border/60 bg-card/35 py-16 md:py-24">
            <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
                  Pilotöversikt · exempeldata
                </p>
                <h2 className="mt-5 text-3xl font-extralight md:text-5xl">
                  Se vad som behöver hända — utan ännu ett tungt system.
                </h2>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Under piloten följer vi samtalen tillsammans: vad som kom in, vad som blev en
                  kvalificerad återkoppling, vad som kräver manuell kontroll och hur många minuter
                  som har använts. Panelen här visar strukturen, inte verkliga kundresultat.
                </p>
              </div>
              <article className="overflow-hidden border border-border bg-background">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      Leadmap · pilotkontroll
                    </p>
                    <p className="mt-1 text-sm">Exempel på operativ vy</p>
                  </div>
                  <span className="border border-border px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Syntetisk data
                  </span>
                </div>
                <div className="grid gap-px bg-border sm:grid-cols-2">
                  {[
                    [Gauge, "Samtalsvolym", "Följ minuter och toppar mot vald plan."],
                    [
                      ClipboardList,
                      "Kvalificerade ärenden",
                      "Se behov, ort, prioritet och nästa steg.",
                    ],
                    [Eye, "Manuell kontroll", "Flaggor som behöver ägarens beslut hålls synliga."],
                    [
                      FileText,
                      "Veckoscorecard",
                      "En kort sammanställning av samtal, handoffs och förbättringar.",
                    ],
                  ].map(([Icon, title, body]) => {
                    const PanelIcon = Icon as typeof Gauge;
                    return (
                      <div key={String(title)} className="bg-background p-5">
                        <PanelIcon className="h-4 w-4 text-brand" />
                        <h3 className="mt-4 text-base font-medium">{String(title)}</h3>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {String(body)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </article>
            </div>
          </section>

          <section id="start" className="py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <p className="text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
                Kontrollerad start
              </p>
              <h2 className="mt-5 max-w-3xl text-3xl font-extralight md:text-5xl">
                Vi gör uppstarten. Ni godkänner reglerna.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Leadmap skriver första manusversionen, bygger kvalificeringen, sätter fallback och
                hjälper till med vidarekopplingen. Ni behöver bara ge korrekta verksamhetsuppgifter,
                godkänna testflödet och återkoppla på riktiga leads.
              </p>
              <div className="mt-10 grid gap-px bg-border/70 md:grid-cols-2 lg:grid-cols-4">
                {[
                  [
                    PhoneForwarded,
                    "1. Vi kartlägger",
                    "Tjänster, områden, öppettider och när en människa ska ta över.",
                  ],
                  [
                    Wrench,
                    "2. Vi bygger",
                    "Svenskt manus, kvalificering, sammanfattning och fallback-flöde.",
                  ],
                  [
                    ShieldCheck,
                    "3. Ni godkänner",
                    "Testa röst och överlämning. Ingen kundtrafik kopplas på före ert skriftliga ja.",
                  ],
                  [
                    Eye,
                    "4. Vi bevakar",
                    "Mjuk start med manuell kontroll och justering av flödet under pilotens sju dagar.",
                  ],
                ].map(([Icon, title, body]) => {
                  const StepIcon = Icon as typeof PhoneForwarded;
                  return (
                    <article key={String(title)} className="bg-background p-6 md:p-8">
                      <StepIcon className="h-5 w-5" />
                      <h3 className="mt-5 text-xl font-light">{String(title)}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {String(body)}
                      </p>
                    </article>
                  );
                })}
              </div>
              <div className="mt-6 grid gap-4 border border-border bg-card p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-brand">Pilotlöftet</p>
                  <h3 className="mt-3 text-2xl font-light">
                    Ingen livekoppling innan ni är trygga.
                  </h3>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    Pilotens sju dagar börjar först när ni har godkänt röst, manus, fallback-regler
                    och överlämning. Om testflödet inte klarar den överenskomna checklistan hålls
                    det pausat. Löftet gäller en säker start — inte ett garanterat antal jobb eller
                    intäkter.
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-brand" />
              </div>
            </div>
          </section>

          <section id="priser" className="border-y border-border/60 bg-card/40 py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-6">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
                  Tydliga priser
                </p>
                <h2 className="mt-5 text-3xl font-extralight md:text-5xl">
                  Börja med en avgränsad pilot.
                </h2>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                <PriceCard
                  title="Pilot"
                  price="2 900 kr/mån"
                  note="+ 2 000 kr startavgift"
                  features={[
                    "500 minuter ingår",
                    "2,50 kr/min därefter",
                    "Done-for-you uppstart",
                    "Manuell pilotkontroll i 7 dagar",
                    "Standardsröst",
                    "Överlämning via e-post",
                  ]}
                />
                <PriceCard
                  title="Premium"
                  price="4 900 kr/mån"
                  note="Startavgift ingår"
                  features={[
                    "1 500 minuter ingår",
                    "2,50 kr/min därefter",
                    "Done-for-you uppstart",
                    "Manuell pilotkontroll i 7 dagar",
                    "Anpassad röst",
                    "Prioriterad överlämning",
                  ]}
                />
              </div>
              <p className="mt-6 text-center text-xs text-muted-foreground">
                Alla priser exkl. moms. Sju dagars pilot. Efter första månaden gäller 30 dagars
                uppsägning.
              </p>
              <div className="mt-8 text-center">
                <Button
                  asChild
                  variant="brand"
                  size="lg"
                  className="rounded-none px-9 text-[11px] font-semibold uppercase tracking-[0.2em]"
                >
                  <a href={auditHref}>Få en gratis samtalsaudit</a>
                </Button>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="mx-auto max-w-3xl px-6">
              <p className="text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
                Vanliga frågor
              </p>
              <div className="mt-8 divide-y divide-border border-y border-border">
                {VVS_FAQ.map(([question, answer]) => (
                  <article key={question} className="py-6">
                    <h3 className="text-lg font-light">{question}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{answer}</p>
                  </article>
                ))}
              </div>
              <div className="mt-10 text-center">
                <a
                  href={auditHref}
                  className="inline-flex items-center gap-2 border-b border-foreground pb-2 text-[11px] font-semibold uppercase tracking-[0.2em]"
                >
                  Få en gratis samtalsaudit <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </DialogsProvider>
  );
}

function VoiceDemoButton() {
  const { openTestAI } = useDialogs();
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={openTestAI}
      className="mt-7 rounded-none border-white/30 bg-transparent text-white hover:bg-white hover:text-black"
    >
      <Mic className="h-4 w-4" /> Starta riktig svensk röstdemo
    </Button>
  );
}

function PriceCard({
  title,
  price,
  note,
  features,
}: {
  title: string;
  price: string;
  note: string;
  features: string[];
}) {
  return (
    <article className="border border-border bg-background p-6 md:p-8">
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{title}</p>
      <h3 className="mt-5 text-4xl font-extralight">{price}</h3>
      <p className="mt-2 text-xs text-muted-foreground">{note}</p>
      <ul className="mt-7 space-y-3 text-sm">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <CheckCircle2 className="h-4 w-4 text-brand" /> {feature}
          </li>
        ))}
      </ul>
    </article>
  );
}
