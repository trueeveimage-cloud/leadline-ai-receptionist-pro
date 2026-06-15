import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, Handshake, Network, PhoneCall, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogsProvider, useDialogs } from "@/components/site/DialogsProvider";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Leadmap Partner Program - AI Receptionist Partnerships" },
      {
        name: "description",
        content:
          "Partner with Leadmap to offer AI receptionist and missed-call capture to service businesses in Sweden and Europe.",
      },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "Leadmap Partner Program" },
      {
        property: "og:description",
        content: "A focused partner program for telecoms, PBX providers, agencies, installers and consultants.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.leadmap.se/partners" },
      { name: "twitter:title", content: "Leadmap Partner Program" },
      {
        name: "twitter:description",
        content: "Help clients stop losing missed calls with Leadmap's AI receptionist.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.leadmap.se/partners" }],
  }),
  component: PartnersPage,
});

const copy = {
  en: {
    eyebrow: "Partner program",
    title: "Turn missed calls into a new client offer.",
    body: "Leadmap helps service businesses answer missed calls, qualify buyers and send clean summaries. Partners use it as a simple add-on for clients who already need more calls, bookings and follow-up.",
    primary: "Book partner call",
    secondary: "Apply to partner",
    proof: [
      { value: "7 days", label: "pilot setup" },
      { value: "24/7", label: "missed-call cover" },
      { value: "3 languages", label: "SE / EN / ES" },
      { value: "EU-based", label: "data handling" },
    ],
    fitEyebrow: "Best-fit partners",
    fitTitle: "Built for teams already close to local businesses.",
    fit: [
      ["Telecom and PBX", "Add missed-call capture to phone systems, cloud PBX and business telephony."],
      ["Agencies", "Give clients a practical conversion layer after ads, SEO and website work."],
      ["Installers and IT", "Offer a simple AI front desk alongside systems, integrations and automation."],
      ["Consultants", "Bring a high-value operational fix to owners who lose work when they are busy."],
    ],
    modelTitle: "The partnership stays simple.",
    model: [
      ["Introduce", "You bring a client where calls matter and missed calls cost money."],
      ["Pilot", "Leadmap sets up the AI receptionist, script, forwarding and summaries."],
      ["Grow", "You keep the relationship warm while Leadmap handles the call engine."],
    ],
    trustTitle: "Low-risk for the partner and the client.",
    trustBody: "Start with a controlled demo or pilot. No heavy platform migration, no long contract, and no need to replace the client's phone setup.",
    faq: [
      ["Who is this for?", "Telecoms, PBX/VoIP providers, digital agencies, installers, IT consultants and business advisors."],
      ["Do we need to build anything?", "No. The first step is partner fit, then a simple client demo or pilot."],
      ["Can partners earn from referrals?", "Yes. The exact model is agreed on the partner call based on volume and involvement."],
    ],
  },
  sv: {
    eyebrow: "Partnerprogram",
    title: "Gör missade samtal till ett nytt kunderbjudande.",
    body: "Leadmap hjälper serviceföretag att svara på missade samtal, kvalificera köpare och skicka tydliga sammanfattningar. Partners kan erbjuda det som ett enkelt tillägg till kunder som redan vill ha fler samtal, bokningar och uppföljning.",
    primary: "Boka partnersamtal",
    secondary: "Ansök som partner",
    proof: [
      { value: "7 dagar", label: "till pilotstart" },
      { value: "24/7", label: "missade samtal" },
      { value: "3 språk", label: "SE / EN / ES" },
      { value: "EU-baserat", label: "datahantering" },
    ],
    fitEyebrow: "Bäst passande partners",
    fitTitle: "Byggt för team som redan hjälper lokala företag.",
    fit: [
      ["Telekom och växel", "Lägg till missade-samtal-fångst för telefoni, molnväxel och företagsabonnemang."],
      ["Byråer", "Ge kunder ett praktiskt konverteringslager efter annonser, SEO och webbsidor."],
      ["Installatörer och IT", "Erbjud en enkel AI-frontdesk bredvid system, integrationer och automation."],
      ["Konsulter", "Ta med en konkret driftförbättring till ägare som tappar affärer när de är upptagna."],
    ],
    modelTitle: "Partnerskapet hålls enkelt.",
    model: [
      ["Introducera", "Du tar in en kund där samtal är viktiga och missade samtal kostar pengar."],
      ["Pilot", "Leadmap sätter upp AI-telefonist, manus, vidarekoppling och sammanfattningar."],
      ["Väx", "Du behåller relationen medan Leadmap driver samtalsmotorn."],
    ],
    trustTitle: "Låg risk för både partner och kund.",
    trustBody: "Börja med en kontrollerad demo eller pilot. Ingen tung plattformsflytt, ingen lång bindningstid och inget krav på att byta kundens telefonlösning.",
    faq: [
      ["Vem passar programmet för?", "Telekom, PBX/VoIP, digitala byråer, installatörer, IT-konsulter och företagsrådgivare."],
      ["Måste vi bygga något?", "Nej. Första steget är partnerfit, sedan en enkel kunddemo eller pilot."],
      ["Kan partners tjäna på referrals?", "Ja. Exakt modell bestäms på partnersamtalet utifrån volym och hur aktivt ni vill jobba."],
    ],
  },
} as const;

