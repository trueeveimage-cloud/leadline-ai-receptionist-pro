import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Activity, CalendarCheck, Mail, PhoneIncoming, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialogs } from "./DialogsProvider";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { openBooking, openTestAI } = useDialogs();
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const railY = useTransform(scrollYProgress, [0, 1], ["-8%", "14%"]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative min-h-[92vh] overflow-hidden border-b border-border/60 pt-28 pb-12 md:pt-36 md:pb-16"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: railY }}
        className="absolute right-0 top-0 hidden h-full w-1/2 border-l border-border/40 md:block"
      >
        <div className="absolute left-1/3 top-0 h-full w-px bg-foreground/10" />
        <div className="absolute left-2/3 top-0 h-full w-px bg-foreground/10" />
      </motion.div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)]">
        <div className="relative z-10">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex items-center gap-3"
          >
            <span className="h-px w-8 bg-foreground/30" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium">
              01 / {t("hero.badge")}
            </span>
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.05 }}
            className="mt-6 max-w-3xl text-5xl leading-[0.95] md:text-7xl font-light tracking-tight"
          >
            {t("hero.title.l1")}
            <br />
            <span className="italic font-extralight text-foreground/40">
              {t("hero.title.l2")}
            </span>{" "}
            {t("hero.title.l3")}
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
            className="mt-8 max-w-lg text-base md:text-lg font-light text-muted-foreground leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.25 }}
            className="mt-10 flex flex-wrap items-center gap-8"
          >
            <Button
              size="lg"
              variant="brand"
              onClick={openBooking}
              className="rounded-none uppercase tracking-[0.2em] text-[11px] font-semibold px-8"
            >
              {t("hero.cta.book")}
            </Button>
            <button
              onClick={openTestAI}
              className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] font-medium text-foreground hover:text-foreground transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>
              <span>Test the AI</span>
            </button>
            <a
              href="#how"
              className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{t("hero.cta.how")}</span>
              <span className="h-px w-5 bg-foreground/20 group-hover:w-8 group-hover:bg-foreground transition-all duration-500" />
            </a>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.45 }}
            className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/80"
          >
            <span>{t("hero.meta.1")}</span>
            <span className="opacity-30">/</span>
            <span>{t("hero.meta.2")}</span>
            <span className="opacity-30">/</span>
            <span>{t("hero.meta.3")}</span>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.55 }}
            className="mt-8 grid max-w-xl grid-cols-1 gap-px border border-border/70 bg-border/70 sm:grid-cols-3"
          >
            {[
              { label: "Keep your number", value: "No phone-system swap" },
              { label: "Human fallback", value: "Only when needed" },
              { label: "EU handling", value: "Calls and summaries" },
            ].map((item) => (
              <div key={item.label} className="bg-background px-4 py-3">
                <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  {item.label}
                </div>
                <div className="mt-1 text-sm font-light text-foreground/90">
                  {item.value}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.18 }}
          style={reduce ? undefined : { y: visualY }}
          className="relative z-0 min-h-[520px] md:min-h-[620px]"
        >
          <HeroSignalSystem />
        </motion.div>
      </div>
    </section>
  );
}

function HeroSignalSystem() {
  const reduce = useReducedMotion();
  const lanes = [
    { icon: PhoneIncoming, label: "Incoming call", value: "Dental emergency", y: "top-[14%]", x: "left-[5%]" },
    { icon: Activity, label: "Intent detected", value: "High value booking", y: "top-[38%]", x: "right-[2%]" },
    { icon: CalendarCheck, label: "Request captured", value: "Tue 10:30", y: "bottom-[26%]", x: "left-[0%]" },
    { icon: Mail, label: "Summary sent", value: "Owner notified", y: "bottom-[6%]", x: "right-[10%]" },
  ];

  return (
    <div className="absolute inset-0">
      <motion.div
        aria-hidden
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/15 md:h-[540px] md:w-[540px]"
      />
      <motion.div
        aria-hidden
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 52, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-foreground/20 md:h-[410px] md:w-[410px]"
      />

      <div className="absolute left-1/2 top-1/2 grid h-48 w-48 -translate-x-1/2 -translate-y-1/2 place-items-center border border-foreground/25 bg-background/80 backdrop-blur md:h-60 md:w-60">
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-foreground text-background">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="mt-5 text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
            Leadmap core
          </div>
          <div className="mt-2 text-2xl font-extralight tracking-tight md:text-3xl">
            Answered
          </div>
          <div className="mt-1 text-xs text-muted-foreground">0.4s pickup simulation</div>
        </div>
      </div>

      {lanes.map((lane, index) => {
        const Icon = lane.icon;
        return (
          <motion.div
            key={lane.label}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: [0, -8, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: 0.45 + index * 0.12 },
              y: { duration: 4 + index, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 },
            }}
            className={`absolute ${lane.y} ${lane.x} w-[230px] border border-border bg-background/88 p-4 backdrop-blur`}
          >
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center border border-foreground/25">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  {lane.label}
                </div>
                <div className="mt-1 text-sm font-light">{lane.value}</div>
              </div>
            </div>
          </motion.div>
        );
      })}

      <div className="absolute inset-x-8 top-1/2 h-px bg-foreground/20" />
      <div className="absolute left-1/2 inset-y-8 w-px bg-foreground/20" />
    </div>
  );
}
