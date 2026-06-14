import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Shield,
  Sparkles,
  Phone,
} from "lucide-react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  company: z.string().trim().min(1, "Required").max(120),
  phone: z
    .string()
    .trim()
    .min(6, "Enter a valid number")
    .max(32)
    .regex(/^[+0-9\s\-()]+$/, "Digits only"),
  date: z.string().min(1, "Pick a date"),
  slot: z.string().min(1, "Pick a slot"),
  timezone: z.string().min(1),
  website: z.string().max(0),
});

const slots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

function nextBusinessDays(count: number, locale: string) {
  const out: { value: string; weekday: string; daymonth: string; iso: Date }[] = [];
  const d = new Date();
  while (out.length < count) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day === 0 || day === 6) continue;
    const value = d.toISOString().slice(0, 10);
    const weekday = d.toLocaleDateString(locale, { weekday: "short" });
    const daymonth = d.toLocaleDateString(locale, { month: "short", day: "numeric" });
    out.push({ value, weekday, daymonth, iso: new Date(d) });
  }
  return out;
}

type Step = 0 | 1 | 2;

const stepMeta: { key: Step; label: string; icon: typeof Calendar }[] = [
  { key: 0, label: "When", icon: Calendar },
  { key: 1, label: "About you", icon: User },
  { key: 2, label: "Review", icon: Check },
];

