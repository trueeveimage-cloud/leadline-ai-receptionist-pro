import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  MailCheck,
  PhoneIncoming,
  Radar,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { CursorSpotlight } from "@/components/site/CursorSpotlight";
import { DialogsProvider, useDialogs } from "@/components/site/DialogsProvider";
import { AttentionSystem } from "@/components/site/AttentionSystem";
import { Industries } from "@/components/site/Industries";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Leadmap Experience - From Missed Call to Qualified Lead" },
      {
        name: "description",
        content:
          "See how Leadmap turns a missed call into a qualified customer handoff with AI answering, lead intent, summaries and follow-up.",
      },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "Leadmap Experience" },
      {
        property: "og:description",
        content: "A cinematic walkthrough of Leadmap's AI call engine and best-fit customer types.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.leadmap.se/experience" },
    ],
    links: [{ rel: "canonical", href: "https://www.leadmap.se/experience" }],
  }),
  component: ExperiencePage,
});

const ease = [0.22, 1, 0.36, 1] as const;

function ExperiencePage() {
  return (
    <DialogsProvider>
      <div className="min-h-screen bg-background text-foreground">
        <ScrollProgress />
        <CursorSpotlight />
        <Nav />
        <main>
          <ExperienceHero />
          <SignalJourney />
          <AttentionSystem />
          <IndustrySequence />
          <Industries />
          <ExperienceClose />
        </main>
        <Footer />
      </div>
    </DialogsProvider>
  );
}

function ExperienceHero() {
  const { t } = useI18n();
  const { openBooking, openTestAI } = useDialogs();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const lift = useTransform(scrollYProgress, [0, 0.28], ["0%", "-18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.22], [1, 0.45]);

  return (
    <section className="relative min-h-[92svh] overflow-hidden border-b border-border/60 pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: lift, opacity: fade }}
        className="pointer-events-none absolute left-1/2 top-24 h-[58vw] max-h-[700px] w-[58vw] max-w-[700px] -translate-x-1/2 rounded-full border border-foreground/10"
      />

      <div className="relative mx-auto grid min-h-[calc(92svh-6rem)] max-w-6xl content-center gap-12 px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <p className="text-[10px] uppercase tracking-[0.45em] text-muted-foreground">
            {t("experience.eyebrow")}
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl font-extralight leading-[0.95] tracking-normal md:text-7xl">
            {t("experience.title")}
          </h1>
          <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-muted-foreground md:text-lg">
            {t("experience.body")}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              variant="brand"
              onClick={() => openBooking()}
              className="rounded-none px-8 text-[11px] font-semibold uppercase tracking-[0.2em]"
            >
              {t("experience.book")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={openTestAI}
              className="rounded-none px-8 text-[11px] font-semibold uppercase tracking-[0.2em]"
            >
              {t("experience.test")}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 26, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.08 }}
          className="relative"
        >
          <div className="absolute -inset-5 border border-foreground/10" />
          <div className="relative border border-border bg-card p-4 shadow-[0_50px_140px_-90px_var(--foreground)]">
            <div className="flex items-center justify-between border-b border-border/70 pb-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                <Radar className="h-3.5 w-3.5" />
                {t("experience.radar")}
              </div>
              <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_26px_var(--brand)]" />
            </div>
            <div className="grid gap-px bg-border/70 md:grid-cols-2">
              {[
                ["Demo", "experience.radar.1"],
                ["Akut", "experience.radar.2"],
                ["04", "experience.radar.3"],
                ["SE", "experience.radar.4"],
              ].map(([value, label], index) => (
                <motion.div
                  key={label}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease, delay: 0.18 + index * 0.06 }}
                  className="bg-background p-6"
                >
                  <div className="text-4xl font-extralight tracking-normal">{value}</div>
                  <div className="mt-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    {t(label as Parameters<typeof t>[0])}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SignalJourney() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const steps = [
    { icon: PhoneIncoming, key: "experience.step.1", meta: "experience.step.1.meta" },
    { icon: Sparkles, key: "experience.step.2", meta: "experience.step.2.meta" },
    { icon: Target, key: "experience.step.3", meta: "experience.step.3.meta" },
    { icon: CalendarCheck, key: "experience.step.4", meta: "experience.step.4.meta" },
    { icon: MailCheck, key: "experience.step.5", meta: "experience.step.5.meta" },
  ] as const;

  return (
    <section className="relative border-b border-border/60 bg-surface/20">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[0.8fr_1.2fr] md:py-28">
        <div className="md:sticky md:top-28 md:self-start">
          <p className="text-[10px] uppercase tracking-[0.42em] text-muted-foreground">
            {t("experience.journey.eyebrow")}
          </p>
          <h2 className="mt-5 text-4xl font-extralight tracking-normal md:text-6xl">
            {t("experience.journey.title")}
          </h2>
          <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-muted-foreground">
            {t("experience.journey.body")}
          </p>
        </div>

        <div className="space-y-5">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.article
                key={step.key}
                initial={reduce ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.7, ease, delay: index * 0.04 }}
                className="group grid gap-5 border border-border bg-background p-5 transition-colors hover:border-foreground/30 md:grid-cols-[70px_1fr]"
              >
                <div className="grid h-14 w-14 place-items-center border border-foreground/15 bg-card transition-colors group-hover:border-foreground/45">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
                      0{index + 1}
                    </span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <h3 className="mt-4 text-2xl font-light tracking-normal">{t(step.key)}</h3>
                  <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-muted-foreground">
                    {t(step.meta)}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function IndustrySequence() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const tracks = [
    ["experience.track.1", "experience.track.1.meta"],
    ["experience.track.2", "experience.track.2.meta"],
    ["experience.track.3", "experience.track.3.meta"],
  ] as const;

  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-foreground text-background">
      <div className="absolute inset-0 opacity-[0.08]" aria-hidden>
        <div className="h-full w-full bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-28">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="text-[10px] uppercase tracking-[0.42em] text-background/55">
            {t("experience.focus.eyebrow")}
          </p>
          <h2 className="mt-5 max-w-2xl text-4xl font-extralight leading-[1.02] tracking-normal md:text-6xl">
            {t("experience.focus.title")}
          </h2>
        </motion.div>

        <div className="space-y-4">
          {tracks.map(([label, meta], index) => (
            <motion.div
              key={label}
              initial={reduce ? false : { opacity: 0, x: 22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.65, ease, delay: index * 0.08 }}
              className="border border-background/20 bg-background/[0.06] p-5 backdrop-blur"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Zap className="h-4 w-4 text-brand" />
                  <h3 className="text-lg font-light tracking-normal">{t(label as Parameters<typeof t>[0])}</h3>
                </div>
              </div>
              <p className="mt-3 text-sm font-light leading-relaxed text-background/62">
                {t(meta as Parameters<typeof t>[0])}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceClose() {
  const { t } = useI18n();
  const { openBooking } = useDialogs();

  return (
    <section className="border-t border-border/60 bg-background py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center border border-foreground/15 bg-card">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h2 className="mt-8 text-4xl font-extralight tracking-normal md:text-6xl">
          {t("experience.close.title")}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm font-light leading-relaxed text-muted-foreground md:text-base">
          {t("experience.close.body")}
        </p>
        <button
          onClick={() => openBooking()}
          className="group mt-10 inline-flex items-center gap-3 border-b border-foreground pb-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
        >
          {t("experience.close.cta")}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}
