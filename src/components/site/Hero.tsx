import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialogs } from "./DialogsProvider";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

const stats = [
  ["24/7", "pickup"],
  ["7 days", "pilot setup"],
  ["EU", "summaries"],
] as const;


export function Hero() {
  const { openBooking, openTestAI } = useDialogs();
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const lineY = useTransform(scrollYProgress, [0, 1], ["-10%", "18%"]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "7%"]);
  const gridY = useTransform(scrollYProgress, [0, 1], ["-5%", "12%"]);
  const frameY = useTransform(scrollYProgress, [0, 1], ["8%", "-14%"]);
  const scanY = useTransform(scrollYProgress, [0, 1], ["-30%", "120%"]);


  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative isolate min-h-[92svh] overflow-hidden border-b border-border/60 px-4 pt-24 pb-12 sm:px-6 md:pt-28 md:pb-16"
    >
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: lineY }}
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-foreground/10 md:block"
      />
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: gridY }}
        className="pointer-events-none absolute inset-x-4 top-20 bottom-12 -z-10 opacity-35 [mask-image:linear-gradient(to_bottom,transparent,black_16%,black_78%,transparent)] md:inset-x-12"
      >
        <div className="h-full border-x border-border/50 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:5.5rem_5.5rem]" />
      </motion.div>
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: frameY }}
        className="pointer-events-none absolute left-[8vw] top-36 -z-10 hidden h-64 w-28 rotate-[-8deg] border border-border/70 bg-card/20 md:block"
      />
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: frameY }}
        className="pointer-events-none absolute right-[9vw] bottom-20 -z-10 hidden h-72 w-36 rotate-[7deg] border border-border/60 bg-card/15 md:block"
      />
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: scanY }}
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-transparent via-foreground/[0.055] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(55%_42%_at_50%_0%,color-mix(in_oklch,var(--foreground)_12%,transparent),transparent_72%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-4 bottom-8 mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-foreground/15 to-transparent"
      />

      <motion.div
        style={reduce ? undefined : { y: heroY }}
        className="relative mx-auto flex min-h-[calc(92svh-8rem)] max-w-3xl flex-col items-center justify-center text-center"
      >
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            className="flex w-full items-center gap-3 text-[9px] uppercase tracking-[0.34em] text-muted-foreground sm:w-auto"
          >
            <span className="h-px flex-1 bg-border sm:w-12 sm:flex-none" />
            <span>{t("hero.badge")}</span>
            <span className="h-px flex-1 bg-border sm:w-12 sm:flex-none" />
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.05 }}
            className="mt-6 max-w-3xl text-[clamp(3.15rem,13vw,6.7rem)] font-extralight leading-[0.9] tracking-normal"
          >
            Never miss another{" "}
            <span className="block font-serif italic text-foreground/80 sm:inline">
              valuable lead.
            </span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.12 }}
            className="mt-7 max-w-xl text-[15px] font-light leading-7 text-muted-foreground sm:text-base md:text-lg"
          >
            Leadmap handles your missed calls instantly. It qualifies every lead,
            schedules appointments, and sends clear summaries directly to your inbox 24/7.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.2 }}
            className="mt-9 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center"
          >
            <Button
              size="lg"
              variant="brand"
              onClick={openBooking}
              className="h-12 w-full rounded-md px-8 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-[0_12px_32px_color-mix(in_oklch,var(--foreground)_12%,transparent)] transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              {t("hero.cta.book")}
            </Button>
            <button
              onClick={openTestAI}
              className="group inline-flex h-12 w-full items-center justify-center gap-3 rounded-md border border-border bg-card px-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-all hover:-translate-y-0.5 hover:border-foreground/25 sm:w-auto"
            >
              <span>Test the AI</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          <motion.dl
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.32 }}
            className="mt-12 grid w-full max-w-xl grid-cols-3 gap-px border-y border-border/80 bg-border/80 text-center"
          >
            {stats.map(([value, label]) => (
              <div key={label} className="bg-background px-2 py-4 sm:px-5">
                <dt className="text-2xl font-extralight tracking-normal sm:text-3xl">{value}</dt>
                <dd className="mt-1 text-[8px] uppercase tracking-[0.24em] text-muted-foreground sm:text-[10px]">{label}</dd>
              </div>
            ))}
          </motion.dl>
      </motion.div>
    </section>
  );
}