export function BookingDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { t, lang } = useI18n();
  const locale = lang === "sv" ? "sv-SE" : lang === "es" ? "es-ES" : "en-US";
  const tz =
    typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "UTC";
  const dates = useMemo(() => nextBusinessDays(8, locale), [locale]);

  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    date: dates[0]?.value ?? "",
    slot: "",
    timezone: tz,
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
    if (submitError) setSubmitError(null);
  };

  const validateStep = (s: Step) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.date) e.date = "Pick a date";
      if (!form.slot) e.slot = "Pick a time";
    }
    if (s === 1) {
      if (!form.name.trim()) e.name = "Required";
      if (!form.company.trim()) e.company = "Required";
      if (!/^[+0-9\s\-()]{6,32}$/.test(form.phone.trim())) e.phone = "Enter a valid number";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => (Math.min(2, s + 1) as Step));
  };
  const goBack = () => setStep((s) => (Math.max(0, s - 1) as Step));

  const submit = async () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || `Request failed (${res.status})`);
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : t("booking.error.generic"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setForm({
      name: "",
      company: "",
      phone: "",
      date: dates[0]?.value ?? "",
      slot: "",
      timezone: tz,
      website: "",
    });
    setErrors({});
    setStep(0);
    setSubmitted(false);
    setSubmitting(false);
    setSubmitError(null);
  };

  const selectedDate = dates.find((d) => d.value === form.date);
  const fullDateLabel = selectedDate
    ? selectedDate.iso.toLocaleDateString(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setTimeout(reset, 250);
      }}
    >
      <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-[520px] p-0 gap-0 rounded-3xl border-border max-h-[92vh] overflow-hidden flex flex-col">
        {submitted ? (
          <SuccessState
            name={form.name}
            dateLabel={fullDateLabel}
            slot={form.slot}
            tz={tz}
            onDone={() => onOpenChange(false)}
            t={t}
          />
        ) : (
          <>
            {/* Header */}
            <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-border/60">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <Sparkles className="h-3 w-3 text-brand" />
                <span>Free 15-minute setup call</span>
              </div>
              <DialogTitle className="mt-3 text-[22px] sm:text-2xl font-semibold tracking-tight leading-tight">
                {t("booking.title")}
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                We'll walk through your call volume, pick a voice, and have your AI
                receptionist live within 7 days. No prep, no slides.
              </DialogDescription>

              {/* Stepper */}
              <div className="mt-5 flex items-center gap-2">
                {stepMeta.map((s, i) => {
                  const active = step === s.key;
                  const done = step > s.key;
                  return (
                    <div key={s.key} className="flex items-center gap-2 flex-1">
                      <div
                        className={`flex items-center gap-2 ${
                          active || done ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        <div
                          className={`h-6 w-6 rounded-full grid place-items-center text-[11px] font-semibold border transition-colors ${
                            done
                              ? "bg-brand text-brand-foreground border-brand"
                              : active
                                ? "bg-foreground text-background border-foreground"
                                : "bg-background text-muted-foreground border-border"
                          }`}
                        >
                          {done ? <Check className="h-3 w-3" /> : i + 1}
                        </div>
                        <span className="text-[11px] font-medium tracking-tight hidden sm:inline">
                          {s.label}
                        </span>
                      </div>
                      {i < stepMeta.length - 1 && (
                        <div className="flex-1 h-px bg-border/80" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Body */}
            <div className="px-6 sm:px-8 py-6 overflow-y-auto flex-1">
              <div className="hidden" aria-hidden="true">
                <Label htmlFor="booking-website">Website</Label>
                <Input
                  id="booking-website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(event) => update("website", event.target.value)}
                />
              </div>
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-6"
                  >
                    <Section
                      icon={Calendar}
                      title="Pick a day"
                      description="Weekdays only. Swipe to see more."
                      error={errors.date}
                    >
                      <div className="-mx-1 px-1 flex gap-2 overflow-x-auto snap-x pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {dates.map((d) => {
                          const active = form.date === d.value;
                          return (
                            <button
                              key={d.value}
                              type="button"
                              onClick={() => update("date", d.value)}
                              className={`shrink-0 snap-start w-[72px] py-3 rounded-2xl text-xs border transition-all text-center ${
                                active
                                  ? "bg-foreground text-background border-foreground shadow-sm"
                                  : "bg-background text-foreground border-border hover:border-foreground/40"
                              }`}
                            >
                              <span className="block opacity-70 text-[10px] uppercase tracking-wider">
                                {d.weekday}
                              </span>
                              <span className="block font-semibold text-base mt-1 tabular-nums">
                                {d.iso.getDate()}
                              </span>
                              <span className="block opacity-70 text-[10px] mt-0.5 capitalize">
                                {d.daymonth.replace(/\d+/, "").trim()}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </Section>

                    <Section
                      icon={Clock}
                      title="Pick a time"
                      description={`Local timezone · ${tz}`}
                      error={errors.slot}
                    >
                      <div className="grid grid-cols-4 gap-2">
                        {slots.map((s) => {
                          const active = form.slot === s;
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => update("slot", s)}
                              className={`h-11 rounded-xl text-[13px] font-medium border transition-all tabular-nums ${
                                active
                                  ? "bg-foreground text-background border-foreground shadow-sm"
                                  : "bg-background text-foreground border-border hover:border-foreground/40"
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </Section>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-5"
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Just three details. We'll call you from a Swedish number.
                    </p>
                    <Field label={t("booking.name")} error={errors.name}>
                      <Input
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="Jane Doe"
                        autoComplete="name"
                        className="h-12 rounded-xl"
                      />
                    </Field>
                    <Field label={t("booking.company")} error={errors.company}>
                      <Input
                        value={form.company}
                        onChange={(e) => update("company", e.target.value)}
                        placeholder="Aurora Clinic"
                        autoComplete="organization"
                        className="h-12 rounded-xl"
                      />
                    </Field>
                    <Field label={t("booking.phone")} error={errors.phone}>
                      <Input
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="076 322 44 78"
                        inputMode="tel"
                        autoComplete="tel"
                        className="h-12 rounded-xl"
                      />
                    </Field>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-5"
                  >
                    <div className="rounded-2xl border border-border bg-surface p-5 space-y-3.5">
                      <SummaryRow icon={Calendar} label="Date" value={fullDateLabel} />
                      <SummaryRow icon={Clock} label="Time" value={`${form.slot} · ${tz}`} />
                      <div className="h-px bg-border/60" />
                      <SummaryRow icon={User} label="Name" value={form.name} />
                      <SummaryRow icon={Sparkles} label="Company" value={form.company} />
                      <SummaryRow icon={Phone} label="Phone" value={form.phone} />
                    </div>

                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                      <Reassure>15 minutes, calendar-friendly</Reassure>
                      <Reassure>No sales pressure — outcomes only</Reassure>
                      <Reassure>You'll get a written summary the same day</Reassure>
                    </ul>

                    {submitError && (
                      <div
                        role="alert"
                        className="rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-xs text-destructive"
                      >
                        {submitError}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 sm:px-8 py-4 border-t border-border/60 bg-surface/60">
              <div className="flex items-center gap-3">
                {step > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={goBack}
                    className="px-4"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <Shield className="h-3 w-3" />
                    GDPR-safe · never shared
                  </div>
                )}
                <div className="flex-1" />
                {step < 2 ? (
                  <Button
                    type="button"
                    size="lg"
                    variant="brand"
                    onClick={goNext}
                    className="min-w-[140px]"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="lg"
                    variant="brand"
                    onClick={submit}
                    disabled={submitting}
                    className="min-w-[160px]"
                  >
                    {submitting ? t("booking.sending") : "Confirm booking"}
                  </Button>
                )}
              </div>
              {step === 2 && (
                <p className="mt-3 text-[11px] text-muted-foreground text-center leading-relaxed">
                  {t("booking.legal")}{" "}
                  <a href="/terms" className="underline hover:text-foreground">
                    {t("booking.terms")}
                  </a>{" "}
                  {t("booking.and")}{" "}
                  <a href="/privacy" className="underline hover:text-foreground">
                    {t("booking.privacy")}
                  </a>
                  .
                </p>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SuccessState({
  name,
  dateLabel,
  slot,
  tz,
  onDone,
  t,
}: {
  name: string;
  dateLabel: string;
  slot: string;
  tz: string;
  onDone: () => void;
  t: ReturnType<typeof useI18n>["t"];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="px-6 sm:px-10 py-12 text-center"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 18 }}
        className="mx-auto h-14 w-14 rounded-full bg-brand text-brand-foreground grid place-items-center shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]"
      >
        <Check className="h-6 w-6" strokeWidth={2.5} />
      </motion.div>
      <DialogTitle className="mt-6 text-2xl font-semibold tracking-tight">
        {t("booking.success.title")}
      </DialogTitle>
      <DialogDescription className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
        {t("booking.success.body", { name: name.split(" ")[0] || "" })} We'll send a
        calendar invite within the next few minutes.
      </DialogDescription>

      <div className="mt-6 mx-auto max-w-xs rounded-2xl border border-border bg-surface px-5 py-4 text-left space-y-2">
        <div className="flex items-center gap-2.5 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium capitalize">{dateLabel}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium tabular-nums">
            {slot} · {tz}
          </span>
        </div>
      </div>

      <Button variant="brand" size="lg" className="mt-8" onClick={onDone}>
        {t("booking.done")}
      </Button>
    </motion.div>
  );
}

function Section({
  icon: Icon,
  title,
  description,
  error,
  children,
}: {
  icon: typeof Calendar;
  title: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        </div>
        {description && (
          <p className="text-[11px] text-muted-foreground text-right">{description}</p>
        )}
      </div>
      {children}
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-medium">
        {label}
      </Label>
      <div className="mt-2">{children}</div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground w-20 shrink-0">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground truncate capitalize">
        {value}
      </span>
    </div>
  );
}

function Reassure({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <Check className="h-4 w-4 text-brand mt-0.5 shrink-0" />
      <span>{children}</span>
    </li>
  );
}
