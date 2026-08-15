import { motion } from "framer-motion";
import { ClipboardCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialogs } from "./DialogsProvider";
import { useI18n } from "@/lib/i18n";
import { ThemeToggle } from "./ThemeToggle";
import { CONTACT_EMAIL, LEGAL_ENTITY } from "@/lib/site-config";
import { openConsentSettings } from "@/lib/consent";

const ease = [0.22, 1, 0.36, 1] as const;

export function FinalCTA() {
  const { openContact } = useDialogs();
  const { t, lang } = useI18n();
  const home = lang === "en" ? "/en" : "/";
  return (
    <section className="py-20 md:py-32 border-t border-border/60">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            {t("cta.eyebrow")}
          </p>
          <h2 className="mt-5 text-3xl md:text-5xl font-extralight tracking-normal leading-[1.1]">
            {t("cta.title")}
          </h2>
          <p className="mt-5 text-sm md:text-base text-muted-foreground max-w-md mx-auto leading-relaxed font-light">
            {t("cta.body")}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Button
              asChild
              size="lg"
              variant="brand"
              className="rounded-none uppercase tracking-[0.2em] text-[11px] font-semibold px-8"
            >
              <a href="/missade-samtal-audit?utm_source=homepage&utm_medium=cta&utm_campaign=vvs_audit&cta_variant=final">
                {t("audit.cta")}
              </a>
            </Button>
            <button
              onClick={openContact}
              className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>{t("cta.contact")}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  const { openContact } = useDialogs();
  const { t, lang } = useI18n();
  const home = lang === "en" ? "/en" : "/";
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
            <li>
              <a
                href={`${home}#how`}
                className="hover:text-foreground transition-colors text-muted-foreground"
              >
                {t("nav.how")}
              </a>
            </li>
            <li>
              <a
                href="/anvandningsfall/vvs"
                className="hover:text-foreground transition-colors text-muted-foreground"
              >
                {t("nav.vvs")}
              </a>
            </li>
            <li>
              <a
                href="/missade-samtal-audit"
                className="hover:text-foreground transition-colors text-muted-foreground"
              >
                {t("nav.audit")}
              </a>
            </li>
            <li>
              <a
                href="/partners"
                className="hover:text-foreground transition-colors text-muted-foreground"
              >
                {t("nav.partners")}
              </a>
            </li>
            <li>
              <a
                href={`${home}#pricing`}
                className="hover:text-foreground transition-colors text-muted-foreground"
              >
                {t("nav.pricing")}
              </a>
            </li>
            <li>
              <a
                href={`${home}#faq`}
                className="hover:text-foreground transition-colors text-muted-foreground"
              >
                {t("nav.faq")}
              </a>
            </li>
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
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
            <br />
            {t("footer.replies")}
          </p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {LEGAL_ENTITY.name}
            <br />
            {LEGAL_ENTITY.organizationNumber ? (
              <>
                Org.nr {LEGAL_ENTITY.organizationNumber}
                <br />
              </>
            ) : null}
            {LEGAL_ENTITY.address || null}
          </p>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col-reverse lg:flex-row items-center justify-between gap-5 text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span>
              © {new Date().getFullYear()} Leadmap · {t("footer.rights")}
            </span>
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
          <div className="flex flex-wrap items-center justify-center gap-5">
            <a href="/terms" className="hover:text-foreground transition-colors">
              {t("footer.terms")}
            </a>
            <a href="/privacy" className="hover:text-foreground transition-colors">
              {t("footer.privacy")}
            </a>
            <button
              type="button"
              onClick={openConsentSettings}
              className="hover:text-foreground transition-colors"
            >
              {t("footer.cookies")}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
      <a
        href="/missade-samtal-audit?utm_source=mobile_cta&utm_medium=sticky&utm_campaign=free_audit"
        className="fixed inset-x-4 bottom-4 z-40 inline-flex items-center justify-center gap-2 border border-foreground bg-foreground px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-background shadow-2xl md:hidden"
      >
        <ClipboardCheck className="h-4 w-4" />
        {t("nav.audit")}
      </a>
    </footer>
  );
}
