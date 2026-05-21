import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ease = [0.22, 1, 0.36, 1] as const;

const faqs = [
  {
    q: "How quickly can we go live?",
    a: "Most clients are live within 7 days. We handle voice training, knowledge ingestion and calendar integration so your team can stay focused on the work.",
  },
  {
    q: "What happens to a call when the AI can't help?",
    a: "It transfers warmly to a real person on your team, or captures the lead with full context and sends a summary by email — your choice, per scenario.",
  },
  {
    q: "Does it sound like a robot?",
    a: "No. Voices are natural, calm and on-brand. You can keep our premium default voice or clone one specifically for your business.",
  },
  {
    q: "Which languages are supported?",
    a: "English, Danish, Swedish, German and Spanish out of the box. Other European languages are available on request.",
  },
  {
    q: "Where does my data live?",
    a: "Calls and transcripts are stored in the EU with encryption at rest. We sign DPAs and never train public models on your conversations.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — month-to-month after the initial pilot. No long contracts, no penalties.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease }}
          className="max-w-2xl"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-brand mb-4">
            FAQ
          </p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-[-0.025em] leading-[1.05]">
            Answers, before you ask.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className="mt-12 md:mt-16"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="border-b border-border/70"
              >
                <AccordionTrigger className="text-left text-base md:text-lg font-medium tracking-tight py-6 hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground pb-6 max-w-2xl">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
