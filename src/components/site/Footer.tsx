import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialogs } from "./DialogsProvider";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

export function FinalCTA() {
  const { openBooking, openContact } = useDialogs();
  const { t } = useI18n();

  return (
    <section className="border-t border-border/60 py-20 md:py-32">
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
          <h2 className="mt-5 text-3xl font-extralight leading-[1.1] tracking-normal md:text-5xl">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm font-light leading-relaxed text-muted-foreground md:text-base">
            {t("cta.body")}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Button
              size="lg"
              variant="brand"
              onClick={openBooking}
              className="rounded-md px-8 text-[11px] font-semibold uppercase tracking-[0.2em]"
            >
              {t("cta.book")}
            </Button>
            <button
              onClick={openContact}
              className="group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
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
  const { t } = useI18n();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand" />
            <span className="font-semibold tracking-tight">Leadmap</span>
          </div>
          <p className="mt-3 max-w-xs text-sm font-light leading-relaxed text-muted-foreground">
            {t("footer.tagline")}
          </p>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {t("footer.explore")}
          </div>
          <ul className="mt-4 space-y-2.5 text-sm font-light">
            <li>
              <a href="/features" className="text-muted-foreground transition-colors hover:text-foreground">
                {t("nav.how")}
              </a>
            </li>
            <li>
              <a href="/lead-finder" className="text-muted-foreground transition-colors hover:text-foreground">
                Lead Finder
              </a>
            </li>
            <li>
              <a href="/pricing" className="text-muted-foreground transition-colors hover:text-foreground">
                {t("nav.pricing")}
              </a>
            </li>
            <li>
              <a href="/#faq" className="text-muted-foreground transition-colors hover:text-foreground">
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
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand"
          >
            <Mail className="h-4 w-4" />
            {t("cta.contact")}
          </button>
          <p className="mt-3 text-xs font-light leading-relaxed text-muted-foreground">
            leadmapai.se@gmail.com
            <br />
            {t("footer.replies")}
          </p>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col-reverse items-center justify-between gap-4 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <span>(C) {new Date().getFullYear()} Leadmap - {t("footer.rights")}</span>
            <span className="hidden opacity-40 sm:inline">-</span>
            <span>
              {t("footer.partners")}{" "}
              <a
                href="https://nomia.se"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Nomia.se
              </a>
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <ThemeSwitch />
            <a href="/terms" className="transition-colors hover:text-foreground">
              {t("footer.terms")}
            </a>
            <a href="/privacy" className="transition-colors hover:text-foreground">
              {t("footer.privacy")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

type ThemeMode = "light" | "dark";
const THEME_STORAGE_KEY = "leadmap-theme-v2";

function ThemeSwitch() {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const saved = readStoredTheme();
    const initial: ThemeMode = saved === "light" ? "light" : "dark";

    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const chooseTheme = (nextTheme: ThemeMode) => {
    setTheme(nextTheme);
    storeTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  return (
    <div className="flex items-center gap-1 rounded-md border border-border bg-card p-1" aria-label="Choose color mode">
      <button
        type="button"
        onClick={() => chooseTheme("light")}
        aria-pressed={theme === "light"}
        className={`inline-flex h-8 items-center gap-1.5 rounded-sm px-2.5 text-[10px] font-medium uppercase tracking-[0.16em] transition-colors ${
          theme === "light" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Sun className="h-3.5 w-3.5" />
        Light
      </button>
      <button
        type="button"
        onClick={() => chooseTheme("dark")}
        aria-pressed={theme === "dark"}
        className={`inline-flex h-8 items-center gap-1.5 rounded-sm px-2.5 text-[10px] font-medium uppercase tracking-[0.16em] transition-colors ${
          theme === "dark" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Moon className="h-3.5 w-3.5" />
        Dark
      </button>
    </div>
  );
}

function readStoredTheme() {
  try {
    return window.localStorage?.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeTheme(theme: ThemeMode) {
  try {
    window.localStorage?.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Browsers can block storage in strict/privacy contexts; the visible theme still switches.
  }
}
