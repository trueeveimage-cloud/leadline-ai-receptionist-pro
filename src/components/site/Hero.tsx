import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useDialogs } from "./DialogsProvider";
import { ConversationPreview } from "./ConversationPreview";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { openBooking } = useDialogs();
  const reduce = useReducedMotion();
  const { t } = useI18n();
  return (
    <section id="top" className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-surface to-transparent -z-10" />
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-14 md:gap-12 items-center">
        <div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 rounded-none border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-none bg-brand" />
            {t("hero.badge")}
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.05 }}
            className="mt-6 text-[40px] leading-[1.05] md:text-6xl md:leading-[1.02] font-semibold tracking-tight"
          >
            {t("hero.title.l1")}<br />
            <span className="text-brand">{t("hero.title.l2")}</span> {t("hero.title.l3")}
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
            className="mt-6 text-lg text-muted-foreground max-w-md"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.25 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Button size="lg" variant="brand" onClick={openBooking}>
              {t("hero.cta.book")}
            </Button>
            <Button asChild size="lg" variant="soft">
              <a href="#how">{t("hero.cta.how")}</a>
            </Button>
          </motion.div>
        </div>

        <ConversationPreview />
      </div>
    </section>
  );
}
