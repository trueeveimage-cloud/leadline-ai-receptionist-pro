import { motion, useReducedMotion } from "framer-motion";

const orbs = [
  { size: 520, x: "-12%", y: "10%", hue: "var(--brand)", opacity: 0.28, duration: 18 },
  { size: 380, x: "78%", y: "-8%", hue: "var(--foreground)", opacity: 0.10, duration: 22 },
  { size: 260, x: "62%", y: "55%", hue: "var(--brand)", opacity: 0.22, duration: 16 },
  { size: 200, x: "8%", y: "62%", hue: "var(--foreground)", opacity: 0.08, duration: 20 },
  { size: 140, x: "44%", y: "8%", hue: "var(--brand)", opacity: 0.18, duration: 14 },
];

export function HeroOrbs() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {orbs.map((o, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: o.size,
            height: o.size,
            left: o.x,
            top: o.y,
            background: `radial-gradient(closest-side, color-mix(in oklch, ${o.hue} ${Math.round(o.opacity * 100)}%, transparent), transparent 70%)`,
          }}
          animate={
            reduce
              ? undefined
              : {
                  x: [0, 30, -20, 0],
                  y: [0, -25, 18, 0],
                  scale: [1, 1.08, 0.96, 1],
                }
          }
          transition={{
            duration: o.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.6,
          }}
        />
      ))}
    </div>
  );
}
