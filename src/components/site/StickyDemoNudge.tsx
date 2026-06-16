import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, PhoneIncoming, X } from "lucide-react";
import { useDialogs } from "./DialogsProvider";
import { useI18n } from "@/lib/i18n";

export function StickyDemoNudge() {
  const [hidden, setHidden] = useState(false);
  const { openBooking } = useDialogs();
  const { t } = useI18n();

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.aside
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
          className="fixed inset-x-3 bottom-3 z-40 hidden border border-border/80 bg-background/92 p-2 shadow-[0_24px_90px_-55px_var(--foreground)] backdrop-blur-xl md:block sm:left-auto sm:right-5 sm:bottom-5 sm:w-[25rem]"
        >
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <div className="grid h-10 w-10 place-items-center border border-foreground/15 bg-foreground text-background">
              <PhoneIncoming className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium tracking-tight">{t("sticky.title")}</p>
              <p className="mt-0.5 truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {t("sticky.body")}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={openBooking}
                className="group inline-flex h-10 items-center gap-2 bg-brand px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-foreground transition-colors hover:bg-brand/90"
              >
                <span className="hidden sm:inline">{t("sticky.cta")}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                type="button"
                aria-label={t("sticky.close")}
                onClick={() => setHidden(true)}
                className="grid h-10 w-10 place-items-center border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
