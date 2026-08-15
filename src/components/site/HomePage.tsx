import { BuyerSafety } from "@/components/site/BuyerSafety";
import { DialogsProvider } from "@/components/site/DialogsProvider";
import { ExperienceBridge } from "@/components/site/ExperienceBridge";
import { FAQ } from "@/components/site/FAQ";
import { FinalCTA, Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Nav } from "@/components/site/Nav";
import { Pricing } from "@/components/site/Pricing";
import { Process } from "@/components/site/Process";
import { RoiCalculator } from "@/components/site/RoiCalculator";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { TrustStack } from "@/components/site/TrustStack";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function HomePage() {
  return (
    <DialogsProvider>
      <div className="min-h-screen bg-background text-foreground">
        <ScrollProgress />
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <AuditStrip />
          <Process />
          <ExperienceBridge />
          <RoiCalculator />
          <TrustStack />
          <BuyerSafety />
          <Pricing />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </DialogsProvider>
  );
}

function AuditStrip() {
  const { t } = useI18n();
  return (
    <section className="border-y border-border/60 bg-card/35 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            {t("audit.eyebrow")}
          </p>
          <h2 className="mt-2 text-2xl font-extralight tracking-normal md:text-3xl">
            {t("audit.title")}
          </h2>
        </div>
        <Button
          asChild
          variant="outline"
          className="rounded-none px-6 text-[11px] font-semibold uppercase tracking-[0.18em]"
        >
          <a href="/missade-samtal-audit?utm_source=homepage&utm_medium=cta&utm_campaign=free_audit">
            {t("audit.cta")}
          </a>
        </Button>
      </div>
    </section>
  );
}
