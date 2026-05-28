import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function Pain() {
  return (
    <section id="pain" className="py-24 md:py-32 border-t border-border/60">
      <div className="mx-auto max-w-4xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="text-[11px] uppercase tracking-[0.22em] text-brand mb-6"
        >
          The problem
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
          className="text-3xl md:text-5xl font-light tracking-[-0.02em] leading-[1.1] text-foreground"
        >
          Every missed call is a lost job.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
          className="mt-6 max-w-2xl text-base md:text-lg font-light text-muted-foreground leading-relaxed"
        >
          You&apos;re on a roof, under a sink, mid-treatment, or closed for the day —
          and the phone keeps ringing. Most callers won&apos;t leave a voicemail and
          they won&apos;t call back. They call the next business on the list.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          className="mt-8 max-w-2xl text-sm md:text-base text-muted-foreground font-light leading-relaxed"
        >
          Built for plumbers, roofers, dentists, clinics, car detailers and other
          service businesses.
        </motion.p>

      </div>
    </section>
  );
}
