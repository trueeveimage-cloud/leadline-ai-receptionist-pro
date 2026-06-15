import { motion } from "framer-motion";
import { AlertTriangle, CalendarDays, Clock3, PhoneCall } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

const segments = [
  {
    key: "industries.1",
    icon: AlertTriangle,
    href: "/vvs-emergency-trades",
  },
  {
    key: "industries.2",
    icon: CalendarDays,
    href: "/dental-clinics",
  },
  {
    key: "industries.3",
    icon: PhoneCall,
  },
  {
    key: "industries.4",
    icon: Clock3,
  },
] as const;

export function Industries() {
  const { t } = useI18n();

  return (
    <section id="industries" className="border-y border-border/60 bg-surface/30 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              {t("industries.eyebrow")}
            </p>
            <h2 className="mt-5 text-3xl font-extralight tracking-normal md:text-5xl">
              {t("industries.title")}
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease, delay: 0.08 }}
            className="max-w-xl text-sm font-light leading-relaxed text-muted-foreground md:justify-self-end"
          >
            {t("industries.body")}
          </motion.p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden border border-border/70 bg-border/70 md:grid-cols-4">
          {segments.map((segment, index) => {
            const Icon = segment.icon;
            const content = (
              <motion.article
                key={segment.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, ease, delay: index * 0.06 }}
                className="group bg-background p-6 transition-colors hover:bg-card md:min-h-[270px]"
              >
                <div className="flex h-11 w-11 items-center justify-center border border-foreground/20 transition-colors group-hover:border-foreground/50">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="mt-8 text-xl font-light tracking-normal">{t(`${segment.key}.name`)}</h3>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {t(`${segment.key}.examples`)}
                </p>
                <p className="mt-6 text-sm font-light leading-relaxed text-muted-foreground">
                  {t(`${segment.key}.signal`)}
                </p>
              </motion.article>
            );
            return "href" in segment ? (
              <a key={segment.key} href={segment.href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {content}
              </a>
            ) : content;
          })}
        </div>
      </div>
    </section>
  );
}
