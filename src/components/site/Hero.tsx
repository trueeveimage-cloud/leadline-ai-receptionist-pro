import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
  const lineY = useTransform(scrollYProgress, [0, 1], ["-10%", "18%"]);


  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative min-h-[88svh] overflow-hidden border-b border-border/60 pt-24 pb-12 md:min-h-[92svh] md:pt-32 md:pb-16"
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
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: lineY }}
        className="pointer-events-none absolute left-1/2 top-24 hidden h-[62vh] w-[min(26rem,30vw)] -translate-x-1/2 border-x border-foreground/[0.06] md:block"
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <div className="w-full">

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground"
          >
            {t("hero.badge")}
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.05 }}
            className="mx-auto mt-5 max-w-4xl text-5xl font-extralight leading-[0.98] tracking-normal md:text-7xl"
          >
            <span>
              {t("hero.title.l1")}{" "}
              <span className="font-serif italic">{t("hero.title.l2")}</span>
            </span>{" "}
            <span className="block">{t("hero.title.l3")}</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.12 }}
            className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-muted-foreground md:text-lg"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.2 }}
            className="mx-auto mt-9 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
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
              className="group inline-flex justify-center border border-border bg-secondary px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-background sm:justify-start"
            >
              <span>{t("hero.cta.test")}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          <motion.dl
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.32 }}
            className="mx-auto mt-12 grid w-full max-w-2xl grid-cols-3 gap-px bg-border/70 text-center"
          >
            {[
              ["24/7", t("hero.stat.pickup")],
              ["7 days", t("hero.stat.setup")],
              ["Inbox", t("hero.stat.summaries")],
            ].map(([value, label]) => (
              <div key={label} className="bg-background px-3 py-4 sm:px-5">
                <dt className="text-2xl font-extralight tracking-tight">{value}</dt>
                <dd className="mt-1 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

      </div>
    </section>
  );
}

