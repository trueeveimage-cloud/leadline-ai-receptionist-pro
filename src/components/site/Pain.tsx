import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

export function Pain() {
  const { t } = useI18n();
  return (
    <section id="pain" className="py-16 md:py-28 border-t border-border/60">
      <div className="mx-auto max-w-3xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-6"
        >
          {t("pain.eyebrow")}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
          className="text-2xl md:text-5xl font-extralight tracking-normal leading-[1.15]"
        >
          {t("pain.title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
          className="mt-8 text-base md:text-lg font-light text-muted-foreground leading-relaxed"
        >
          {t("pain.body")}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          className="mt-10 text-[11px] uppercase tracking-[0.3em] text-muted-foreground/80"
        >
          {t("pain.built")}
        </motion.p>
      </div>
    </section>
  );
}
