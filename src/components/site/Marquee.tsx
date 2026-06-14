import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const marks = [
  "marquee.1",
  "-",
  "marquee.2",
  "-",
  "marquee.3",
  "-",
  "marquee.4",
  "-",
  "marquee.5",
  "-",
  "marquee.6",
  "-",
  "marquee.7",
] as const;

export function Marquee() {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const row = [...marks, ...marks];
  return (
    <section
      aria-label="Capabilities"
      className="relative overflow-hidden border-y border-border/60 bg-foreground py-5 text-background"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-foreground to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-foreground to-transparent" />

      <motion.div
        className="flex gap-9 whitespace-nowrap"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 34, ease: "linear", repeat: Infinity }}
      >
        {row.map((m, i) => (
          <span
            key={`${m}-${i}`}
            className="text-[10px] font-semibold uppercase tracking-[0.34em] text-background/72"
          >
            {m === "-" ? m : t(m)}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
