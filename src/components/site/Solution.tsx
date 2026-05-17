import { motion } from "framer-motion";
import { PhoneCall, Filter, CalendarCheck, PhoneForwarded } from "lucide-react";
import { Section, stagger, item } from "./Section";

const features = [
  { icon: PhoneCall, title: "Answers instantly", body: "Picks up on the first ring, 24/7." },
  { icon: Filter, title: "Qualifies callers", body: "Asks the right questions, every time." },
  { icon: CalendarCheck, title: "Books appointments", body: "Direct to your calendar." },
  { icon: PhoneForwarded, title: "Transfers urgent calls", body: "Routes priority calls in real time." },
];

export function Solution() {
  return (
    <Section id="solution" eyebrow="The solution" title="Answers. Books. Sends the summary." muted>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={item}
            className="rounded-2xl border border-border bg-card p-7"
          >
            <div className="h-10 w-10 rounded-xl bg-foreground/[0.03] border border-border grid place-items-center mb-6 text-foreground">
              <f.icon className="h-4 w-4" />
            </div>
            <h3 className="text-base font-medium">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
