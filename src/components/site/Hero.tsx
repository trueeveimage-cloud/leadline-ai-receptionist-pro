import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CalendarCheck, Mail, PhoneIncoming, ShieldCheck } from "lucide-react";
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
  const visualY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const lineY = useTransform(scrollYProgress, [0, 1], ["-10%", "18%"]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative min-h-[86svh] overflow-hidden border-b border-border/60 pt-24 pb-12 md:pt-32 md:pb-16"
    >
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: lineY }}
        className="pointer-events-none absolute inset-y-0 right-[8vw] hidden w-px bg-foreground/10 md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,255,255,0.08),transparent_70%)]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.85fr)] md:items-center">
        <div className="max-w-3xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground"
          >
            {t("hero.badge")} for service businesses
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.05 }}
            className="mt-5 max-w-4xl text-5xl font-extralight leading-[0.98] tracking-tight md:text-7xl"
          >
            AI receptionist for missed calls.
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.12 }}
            className="mt-6 max-w-xl text-base font-light leading-relaxed text-muted-foreground md:text-lg"
          >
            Leadmap answers, qualifies, and summarizes customer calls when your team is busy or closed.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.2 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button
              size="lg"
              variant="brand"
              onClick={openBooking}
              className="w-full rounded-none px-8 text-[11px] font-semibold uppercase tracking-[0.2em] sm:w-auto"
            >
              {t("hero.cta.book")}
            </Button>
            <button
              onClick={openTestAI}
              className="group inline-flex justify-center gap-3 px-1 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground transition-opacity hover:opacity-70 sm:justify-start"
            >
              <span>Test the AI</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          <motion.dl
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.32 }}
            className="mt-12 grid max-w-2xl grid-cols-3 gap-px bg-border/70 text-center sm:text-left"
          >
            {[
              ["24/7", "pickup"],
              ["7 days", "pilot setup"],
              ["EU", "summaries"],
            ].map(([value, label]) => (
              <div key={label} className="bg-background px-3 py-4 sm:px-5">
                <dt className="text-2xl font-extralight tracking-tight">{value}</dt>
                <dd className="mt-1 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease, delay: 0.15 }}
          style={reduce ? undefined : { y: visualY }}
          className="relative min-h-[360px] md:min-h-[540px]"
        >
          <CallFlowVisual />
        </motion.div>
      </div>
    </section>
  );
}

function CallFlowVisual() {
  const reduce = useReducedMotion();
  const points = [
    { icon: PhoneIncoming, label: "Call", text: "New customer needs help" },
    { icon: ShieldCheck, label: "Qualify", text: "Intent, urgency, details" },
    { icon: CalendarCheck, label: "Book", text: "Preferred time captured" },
    { icon: Mail, label: "Summary", text: "Owner gets the next step" },
  ];

  return (
    <div className="absolute inset-0">
      <motion.div
        aria-hidden
        animate={reduce ? undefined : { backgroundPositionY: ["0px", "80px"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: "linear-gradient(var(--foreground) 1px, transparent 1px)",
          backgroundSize: "100% 80px",
        }}
      />
      <div className="absolute left-1/2 top-4 h-[calc(100%-2rem)] w-px -translate-x-1/2 bg-foreground/14" />

      <div className="relative mx-auto flex h-full max-w-sm flex-col justify-between py-8">
        {points.map((point, index) => {
          const Icon = point.icon;
          return (
            <motion.div
              key={point.label}
              initial={reduce ? false : { opacity: 0, x: index % 2 ? 18 : -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease, delay: index * 0.08 }}
              className={`relative flex ${index % 2 ? "justify-end" : "justify-start"}`}
            >
              <div className="w-[78%] border border-border bg-background/88 p-4 backdrop-blur">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center border border-foreground/20">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                      0{index + 1} / {point.label}
                    </div>
                    <div className="mt-1 text-sm font-light text-foreground">{point.text}</div>
                  </div>
                </div>
              </div>
              <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-background bg-foreground" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
