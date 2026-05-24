import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

export function Process() {
  const { t } = useI18n();

  const steps = [
    { num: "01", title: t("step.1"), desc: t("step.1.desc") },
    { num: "02", title: t("step.2"), desc: t("step.2.desc") },
    { num: "03", title: t("step.3"), desc: t("step.3.desc") },
  ];

  return (
    <section id="how" className="border-y border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-y-0"
        >
          {steps.map((s, i) => (
            <div
              key={s.num}
              className={`relative flex flex-col items-start ${
                i < steps.length - 1
                  ? "md:border-r md:border-border/40 md:pr-8"
                  : ""
              } ${i > 0 ? "md:pl-8" : ""}`}
            >
              <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium">
                {s.num}
              </span>
              <h3 className="mt-3 text-xl md:text-2xl font-light tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
                {s.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
