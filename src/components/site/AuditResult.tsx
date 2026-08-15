import { useState } from "react";
import { ArrowRight, Check, ClipboardCheck, Droplets, PhoneCall, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialogs } from "@/components/site/DialogsProvider";

export function AuditResult({
  businessName,
  ownerName,
  contact,
}: {
  businessName: string;
  ownerName: string;
  contact: string;
}) {
  const { openBooking } = useDialogs();
  const [isVvsCompany, setIsVvsCompany] = useState(false);
  const [isDecisionMaker, setIsDecisionMaker] = useState(false);
  const [hasMissedCallNeed, setHasMissedCallNeed] = useState(false);
  const qualified = isVvsCompany && isDecisionMaker && hasMissedCallNeed;
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim());

  return (
    <div
      className="border border-border bg-card p-5 shadow-2xl shadow-foreground/5 md:p-8"
      role="status"
    >
      <div className="flex items-start gap-3 border-b border-border/70 pb-5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground">
          <Check className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Audit klar
          </p>
          <h2 className="mt-1 text-2xl font-light">
            Ett säkert första VVS-flöde för {businessName}.
          </h2>
        </div>
      </div>

      <div className="mt-6 grid gap-2">
        {[
          [PhoneCall, "1. Svara", "Presentera AI:n och fråga vad ärendet gäller."],
          [Droplets, "2. Bedöm", "Kontrollera läcka, avstängning, plats och brådska."],
          [ClipboardCheck, "3. Samla", "Namn, telefon, adress och önskad återkoppling."],
          [ShieldCheck, "4. Lämna över", "Skicka ett tydligt underlag utan att lova en bokning."],
        ].map(([Icon, title, body]) => {
          const StepIcon = Icon as typeof PhoneCall;
          return (
            <div
              key={String(title)}
              className="flex gap-3 border border-border/70 bg-background p-3.5"
            >
              <StepIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <div>
                <p className="text-sm font-semibold">{String(title)}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {String(body)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-l-2 border-brand bg-background p-4">
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Exempel på överlämning · syntetiska uppgifter
        </p>
        <p className="mt-2 text-sm font-semibold">Brådskande återkoppling · vattenläcka</p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Vattnet är avstängt. Kund i Solna vill bli uppringd snarast. Leadmap har inte lovat en
          bokad tid.
        </p>
      </div>

      <div className="mt-7">
        <p className="text-sm font-semibold">Kvalificera en 30-minuters demo</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Tider visas bara när alla kriterier är uppfyllda.
        </p>
        <div className="mt-4 space-y-3">
          <CheckRow
            checked={isVvsCompany}
            onChange={setIsVvsCompany}
            label="Företaget utför VVS-arbeten i Sverige"
          />
          <CheckRow
            checked={isDecisionMaker}
            onChange={setIsDecisionMaker}
            label="Jag kan påverka beslut om telefoni eller kundflöde"
          />
          <CheckRow
            checked={hasMissedCallNeed}
            onChange={setHasMissedCallNeed}
            label="Vi vill fånga missade samtal eller samtal efter stängning"
          />
        </div>
        <Button
          type="button"
          variant="brand"
          size="lg"
          disabled={!qualified}
          className="mt-5 w-full rounded-none"
          onClick={() =>
            openBooking({
              name: ownerName,
              company: businessName,
              email: isEmail ? contact : "",
              phone: isEmail ? "" : contact,
              isVvsCompany,
              isDecisionMaker,
              hasMissedCallNeed,
            })
          }
        >
          Visa bekräftade mötestider <ArrowRight className="h-4 w-4" />
        </Button>
        {!isEmail && qualified ? (
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            En e-postadress behövs i nästa steg för kalenderinbjudan och Google Meet-länken.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function CheckRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 accent-[var(--brand)]"
      />
      <span>{label}</span>
    </label>
  );
}
