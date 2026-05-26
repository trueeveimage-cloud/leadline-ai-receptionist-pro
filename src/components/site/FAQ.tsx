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
    q: "Does it confirm bookings automatically?",
    a: "In the pilot, it collects qualified booking requests and sends them to you for confirmation. Full calendar booking can be added later.",
  },
  {
    q: "Do we need to change phone system?",
    a: "No, we help set it up with your current number or a forwarding number.",
  },
  {
    q: "Who is this best for?",
    a: "Businesses that get valuable calls but are often busy, driving, with customers, or closed.",
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
