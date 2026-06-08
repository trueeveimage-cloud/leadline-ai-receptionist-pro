import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CalendarCheck, MailCheck, PhoneIncoming, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialogs } from "./DialogsProvider";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

const stats = [
  ["24/7", "pickup"],
  ["7 days", "pilot setup"],
  ["EU", "summaries"],
] as const;

const flow = [
  { icon: PhoneIncoming, label: "Answers", text: "instant pickup" },
  { icon: Sparkles, label: "Qualifies", text: "lead intent" },
  { icon: CalendarCheck, label: "Schedules", text: "next step" },
  { icon: MailCheck, label: "Summarizes", text: "sent to inbox" },
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

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.42 }}
            className="mt-8 grid w-full max-w-2xl gap-2 sm:grid-cols-4"
          >
            {flow.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="group flex items-center gap-3 rounded-md border border-border/70 bg-card/70 px-3 py-3 text-left backdrop-blur-sm transition-colors hover:border-foreground/20 hover:bg-secondary"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-foreground">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-xs font-medium">{item.label}</span>
                    <span className="block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{item.text}</span>
                  </span>
                </div>
              );
            })}
          </motion.div>
      </motion.div>
    </section>
  );
}

