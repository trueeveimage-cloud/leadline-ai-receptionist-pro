import { motion, useReducedMotion } from "framer-motion";

const marks = [
  "24/7 PICKUP",
  "—",
  "SUB-2s RESPONSE",
  "—",
  "GDPR · EU HOSTED",
  "—",
  "CALENDAR SYNC",
  "—",
  "BESPOKE VOICE",
  "—",
  "LIVE IN 7 DAYS",
  "—",
  "ZERO VOICEMAIL",
];

export function Marquee() {
  const reduce = useReducedMotion();
  const row = [...marks, ...marks];
  return (
    <section
      aria-label="Capabilities"
      className="relative border-y border-border/60 py-6 overflow-hidden bg-background"
    >
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 38, ease: "linear", repeat: Infinity }}
      >
        {row.map((m, i) => (
          <span
            key={i}
            className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/70 font-medium"
          >
            {m}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
