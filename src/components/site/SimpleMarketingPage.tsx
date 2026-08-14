import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogsProvider, useDialogs } from "./DialogsProvider";
import { Footer } from "./Footer";
import { Nav } from "./Nav";
import { ScrollProgress } from "./ScrollProgress";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

export type MarketingBlock = {
  eyebrow: string;
  title: string;
  body: string;
};

export function SimpleMarketingPage({
  eyebrow,
  title,
  intro,
  blocks,
  cta = "Book a demo",
}: {
  eyebrow: string;
  title: string;
  intro: string;
  blocks: MarketingBlock[];
  cta?: string;
}) {
  return (
    <DialogsProvider>
      <div className="min-h-screen bg-background text-foreground">
        <ScrollProgress />
        <Nav />
        <main>
          <section className="relative overflow-hidden border-b border-border/60 pt-28 pb-16 md:pt-36 md:pb-24">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(55%_50%_at_50%_0%,rgba(255,255,255,0.08),transparent_72%)]"
            />
            <div className="relative mx-auto max-w-5xl px-6">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease }}
                className="text-[10px] uppercase tracking-[0.34em] text-muted-foreground"
              >
                {eyebrow}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.05 }}
                className="mt-5 max-w-3xl text-4xl font-extralight tracking-normal md:text-7xl"
              >
                {title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.12 }}
                className="mt-6 max-w-2xl text-base font-light leading-relaxed text-muted-foreground md:text-lg"
              >
                {intro}
              </motion.p>
              <PageActions cta={cta} />
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="mx-auto grid max-w-5xl gap-px bg-border/70 px-0 md:grid-cols-3">
              {blocks.map((block, index) => (
                <motion.article
                  key={block.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55, ease, delay: index * 0.06 }}
                  className="bg-background p-6 md:p-8"
                >
                  <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{block.eyebrow}</p>
                  <h2 className="mt-4 text-2xl font-extralight tracking-normal">{block.title}</h2>
                  <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">{block.body}</p>
                </motion.article>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </DialogsProvider>
  );
}

function PageActions({ cta }: { cta: string }) {
  const { openBooking, openContact } = useDialogs();
  const { t } = useI18n();
  return (
    <div className="mt-10 flex flex-col gap-3 sm:flex-row">
      <Button
        size="lg"
        variant="brand"
        onClick={() => openBooking()}
        className="rounded-none px-8 text-[11px] font-semibold uppercase tracking-[0.2em]"
      >
        {cta}
      </Button>
      <button
        onClick={openContact}
        className="inline-flex items-center justify-center gap-3 px-1 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground sm:justify-start"
      >
        <Mail className="h-3.5 w-3.5" />
        {t("nav.contact")}
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