function PartnersPage() {
  return (
    <DialogsProvider>
      <div className="min-h-screen bg-background text-foreground">
        <ScrollProgress />
        <Nav />
        <main>
          <PartnerHero />
          <BestFit />
          <PartnerModel />
          <TrustAndFaq />
        </main>
        <Footer />
      </div>
    </DialogsProvider>
  );
}

function usePartnerCopy() {
  const { lang } = useI18n();
  return lang === "sv" ? copy.sv : copy.en;
}

function PartnerHero() {
  const c = usePartnerCopy();
  const { openBooking, openContact } = useDialogs();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.35], ["0%", "-16%"]);

  return (
    <section className="relative overflow-hidden border-b border-border/60 pt-28 md:pt-36">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div className="h-full w-full bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:46px_46px]" />
      </div>
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y }}
        className="pointer-events-none absolute right-[-20%] top-16 h-[520px] w-[520px] rounded-full border border-foreground/10"
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-20 md:grid-cols-[1fr_0.82fr] md:items-center md:pb-28">
        <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
          <p className="text-[10px] uppercase tracking-[0.42em] text-muted-foreground">{c.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-extralight leading-[0.98] tracking-normal md:text-7xl">{c.title}</h1>
          <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-muted-foreground md:text-lg">{c.body}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button variant="brand" size="lg" onClick={openBooking} className="rounded-none px-8 text-[11px] font-semibold uppercase tracking-[0.2em]">
              {c.primary}
            </Button>
            <Button variant="outline" size="lg" onClick={openContact} className="rounded-none px-8 text-[11px] font-semibold uppercase tracking-[0.2em]">
              {c.secondary}
            </Button>
          </div>
        </motion.div>

        <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08 }}>
          <div className="border border-border bg-card p-4 shadow-[0_40px_120px_-88px_var(--foreground)]">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                <Network className="h-3.5 w-3.5" /> Leadmap channel
              </span>
              <span className="h-2 w-2 rounded-full bg-brand" />
            </div>
            <div className="grid gap-px bg-border md:grid-cols-2">
              {c.proof.map((item) => (
                <div key={item.label} className="bg-background p-5">
                  <div className="text-lg font-medium tracking-tight text-foreground md:text-xl">{item.value}</div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BestFit() {
  const c = usePartnerCopy();
  return (
    <section className="border-b border-border/60 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">{c.fitEyebrow}</p>
          <h2 className="mt-5 text-4xl font-extralight tracking-normal md:text-6xl">{c.fitTitle}</h2>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-4">
          {c.fit.map(([title, body], index) => {
            const Icon = [PhoneCall, Sparkles, BriefcaseBusiness, Handshake][index];
            return (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: index * 0.05 }}
                className="bg-background p-6"
              >
                <div className="grid h-11 w-11 place-items-center border border-foreground/20">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="mt-8 text-xl font-light tracking-normal">{title}</h3>
                <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">{body}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PartnerModel() {
  const c = usePartnerCopy();
  return (
    <section className="border-b border-border/60 bg-foreground py-16 text-background md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="max-w-2xl text-4xl font-extralight tracking-normal md:text-6xl">{c.modelTitle}</h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {c.model.map(([title, body], index) => (
            <div key={title} className="border border-background/15 bg-background/[0.06] p-6">
              <div className="text-[10px] uppercase tracking-[0.34em] text-background/55">0{index + 1}</div>
              <h3 className="mt-6 text-2xl font-light">{title}</h3>
              <p className="mt-4 text-sm font-light leading-relaxed text-background/65">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustAndFaq() {
  const c = usePartnerCopy();
  const { openBooking, openContact } = useDialogs();
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[0.85fr_1.15fr]">
        <div className="md:sticky md:top-28 md:self-start">
          <div className="grid h-12 w-12 place-items-center border border-foreground/15 bg-card">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="mt-7 text-4xl font-extralight tracking-normal md:text-5xl">{c.trustTitle}</h2>
          <p className="mt-5 text-sm font-light leading-relaxed text-muted-foreground">{c.trustBody}</p>
          <div className="mt-8 flex flex-col gap-3">
            <Button variant="brand" onClick={openBooking} className="rounded-none text-[11px] font-semibold uppercase tracking-[0.2em]">
              {c.primary}
            </Button>
            <button onClick={openContact} className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
              {c.secondary} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {c.faq.map(([q, a]) => (
            <article key={q} className="border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-brand" />
                <div>
                  <h3 className="text-lg font-light">{q}</h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">{a}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
