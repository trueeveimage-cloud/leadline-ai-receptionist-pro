import { useI18n } from "@/lib/i18n";

const marks = [
  "marquee.1",
  "-",
  "marquee.2",
  "-",
  "marquee.3",
  "-",
  "marquee.4",
  "-",
  "marquee.5",
  "-",
  "marquee.6",
  "-",
  "marquee.7",
] as const;

export function Marquee() {
  const { t } = useI18n();
  const row = marks;
  return (
    <section
      aria-label="Capabilities"
      className="relative overflow-hidden border-y border-border bg-foreground py-4 text-background"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-7 gap-y-2 px-6">
        {row.map((m, i) => (
          <span
            key={`${m}-${i}`}
            className="font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-background/65"
          >
            {m === "-" ? m : t(m)}
          </span>
        ))}
      </div>
    </section>
  );
}
