import { motion, useReducedMotion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useI18n, type Lang } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

const copy: Record<Lang, { eyebrow: string; title: string; items: { q: string; a: string }[] }> = {
  sv: {
    eyebrow: "FAQ",
    title: "Frågor som brukar avgöra köpet.",
    items: [
      {
        q: "Är det riktiga bokningar?",
        a: "Leadmap skickar kvalificerade bokningsförfrågningar. Ni bekräftar alltid kunden själva innan något räknas som bokat.",
      },
      {
        q: "Måste vi byta telefonnummer?",
        a: "Nej. Setup kan anpassas efter ert nuvarande flöde, till exempel vidarekoppling när ni är upptagna eller har stängt.",
      },
      {
        q: "Låter det som en robot?",
        a: "Samtalet byggs kort, lugnt och naturligt på svenska. Målet är inte att prata länge, utan att fånga rätt uppgifter utan stress.",
      },
      {
        q: "Vad händer om kunden frågar något svårt?",
        a: "Leadmap försöker inte låtsas vara expert på allt. Den samlar information, markerar behovet och skickar vidare till er.",
      },
      {
        q: "Kan vi avsluta?",
        a: "Ja. Ingen bindning första månaden, så ni kan testa utan lång risk.",
      },
      {
        q: "Fungerar det när vi har stängt?",
        a: "Ja. Leadmap kan svara även utanför öppettider och skicka sammanfattningen direkt till er.",
      },
    ],
  },
  en: {
    eyebrow: "FAQ",
    title: "Questions that usually decide the purchase.",
    items: [
      {
        q: "Are these real bookings?",
        a: "Leadmap sends qualified booking requests. You always confirm the customer yourself before anything is treated as booked.",
      },
      {
        q: "Do we need to change phone number?",
        a: "No. Setup can adapt to your current flow, for example forwarding when you are busy or closed.",
      },
      {
        q: "Will it sound robotic?",
        a: "The call is short, calm and natural in Swedish. The goal is not to talk forever, but to capture the right details without stress.",
      },
      {
        q: "What if the customer asks something difficult?",
        a: "Leadmap does not pretend to be an expert in everything. It collects the information, marks the need and passes it to you.",
      },
      {
        q: "Can we cancel?",
        a: "Yes. No commitment the first month, so you can test without long risk.",
      },
      {
        q: "Does it work after hours?",
        a: "Yes. Leadmap can answer outside opening hours and send the summary straight to you.",
      },
    ],
  },
  es: {
    eyebrow: "FAQ",
    title: "Preguntas que suelen decidir la compra.",
    items: [
      {
        q: "¿Son reservas reales?",
        a: "Leadmap envía solicitudes calificadas. Tú siempre confirmas al cliente antes de tratarlo como reserva.",
      },
      {
        q: "¿Tenemos que cambiar de número?",
        a: "No. El setup puede adaptarse a tu flujo actual, por ejemplo desvío cuando estás ocupado o cerrado.",
      },
      {
        q: "¿Sonará como un robot?",
        a: "La llamada es corta, tranquila y natural. El objetivo no es hablar mucho, sino capturar los datos correctos sin estrés.",
      },
      {
        q: "¿Qué pasa si el cliente pregunta algo difícil?",
        a: "Leadmap no intenta fingir que sabe todo. Recoge la información, marca la necesidad y te la pasa.",
      },
      {
        q: "¿Podemos cancelar?",
        a: "Sí. Sin permanencia el primer mes, para probar sin riesgo largo.",
      },
      {
        q: "¿Funciona fuera de horario?",
        a: "Sí. Leadmap puede responder fuera del horario y enviarte el resumen directamente.",
      },
    ],
  },
};

export function FAQ() {
  const { lang } = useI18n();
  const reduce = useReducedMotion();
  const c = copy[lang];

  return (
    <section id="faq" className="py-16 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease }}
          className="max-w-2xl"
        >
          <p className="mb-6 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            {c.eyebrow}
          </p>
          <h2 className="text-3xl font-extralight tracking-normal leading-[1.12] md:text-5xl">
            {c.title}
          </h2>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className="mt-10 md:mt-16"
        >
          <Accordion type="single" collapsible className="w-full">
            {c.items.map((item, index) => (
              <AccordionItem
                key={item.q}
                value={`item-${index}`}
                className="border-b border-border/70"
              >
                <AccordionTrigger className="py-5 text-left text-[15px] font-light tracking-tight hover:no-underline md:text-base">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="max-w-2xl pb-5 text-[14px] font-light leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
