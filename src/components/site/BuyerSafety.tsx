import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, FileText, LockKeyhole, PhoneForwarded } from "lucide-react";
import { useDialogs } from "./DialogsProvider";
import { useI18n } from "@/lib/i18n";

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
    <section className="relative overflow-hidden border-y border-border/60 bg-foreground text-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--background) 1px, transparent 1px), linear-gradient(to bottom, var(--background) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[0.95fr_1.05fr] md:items-center md:py-24">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-background/55">
            {t("safety.eyebrow")}
          </p>
          <h2 className="mt-5 max-w-2xl text-4xl font-extralight tracking-normal md:text-6xl">
            {t("safety.title")}
          </h2>
          <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-background/70 md:text-base">
            {t("safety.body")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={openBooking}
              className="inline-flex h-12 items-center justify-center bg-background px-7 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground transition-opacity hover:opacity-85"
            >
              {t("safety.book")}
            </button>
            <button
              onClick={openTestAI}
              className="group inline-flex h-12 items-center justify-center gap-2 border border-background/20 px-7 text-[11px] font-semibold uppercase tracking-[0.22em] text-background transition-colors hover:bg-background/10"
            >
              <span>{t("safety.test")}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease, delay: 0.08 }}
          className="border border-background/15 bg-background/[0.03] p-3"
        >
          <div className="grid gap-px bg-background/15">
            <div className="bg-foreground p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="text-[10px] uppercase tracking-[0.3em] text-background/55">
                  {t("safety.panel")}
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-background/55">
                  {t("safety.panel.status")}
                </span>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-px bg-background/15 text-center">
                {[t("safety.metric.1"), t("safety.metric.2"), t("safety.metric.3")].map((metric, index) => (
                  <div key={metric} className="bg-foreground px-2 py-5">
                    <div className="text-3xl font-extralight tabular-nums">{index === 0 ? "7" : index === 1 ? "0" : "EU"}</div>
                    <div className="mt-2 text-[9px] uppercase tracking-[0.2em] text-background/55">
                      {metric}
                    </div>
                  </div>
                ))}
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
                  className="grid gap-4 bg-foreground p-5 sm:grid-cols-[2.5rem_1fr_auto] sm:items-center"
                >
                  <span className="grid h-10 w-10 place-items-center border border-background/20">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-base font-light">{t(item.label)}</div>
                    <div className="mt-1 text-sm leading-relaxed text-background/60">{t(item.detail)}</div>
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
