import { motion } from "framer-motion";
import { CheckCircle2, FileText, Forward, Gauge, LockKeyhole, Settings2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

const setup = [
  { day: "trust.day.1", title: "trust.setup.1.title", detail: "trust.setup.1.detail" },
  { day: "trust.day.2", title: "trust.setup.2.title", detail: "trust.setup.2.detail" },
  { day: "trust.day.3", title: "trust.setup.3.title", detail: "trust.setup.3.detail" },
  { day: "trust.day.4", title: "trust.setup.4.title", detail: "trust.setup.4.detail" },
] as const;

const safeguards = [
  { icon: Forward, label: "trust.safe.1" },
  { icon: FileText, label: "trust.safe.2" },
  { icon: LockKeyhole, label: "trust.safe.3" },
  { icon: Gauge, label: "trust.safe.4" },
  { icon: Settings2, label: "trust.safe.5" },
  { icon: CheckCircle2, label: "trust.safe.6" },
] as const;

export function TrustStack() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-background py-16 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-y-0 left-1/2 hidden w-px bg-foreground/10 md:block"
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            {t("trust.eyebrow")}
          </p>
          <h2 className="mt-5 text-3xl font-extralight tracking-normal md:text-5xl">
            {t("trust.title")}
          </h2>
          <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-muted-foreground">
            {t("trust.body")}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-px border border-border/70 bg-border/70">
            {safeguards.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-background p-4">
                  <Icon className="h-4 w-4" />
                  <div className="mt-4 text-sm font-light leading-snug">{t(item.label)}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="relative">
          <div className="absolute left-5 top-0 hidden h-full w-px bg-border md:block" />
          <div className="space-y-4">
            {setup.map((item, index) => (
              <motion.div
                key={item.day}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, ease, delay: index * 0.08 }}
                className="relative border border-border bg-background p-5 md:ml-12"
              >
                <div className="absolute -left-[3.2rem] top-6 hidden h-3 w-3 rounded-full border border-foreground bg-background md:block" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                      {t(item.day)}
                    </div>
                    <h3 className="mt-2 text-xl font-light tracking-normal">{t(item.title)}</h3>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <p className="mt-4 max-w-lg text-sm font-light leading-relaxed text-muted-foreground">
                  {t(item.detail)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
