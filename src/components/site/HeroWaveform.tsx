import { motion, useReducedMotion } from "framer-motion";

export function HeroWaveform({ bars = 64 }: { bars?: number }) {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 flex h-44 items-end justify-center gap-[3px] opacity-[0.18] md:opacity-[0.22]"
      style={{
        maskImage:
          "linear-gradient(to top, black 20%, transparent 100%), linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to top, black 20%, transparent 100%), linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      {Array.from({ length: bars }).map((_, i) => {
        // pseudo-random but deterministic base height
        const seed = Math.sin(i * 12.9898) * 43758.5453;
        const base = 14 + Math.abs(seed - Math.floor(seed)) * 70;
        return (
          <motion.span
            key={i}
            className="block w-[3px] rounded-full bg-foreground"
            initial={{ height: base * 0.4 }}
            animate={
              reduce
                ? { height: base }
                : { height: [base * 0.35, base, base * 0.55, base * 1.15, base * 0.4] }
            }
            transition={
              reduce
                ? { duration: 0 }
                : {
                    duration: 2.6 + (i % 7) * 0.18,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                    delay: (i % 11) * 0.07,
                  }
            }
          />
        );
      })}
    </div>
  );
}
