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
    { href: "/experience", label: t("nav.experience") },
    { href: "/#pricing", label: t("nav.pricing") },
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
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
          scrolled || open
            ? "border-b border-border bg-background/95 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <span className="h-2 w-2 rounded-full bg-brand" />
            <span className="font-semibold tracking-tight">Leadmap</span>

          </a>

          <nav className="hidden items-center gap-7 text-[12px] font-medium text-muted-foreground md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="py-2 tracking-tight transition-colors hover:text-foreground"
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
              className="hidden px-3 text-muted-foreground hover:bg-transparent hover:text-foreground md:inline-flex"
              onClick={openContact}
            >
              {t("nav.contact")}
            </Button>
            <Button
              size="sm"
              variant="brand"
              className="hidden px-5 md:inline-flex"
              onClick={openBooking}
            >
              {t("nav.bookDemo")}
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
              onClick={() => setOpen((v) => !v)}
              className="h-10 w-10 bg-background md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
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
              className="fixed inset-x-0 top-16 z-40 border-b border-border bg-background md:hidden"
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
                <Button
                  variant="ghost"
                  onClick={() => {
                    setOpen(false);
                    openContact();
                  }}
                  className="h-auto justify-start border-b border-border/60 px-0 py-4 text-left text-xl font-medium tracking-tight text-muted-foreground hover:bg-transparent hover:text-foreground"
                >
                  {t("nav.contact")}
                </Button>
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
