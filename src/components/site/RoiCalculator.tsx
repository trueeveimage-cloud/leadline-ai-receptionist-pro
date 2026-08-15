import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";

const formatSek = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  maximumFractionDigits: 0,
});

export function RoiCalculator({ initialMissedCalls = 5 }: { initialMissedCalls?: number }) {
  const [missedCalls, setMissedCalls] = useState(initialMissedCalls);
  const [averageJobValue, setAverageJobValue] = useState(4_500);
  const [recoveryRate, setRecoveryRate] = useState(25);

  const estimate = useMemo(() => {
    const callsPerMonth = Math.max(0, missedCalls) * 4.33;
    return callsPerMonth * Math.max(0, averageJobValue) * (Math.max(0, recoveryRate) / 100);
  }, [averageJobValue, missedCalls, recoveryRate]);

  return (
    <section className="border-y border-border/60 bg-surface/40 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
        <div>
          <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
            <Calculator className="h-4 w-4" />
            Räkna på ert scenario
          </p>
          <h2 className="mt-5 text-3xl font-extralight leading-tight md:text-5xl">
            Vad kan missade samtal vara värda för er?
          </h2>
          <p className="mt-5 max-w-lg text-sm font-light leading-relaxed text-muted-foreground">
            Ändra antagandena själv. Kalkylen visar ett planeringsscenario, inte ett löfte om
            resultat.
          </p>
        </div>

        <div className="border border-border bg-background p-6 md:p-8">
          <div className="grid gap-6 sm:grid-cols-3">
            <NumberField
              label="Missade samtal/vecka"
              value={missedCalls}
              min={0}
              max={100}
              onChange={setMissedCalls}
            />
            <NumberField
              label="Genomsnittligt jobbvärde"
              value={averageJobValue}
              min={0}
              max={250_000}
              step={500}
              suffix="kr"
              onChange={setAverageJobValue}
            />
            <NumberField
              label="Möjlig återvinning"
              value={recoveryRate}
              min={0}
              max={100}
              step={5}
              suffix="%"
              onChange={setRecoveryRate}
            />
          </div>
          <div className="mt-8 border-t border-border pt-6">
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              Illustrerat potentiellt jobbvärde per månad
            </p>
            <p className="mt-3 text-4xl font-extralight tabular-nums md:text-6xl">
              {formatSek.format(estimate)}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Baserat på 4,33 veckor per månad. Faktiskt utfall beror på samtalskvalitet,
              tillgänglighet och er egen uppföljning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <span className="mt-2 flex items-center border border-border bg-card px-3">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => onChange(Number(event.target.value) || 0)}
          className="h-11 min-w-0 flex-1 bg-transparent text-base outline-none"
        />
        {suffix ? <span className="text-xs text-muted-foreground">{suffix}</span> : null}
      </span>
    </label>
  );
}
