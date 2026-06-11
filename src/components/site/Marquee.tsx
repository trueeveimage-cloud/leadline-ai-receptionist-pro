import { motion, useReducedMotion } from "framer-motion";

const marks = [
  "INSTANT PICKUP",
  "-",
  "MISSED CALL RESCUE",
  "-",
  "QUALIFIED LEADS",
  "-",
  "OWNER-READY SUMMARIES",
  "-",
  "SWEDISH / ENGLISH / SPANISH",
  "-",
  "LIVE IN 7 DAYS",
  "-",
  "NO VOICEMAIL DEAD ENDS",
];

export function Marquee() {
  const reduce = useReducedMotion();
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
            {m}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
