import { motion } from "framer-motion";
import { Section, stagger, item } from "./Section";

const industries = ["Clinics", "Dental", "Car dealerships", "Law firms", "Renovation", "Real estate"];

export function Industries() {
  return (
    <Section id="industries" eyebrow="Industries" title="Built for premium service businesses.">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-2 md:grid-cols-3 gap-3"
      >
        {industries.map((name) => (
          <motion.div
            key={name}
            variants={item}
            className="rounded-2xl border border-border bg-card px-6 py-7 flex items-center justify-between hover:border-foreground/30 transition-colors"
          >
            <span className="text-base font-medium">{name}</span>
            <span className="h-1.5 w-1.5 rounded-none bg-brand" />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
