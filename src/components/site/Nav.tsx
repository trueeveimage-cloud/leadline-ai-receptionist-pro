import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialogs } from "./DialogsProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { openBooking, openContact } = useDialogs();
  const { t } = useI18n();
  const links = [
    { href: "/#how", label: t("nav.how") },
    { href: "/#pricing", label: t("nav.pricing") },
    { href: "/#faq", label: t("nav.faq") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled || open
            ? "backdrop-blur-xl bg-background/86 border-b border-border/60 shadow-[0_12px_36px_-32px_var(--foreground)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <span className="h-2 w-2 rounded-full bg-brand" />
            <span className="font-semibold tracking-tight">Leadmap</span>

          </a>

          <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium text-muted-foreground">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3.5 py-2 rounded-full tracking-tight hover:text-foreground hover:bg-secondary/70 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <Button
              size="sm"
              variant="ghost"
              className="hidden md:inline-flex rounded-full px-4 text-muted-foreground hover:text-foreground"
              onClick={openContact}
            >
              {t("nav.contact")}
            </Button>
            <Button
              size="sm"
              variant="brand"
              className="hidden md:inline-flex rounded-full px-5"
              onClick={openBooking}
            >
              {t("nav.bookDemo")}
            </Button>
            <button
              aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
              onClick={() => setOpen((v) => !v)}
              className="md:hidden h-10 w-10 grid place-items-center rounded-full border border-border bg-background text-foreground shadow-sm"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-16 inset-x-0 z-40 md:hidden bg-background border-b border-border shadow-[0_20px_70px_-45px_var(--foreground)]"
            >
              <nav className="px-6 py-6 flex flex-col">
                {links.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 + i * 0.04 }}
                    className="py-4 text-xl font-medium tracking-tight border-b border-border/60"
                  >
                    {l.label}
                  </motion.a>
                ))}
                <button
                  onClick={() => {
                    setOpen(false);
                    openContact();
                  }}
                  className="py-4 text-xl font-medium tracking-tight border-b border-border/60 text-left text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("nav.contact")}
                </button>
                <div className="pt-5">
                  <LanguageSwitcher />
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>
  );
}
