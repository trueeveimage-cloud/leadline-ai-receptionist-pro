import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CalendarCheck, MailCheck, PhoneIncoming, Sparkles } from "lucide-react";
import { useDialogs } from "./DialogsProvider";
import { useI18n } from "@/lib/i18n";
import { WordRotator } from "./WordRotator";
import { MagneticButton } from "./MagneticButton";
import { HeroOrbs } from "./HeroOrbs";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { openBooking, openTestAI } = useDialogs();
  const reduce = useReducedMotion();
  const { t, lang } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const lineY = useTransform(scrollYProgress, [0, 1], ["-10%", "18%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);

  const industries =
    lang === "sv"
      ? ["rörmokare.", "tandläkare.", "elektriker.", "bilrekond.", "takläggare."]
      : lang === "es"
        ? ["fontaneros.", "dentistas.", "electricistas.", "talleres.", "techadores."]
        : ["plumbers.", "dentists.", "electricians.", "detailers.", "roofers."];

  const liveLabel =
    lang === "sv" ? "Live · just nu" : lang === "es" ? "En vivo · ahora" : "Live · right now";
  const ringingLabel =
    lang === "sv" ? "Ett samtal kommer in..." : lang === "es" ? "Entra una llamada..." : "A call is coming in...";

  const rescue = [
    { icon: PhoneIncoming, label: t("hero.rescue.1"), meta: t("hero.rescue.1.meta") },
    { icon: Sparkles, label: t("hero.rescue.2"), meta: t("hero.rescue.2.meta") },
    { icon: CalendarCheck, label: t("hero.rescue.3"), meta: t("hero.rescue.3.meta") },
    { icon: MailCheck, label: t("hero.rescue.4"), meta: t("hero.rescue.4.meta") },
  ];

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[92svh] items-center overflow-hidden border-b border-border/60 pt-24 pb-12 md:pt-28 md:pb-20"
    >
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: lineY }}
        className="pointer-events-none absolute inset-y-0 right-[8vw] hidden w-px bg-foreground/10 md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(60%_50%_at_50%_0%,var(--hero-glow),transparent_72%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,color-mix(in_oklch,var(--foreground)_5%,transparent),transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(var(--foreground) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: lineY }}
        className="pointer-events-none absolute left-1/2 top-24 hidden h-[62vh] w-[min(26rem,30vw)] -translate-x-1/2 border-x border-foreground/[0.06] md:block"
      />

      <HeroOrbs />

      <motion.div
        style={reduce ? undefined : { y: titleY, opacity: titleOpacity }}
        className="relative mx-auto flex max-w-4xl flex-col items-center px-6 text-center"
      >
        <div className="w-full">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            className="mx-auto inline-flex items-center gap-2.5 border border-border bg-background/60 px-3 py-1.5 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            <span className="text-[10px] uppercase tracking-[0.32em] text-foreground/80">
              {liveLabel}
            </span>
            <span className="hidden h-3 w-px bg-border sm:inline-block" />
            <span className="hidden items-center gap-1.5 text-[10px] uppercase tracking-[0.28em] text-muted-foreground sm:inline-flex">
              <PhoneIncoming className="h-3 w-3" />
              {ringingLabel}
            </span>
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease, delay: 0.05 }}
            className="mx-auto mt-6 max-w-4xl text-5xl font-extralight leading-[0.98] tracking-tight md:mt-7 md:text-7xl lg:text-[5.4rem]"
          >
            <span>
              {t("hero.title.l1")}{" "}
              <span className="font-serif italic">{t("hero.title.l2")}</span>
            </span>{" "}
            <span className="block">{t("hero.title.l3")}</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.18 }}
            className="mx-auto mt-5 flex items-center justify-center gap-2 text-base font-light text-muted-foreground md:mt-6 md:text-xl"
          >
            <span className="font-serif italic text-foreground/70">{t("hero.for")}&nbsp;</span>
            <WordRotator words={industries} className="font-serif italic text-foreground" />
          </motion.p>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.24 }}
            className="mx-auto mt-5 max-w-xl text-sm font-light leading-relaxed text-muted-foreground md:text-base"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.32 }}
            className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-center"
          >
            <MagneticButton
              onClick={openBooking}
              className="relative inline-flex h-12 w-full items-center justify-center rounded-none bg-brand px-9 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-foreground shadow-[0_20px_60px_-20px_color-mix(in_oklch,var(--brand)_55%,transparent)] transition-colors hover:bg-brand/90 sm:w-auto"
            >
              <span>{t("hero.cta.book")}</span>
            </MagneticButton>
            <button
              onClick={openTestAI}
              className="group inline-flex items-center justify-center gap-2 border border-border bg-secondary px-6 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-background sm:justify-start"
            >
              <span>{t("hero.cta.test")}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease, delay: 0.36 }}
            className="mx-auto mt-4 flex w-full max-w-2xl flex-wrap items-center justify-center gap-2 text-center"
          >
            {[t("hero.trust.1"), t("hero.trust.2"), t("hero.trust.3")].map((item) => (
              <span
                key={item}
                className="border border-border/70 bg-background/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm"
              >
                {item}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.38 }}
            className="mx-auto mt-7 grid w-full max-w-3xl grid-cols-2 gap-px overflow-hidden border border-border/70 bg-border/70 text-left sm:mt-9 lg:grid-cols-4"
          >
            {rescue.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="group relative bg-background p-3 transition-colors hover:bg-card sm:p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center border border-foreground/15 transition-colors group-hover:border-foreground/45 sm:h-9 sm:w-9">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium leading-tight">{item.label}</span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2 sm:mt-3">
                    <span className="text-[10px] tabular-nums text-muted-foreground">0{index + 1}</span>
                    <span className="h-px flex-1 bg-foreground/15" />
                  </div>
                  <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px] sm:tracking-[0.2em]">
                    {item.meta}
                  </p>
                </div>
              );
            })}
          </motion.div>

          <motion.dl
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.46 }}
            className="mx-auto mt-6 grid w-full max-w-2xl grid-cols-3 gap-px bg-border/70 text-center sm:mt-8"
          >
            {[
              ["24/7", t("hero.stat.pickup")],
              [t("hero.stat.setup.value"), t("hero.stat.setup")],
              [t("hero.stat.summaries.value"), t("hero.stat.summaries")],
            ].map(([value, label]) => (
              <div key={label} className="bg-background px-2 py-4 sm:px-5">
                <dt className="text-2xl font-extralight tracking-tight">{value}</dt>
                <dd className="mt-1 break-words text-[9px] uppercase tracking-widest text-muted-foreground hyphens-auto sm:text-[10px] sm:tracking-[0.24em]">
                  {label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </motion.div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground">{t("hero.scroll")}</span>
        <motion.span
          className="h-8 w-px bg-foreground/30"
          animate={reduce ? undefined : { scaleY: [0.3, 1, 0.3], originY: 0 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
