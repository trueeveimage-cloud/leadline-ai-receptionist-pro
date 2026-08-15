import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, FileText, LockKeyhole, PhoneForwarded } from "lucide-react";
import { useDialogs } from "./DialogsProvider";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const ease = [0.22, 1, 0.36, 1] as const;

const safeguards = [
  { icon: PhoneForwarded, label: "safety.item.1", detail: "safety.item.1.detail" },
  { icon: FileText, label: "safety.item.2", detail: "safety.item.2.detail" },
  { icon: LockKeyhole, label: "safety.item.3", detail: "safety.item.3.detail" },
] as const;

export function BuyerSafety() {
  const { t } = useI18n();
  const { openBooking, openTestAI } = useDialogs();
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-y border-border bg-foreground py-20 text-background md:py-28">
      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-20">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-background/55">
            {t("safety.eyebrow")}
          </p>
          <h2 className="mt-5 max-w-2xl text-4xl font-light tracking-tight md:text-5xl">
            {t("safety.title")}
          </h2>
          <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-background/70 md:text-base">
            {t("safety.body")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={openBooking}
              className="h-11 bg-background px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground hover:bg-background/90"
            >
              {t("safety.book")}
            </Button>
            <Button
              variant="outline"
              onClick={openTestAI}
              className="group h-11 border-background/20 bg-transparent px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-background hover:bg-background/10"
            >
              <span>{t("safety.test")}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease, delay: 0.08 }}
          className="overflow-hidden border border-background/15 bg-background/[0.025]"
        >
          <div>
            <div className="border-b border-background/10 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-background/55">
                  {t("safety.panel")}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-background/55">
                  {t("safety.panel.status")}
                </span>
              </div>
              <div className="mt-7 grid grid-cols-3 divide-x divide-background/10 text-center">
                {[t("safety.metric.1"), t("safety.metric.2"), t("safety.metric.3")].map(
                  (metric, index) => (
                    <div key={metric} className="px-2 py-4">
                      <div className="text-3xl font-extralight tabular-nums">
                        {index === 0 ? "7" : index === 1 ? "0" : "1"}
                      </div>
                      <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-background/55">
                        {metric}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {safeguards.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={reduce ? false : { opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55, ease, delay: 0.1 + index * 0.08 }}
                  className="grid gap-4 border-b border-background/10 p-5 last:border-b-0 sm:grid-cols-[2rem_1fr_auto] sm:items-center sm:px-6"
                >
                  <span className="grid h-8 w-8 place-items-center border border-background/15 text-background/60">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-medium">{t(item.label)}</div>
                    <div className="mt-1 text-xs leading-relaxed text-background/55">
                      {t(item.detail)}
                    </div>
                  </div>
                  <CheckCircle2 className="hidden h-5 w-5 text-background/55 sm:block" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
