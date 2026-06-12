import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

export function Pain() {
  const { t } = useI18n();

  return (
    <section id="pain" className="relative border-t border-border/60 py-24 md:py-36 overflow-hidden">
      {/* soft background orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span
          className="absolute -left-20 top-1/4 h-[420px] w-[420px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklch, var(--brand) 18%, transparent), transparent 70%)",
          }}
        />
        <span
          className="absolute right-0 bottom-0 h-[360px] w-[360px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklch, var(--foreground) 8%, transparent), transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="inline-flex items-center gap-3 mb-8"
        >
          <span className="h-px w-8 bg-foreground/30" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium">
            {t("pain.eyebrow")}
          </span>
          <span className="h-px w-8 bg-foreground/30" />
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease, delay: 0.05 }}
          className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-tight leading-[1.08]"
        >
          <span className="font-serif italic text-foreground/40">"</span>
          {t("pain.title")}
          <span className="font-serif italic text-foreground/40">"</span>
        </motion.blockquote>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
          className="mt-8 max-w-xl mx-auto text-base md:text-lg font-light text-muted-foreground leading-relaxed"
        >
          {t("pain.body")}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease, delay: 0.25 }}
          className="mt-14 text-[11px] uppercase tracking-[0.3em] text-muted-foreground/80"
        >
          {t("pain.built")}
        </motion.p>
      </div>
    </section>
  );
}
