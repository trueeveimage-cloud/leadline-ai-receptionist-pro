import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Demo() {
  return (
    <section id="demo" className="py-24 md:py-32 bg-surface">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-xs uppercase tracking-[0.18em] text-brand mb-4"
        >
          Demo
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-3xl md:text-5xl font-semibold tracking-tight"
        >
          Hear it before you buy.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className="mt-5 text-lg text-muted-foreground"
        >
          Call the demo AI and experience the flow.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <Button asChild size="lg" variant="brand">
            <a href="tel:+4500000000">Call demo</a>
          </Button>
          <Button asChild size="lg" variant="soft">
            <a href="#contact">Book setup call</a>
          </Button>
        </motion.div>
        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
          {["No setup required", "Works with your number", "Live in 7 days"].map((t) => (
            <span key={t} className="inline-flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-brand" /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
