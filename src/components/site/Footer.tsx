import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialogs } from "./DialogsProvider";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

export function FinalCTA() {
  const { openBooking, openContact } = useDialogs();
  const { t } = useI18n();
  return (
    <section className="py-24 md:py-36">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="rounded-[2rem] bg-foreground text-background px-8 md:px-16 py-20 md:py-24 text-center relative overflow-hidden"
        >
          <div
            className="absolute inset-0 -z-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 80%, white 0, transparent 40%)",
            }}
          />
          <p className="relative text-[10px] uppercase tracking-[0.4em] text-background/60">
            {t("cta.eyebrow")}
          </p>
          <h2 className="relative mt-5 text-3xl md:text-5xl font-extralight tracking-[-0.02em] max-w-2xl mx-auto leading-[1.1]">
            {t("cta.title")}
          </h2>
          <p className="relative mt-5 text-background/70 max-w-xl mx-auto leading-relaxed font-light">
            {t("cta.body")}
          </p>

          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              variant="soft"
              className="bg-background text-foreground hover:bg-background/90"
              onClick={openBooking}
            >
              {t("cta.book")}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-background hover:bg-background/10 hover:text-background"
              onClick={openContact}
            >
              <Mail className="h-4 w-4" />
              {t("cta.contact")}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  const { openContact } = useDialogs();
  const { t } = useI18n();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand" />
            <span className="font-semibold tracking-tight">Leadmap</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs leading-relaxed font-light">
            {t("footer.tagline")}
          </p>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {t("footer.explore")}
          </div>
          <ul className="mt-4 space-y-2.5 text-sm font-light">
            <li><a href="#how" className="hover:text-foreground transition-colors text-muted-foreground">{t("nav.how")}</a></li>
            <li><a href="#pricing" className="hover:text-foreground transition-colors text-muted-foreground">{t("nav.pricing")}</a></li>
            <li><a href="#faq" className="hover:text-foreground transition-colors text-muted-foreground">{t("nav.faq")}</a></li>
          </ul>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {t("footer.contact")}
          </div>
          <button
            onClick={openContact}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:text-brand transition-colors"
          >
            <Mail className="h-4 w-4" />
            {t("cta.contact")}
          </button>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed font-light">
            leadmapai.se@gmail.com<br />
            {t("footer.replies")}
          </p>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span>© {new Date().getFullYear()} Leadmap · {t("footer.rights")}</span>
            <span className="hidden sm:inline opacity-40">·</span>
            <span>
              {t("footer.partners")}{" "}
              <a
                href="https://nomia.se"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Nomia.se
              </a>
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href="/terms" className="hover:text-foreground transition-colors">
              {t("footer.terms")}
            </a>
            <a href="/privacy" className="hover:text-foreground transition-colors">
              {t("footer.privacy")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
