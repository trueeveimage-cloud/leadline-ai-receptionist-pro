import { motion, useReducedMotion } from "framer-motion";
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
import { Button } from "@/components/ui/button";

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
  return (
    <section className="relative overflow-hidden border-b border-border bg-background py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-20">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {t("attention.eyebrow")}
          </p>
          <h2 className="mt-5 max-w-xl text-4xl font-light tracking-tight md:text-5xl">
            {t("attention.title")}
          </h2>
          <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-muted-foreground md:text-base">
            {t("attention.body")}
          </p>

          <Button
            variant="link"
            onClick={openTestAI}
            className="group mt-8 h-auto border-b border-foreground px-0 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] hover:no-underline hover:opacity-60"
          >
            <span>{t("attention.cta")}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease, delay: 0.08 }}
          className="overflow-hidden border border-border bg-card shadow-[0_12px_40px_-32px_var(--foreground)]"
        >
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand" />
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {t("attention.console")}
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {t("attention.live")}
              </span>
            </div>

            <div className="grid md:grid-cols-[0.92fr_1.08fr]">
              <div className="border-b border-border bg-card p-5 sm:p-6 md:border-r md:border-b-0">
                  <div className="flex flex-col gap-6">
                    {flow.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.label}
                          initial={reduce ? false : { opacity: 0, x: -14 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-80px" }}
                          transition={{ duration: 0.55, ease, delay: 0.12 + index * 0.08 }}
                          className="flex items-center gap-3"
                        >
                           <div className="grid h-10 w-10 shrink-0 place-items-center border border-border bg-surface/45">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium">{t(item.label)}</div>
                             <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
                              {t(item.meta)}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </div>

              <div className="bg-card p-5 sm:p-6">
                <div className="grid gap-6">
                  <div>
                    <div className="flex items-center justify-between gap-3">
                       <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
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
                           <div className="h-0.5 overflow-hidden bg-secondary">
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

                  <div className="bg-foreground p-5 text-background">
                    <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-background/60">
                      <MessageSquareText className="h-3.5 w-3.5" />
                      {t("attention.summary")}
                    </div>
                    <p className="mt-3 text-base font-light leading-relaxed">
                      {t("attention.summaryText")}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 border-t border-border text-center">
                    <div className="border-r border-border pt-4">
                      <div className="text-2xl font-extralight tabular-nums">00:01</div>
                       <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                        {t("attention.metric.1")}
                      </div>
                    </div>
                    <div className="pt-4">
                      <div className="text-2xl font-extralight tabular-nums">04</div>
                       <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                        {t("attention.metric.2")}
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
