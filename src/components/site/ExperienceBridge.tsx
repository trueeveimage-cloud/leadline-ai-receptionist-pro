import { ArrowRight, Radar } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

export function ExperienceBridge() {
  const { t } = useI18n();

  return (
    <section className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <motion.a
          href="/experience"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease }}
          className="group grid gap-8 overflow-hidden border border-border/70 bg-card p-5 transition-colors hover:border-foreground/30 md:grid-cols-[0.72fr_1.28fr] md:p-7"
        >
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center border border-foreground/15 bg-background">
              <Radar className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                {t("bridge.eyebrow")}
              </p>
              <h2 className="mt-2 text-2xl font-light tracking-normal md:text-3xl">
                {t("bridge.title")}
              </h2>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <p className="max-w-xl text-sm font-light leading-relaxed text-muted-foreground">
              {t("bridge.body")}
            </p>
            <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em]">
              {t("bridge.cta")}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </motion.a>
      </div>
    </section>
  );
}
