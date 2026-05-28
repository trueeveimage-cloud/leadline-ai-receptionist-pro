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
    q: "Will it sound robotic?",
    a: "No. The voice is natural and calm in Swedish, English or Spanish. Most callers don't realize it's AI — and we tune the tone, name and script to your business before launch.",
  },
  {
    q: "Does it work with my current phone number?",
    a: "Yes. You keep your number. We set up call forwarding (or pickup after X rings) so Leadmap only answers when you can't.",
  },
  {
    q: "What happens if the AI can't answer something?",
    a: "It politely takes the caller's details and the reason for the call, then sends you a summary immediately so you can call back informed.",
  },
  {
    q: "How fast can we go live?",
    a: "Most setups go live within 7 days. We handle the configuration, voice training and forwarding rules — you just approve the script.",
  },
  {
    q: "Does it confirm bookings automatically?",
    a: "In the pilot, it collects qualified booking requests and sends them to you for confirmation. Full calendar booking can be added later.",
  },
  {
    q: "How is my data handled?",
    a: "Calls and summaries are stored securely in the EU. We never sell data. You can request deletion at any time.",
  },
  {
    q: "What if it's not worth it?",
    a: "Cancel anytime after the first month — no long contract, no termination fee. Most businesses cover the cost with one extra job per month.",
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
