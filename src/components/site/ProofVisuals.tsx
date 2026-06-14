import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { AlertTriangle, ArrowRight, MailCheck, PhoneIncoming, TimerReset } from "lucide-react";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

const proofCards = [
  { value: "00:01", label: "proof.card.1", icon: TimerReset },
  { value: "4", label: "proof.card.2", icon: MailCheck },
  { value: "24/7", label: "proof.card.3", icon: PhoneIncoming },
] as const;

export function ProofVisuals() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const scanY = useTransform(scrollYProgress, [0, 1], ["-35%", "145%"]);

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-border/60 bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-center md:py-24">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-8 bg-foreground/30" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-muted-foreground">
              {t("proof.eyebrow")}
            </span>
          </div>
          <h2 className="mt-6 max-w-2xl text-4xl font-extralight tracking-normal md:text-6xl">
            {t("proof.title")}
          </h2>
          <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-muted-foreground md:text-base">
            {t("proof.body")}
          </p>

          <div className="mt-8 grid gap-px border border-border/70 bg-border/70 sm:grid-cols-3">
            {proofCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="bg-background p-4">
                  <Icon className="h-4 w-4 text-foreground/70" />
                  <div className="mt-4 text-3xl font-extralight tabular-nums">{card.value}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {t(card.label)}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          style={reduce ? undefined : { y: visualY }}
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease, delay: 0.08 }}
          className="relative"
        >
          <div className="absolute -inset-3 border border-foreground/10" aria-hidden />
          <div className="relative overflow-hidden border border-border bg-card">
            <motion.div
              aria-hidden
              style={reduce ? undefined : { y: scanY }}
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-foreground/10 to-transparent"
            />
            <div className="border-b border-border/70 px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-brand" />
                  {t("proof.visual.label")}
                </div>
                <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {t("proof.visual.live")}
                </span>
              </div>
            </div>

            <div className="grid gap-px bg-border/70 md:grid-cols-[0.9fr_1.1fr]">
              <div className="bg-background p-4 sm:p-6">
                <div className="flex min-h-[310px] flex-col justify-between border border-border bg-surface/40 p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center border border-destructive/30 bg-destructive/10 text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-sm font-medium">{t("proof.missed.title")}</div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        {t("proof.missed.meta")}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[92, 68, 31].map((width, index) => (
                      <div key={width} className="space-y-1.5">
                        <div className="flex justify-between text-[11px] text-muted-foreground">
                          <span>{t(`proof.bar.${index + 1}` as Parameters<typeof t>[0])}</span>
                          <span>{width}%</span>
                        </div>
                        <div className="h-1.5 bg-secondary">
                          <motion.div
                            initial={reduce ? false : { width: 0 }}
                            whileInView={{ width: `${width}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease, delay: 0.16 + index * 0.08 }}
                            className="h-full bg-foreground"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-background p-4 sm:p-6">
                <div className="flex min-h-[310px] flex-col justify-between bg-foreground p-5 text-background">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-background/60">
                      {t("proof.saved.eyebrow")}
                    </div>
                    <p className="mt-5 text-2xl font-light leading-tight md:text-3xl">
                      {t("proof.saved.title")}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center justify-between gap-4 border-t border-background/15 pt-3">
                        <span className="text-sm text-background/80">{t(`proof.saved.${item}` as Parameters<typeof t>[0])}</span>
                        <ArrowRight className="h-4 w-4 text-background/55" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
