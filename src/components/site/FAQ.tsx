import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

export function FAQ() {
  const { t } = useI18n();
  const faqs = [1, 2, 3, 4, 5, 6, 7].map((i) => ({
    q: t(`faq.${i}.q` as never),
    a: t(`faq.${i}.a` as never),
  }));

  return (
    <section id="faq" className="py-16 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease }}
          className="max-w-2xl"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-6">
            {t("faq.eyebrow")}
          </p>
          <h2 className="text-2xl md:text-5xl font-extralight tracking-[-0.02em] leading-[1.15]">
            {t("faq.title")}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className="mt-10 md:mt-16"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="border-b border-border/70"
              >
                <AccordionTrigger className="text-left text-[15px] md:text-base font-light tracking-tight py-5 hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-[14px] leading-relaxed text-muted-foreground pb-5 max-w-2xl font-light">
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
