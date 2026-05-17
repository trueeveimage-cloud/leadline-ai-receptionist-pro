import { motion } from "framer-motion";
import { MoonStar, Users, TrendingDown } from "lucide-react";
import { Section, stagger, item } from "./Section";

const cards = [
  { icon: MoonStar, title: "After-hours calls", body: "Evenings and weekends go unanswered." },
  { icon: Users, title: "Busy staff", body: "Front desk is occupied. Calls drop." },
  { icon: TrendingDown, title: "Lost leads", body: "Missed calls rarely call back." },
];

export function Problem() {
  return (
    <Section id="how" eyebrow="The problem" title="Missed calls cost more than you think.">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid md:grid-cols-3 gap-5"
      >
        {cards.map((c) => (
          <motion.div
            key={c.title}
            variants={item}
            className="rounded-2xl border border-border bg-card p-7 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_40px_-24px_rgba(0,0,0,0.12)] transition-shadow"
          >
            <div className="h-10 w-10 rounded-xl bg-surface border border-border grid place-items-center mb-6">
              <c.icon className="h-4 w-4" />
            </div>
            <h3 className="text-base font-medium">{c.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
