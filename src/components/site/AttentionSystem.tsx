import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  MailCheck,
  MessageSquareText,
  PhoneIncoming,
  Sparkles,
} from "lucide-react";
import { useDialogs } from "./DialogsProvider";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

const flow = [
  { icon: PhoneIncoming, label: "attention.flow.1", meta: "attention.flow.1.meta" },
  { icon: Sparkles, label: "attention.flow.2", meta: "attention.flow.2.meta" },
  { icon: CalendarCheck, label: "attention.flow.3", meta: "attention.flow.3.meta" },
  { icon: MailCheck, label: "attention.flow.4", meta: "attention.flow.4.meta" },
] as const;

export function AttentionSystem() {
  const { t } = useI18n();
  const { openTestAI } = useDialogs();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const panelY = useTransform(scrollYProgress, [0, 1], ["9%", "-9%"]);
  const railY = useTransform(scrollYProgress, [0, 1], ["-4%", "8%"]);

  return (
    <section ref={ref} className="relative overflow-hidden border-b border-border/60 bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: railY }}
        className="pointer-events-none absolute left-6 top-0 hidden h-full w-px bg-foreground/10 md:block"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[0.86fr_1.14fr] md:items-center md:py-24">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="md:sticky md:top-24"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            {t("attention.eyebrow")}
          </p>
          <h2 className="mt-5 max-w-xl text-3xl font-extralight tracking-normal md:text-6xl">
            {t("attention.title")}
          </h2>
          <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-muted-foreground md:text-base">
            {t("attention.body")}
          </p>

          <button
            onClick={openTestAI}
            className="group mt-8 inline-flex items-center gap-3 border-b border-foreground pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
          >
            <span>{t("attention.cta")}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        <motion.div
          style={reduce ? undefined : { y: panelY }}
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease, delay: 0.08 }}
          className="relative"
        >
          <div className="absolute -inset-4 border border-foreground/10" aria-hidden />
          <div className="relative overflow-hidden border border-border bg-card shadow-[0_40px_120px_-80px_var(--foreground)]">
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-brand opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
                </span>
                <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  {t("attention.console")}
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {t("attention.live")}
              </span>
            </div>

            <div className="grid gap-px bg-border/70 md:grid-cols-[0.9fr_1.1fr]">
              <div className="bg-background p-4 sm:p-6">
                <div className="relative min-h-[340px] overflow-hidden border border-border bg-surface/40 p-4">
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                      backgroundImage:
                        "linear-gradient(var(--foreground) 1px, transparent 1px)",
                      backgroundSize: "100% 18px",
                    }}
                  />

                  <div className="relative flex h-full min-h-[300px] flex-col justify-between">
                    {flow.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.label}
                          initial={reduce ? false : { opacity: 0, x: -14 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-80px" }}
                          transition={{ duration: 0.55, ease, delay: 0.12 + index * 0.08 }}
                          className="group flex items-center gap-3"
                        >
                          <div className="grid h-12 w-12 shrink-0 place-items-center border border-foreground/15 bg-background transition-colors group-hover:border-foreground/50">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium">{t(item.label)}</div>
                            <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                              {t(item.meta)}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-background p-4 sm:p-6">
                <div className="grid gap-4">
                  <div className="border border-border bg-card p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                        {t("attention.intent")}
                      </span>
                      <span className="text-xs font-medium text-foreground">{t("attention.hot")}</span>
                    </div>
                    <div className="mt-5 space-y-3">
                      {[92, 74, 58].map((width, index) => (
                        <div key={width} className="space-y-1.5">
                          <div className="flex justify-between text-[11px] text-muted-foreground">
                            <span>{t(`attention.bar.${index + 1}` as Parameters<typeof t>[0])}</span>
                            <span>{width}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden bg-secondary">
                            <motion.div
                              initial={reduce ? false : { width: 0 }}
                              whileInView={{ width: `${width}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.9, ease, delay: 0.25 + index * 0.08 }}
                              className="h-full bg-foreground"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border border-border bg-foreground p-4 text-background">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-background/60">
                      <MessageSquareText className="h-3.5 w-3.5" />
                      {t("attention.summary")}
                    </div>
                    <p className="mt-4 text-xl font-light leading-snug">
                      {t("attention.summaryText")}
                    </p>
                    <div className="mt-5 grid grid-cols-3 gap-px bg-background/20 text-center">
                      {[t("attention.tag.1"), t("attention.tag.2"), t("attention.tag.3")].map((tag) => (
                        <span key={tag} className="bg-foreground px-2 py-3 text-[10px] uppercase tracking-[0.18em] text-background/70">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-px bg-border/70 text-center">
                    <div className="bg-background p-4">
                      <div className="text-2xl font-extralight tabular-nums">00:01</div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        {t("attention.metric.1")}
                      </div>
                    </div>
                    <div className="bg-background p-4">
                      <div className="text-2xl font-extralight tabular-nums">04</div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        {t("attention.metric.2")}
                      </div>
                    </div>
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
