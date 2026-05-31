import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useDialogs } from "./DialogsProvider";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { openBooking } = useDialogs();
  const reduce = useReducedMotion();
  const { t } = useI18n();
  return (
    <section id="top" className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-surface to-transparent -z-10" />
      <div className="mx-auto max-w-3xl px-6">
        <div>
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
            className="mt-6 text-5xl leading-[0.95] md:text-7xl font-light tracking-tight"
          >
            {t("hero.title.l1")}<br />
            <span className="italic font-extralight text-foreground/40">{t("hero.title.l2")}</span> {t("hero.title.l3")}
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
            className="mt-8 text-base md:text-lg font-light text-muted-foreground max-w-md leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.25 }}
            className="mt-10 flex flex-wrap items-center gap-8"
          >
            <Button size="lg" variant="brand" onClick={openBooking} className="rounded-none uppercase tracking-[0.2em] text-[11px] font-semibold px-8">
              {t("hero.cta.book")}
            </Button>
            <a href="#how" className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] font-medium text-muted-foreground hover:text-foreground transition-colors">
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
            <span className="opacity-30">·</span>
            <span>{t("hero.meta.2")}</span>
            <span className="opacity-30">·</span>
            <span>{t("hero.meta.3")}</span>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
