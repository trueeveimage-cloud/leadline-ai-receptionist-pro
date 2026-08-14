import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  Clock,
  Mail,
  Phone,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";

export type BookingIntent = "demo" | "pilot";
type ContactMethod = "email" | "sms" | "video";
type Step = 0 | 1 | 2;

const schema = z
  .object({
    name: z.string().trim().min(1).max(100),
    company: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(180),
    phone: z.string().trim().min(6).max(32).regex(/^[+0-9\s\-()]+$/),
    industry: z.enum(["vvs", "electrician", "other"]),
    missedCallsPerWeek: z.string().trim().min(1).max(40),
    preferredContactMethod: z.enum(["email", "sms", "video"]),
    requestType: z.enum(["demo", "pilot"]),
    date: z.string().optional().default(""),
    slot: z.string().optional().default(""),
    timezone: z.string().trim().min(1).max(80),
    consent: z.boolean().refine(Boolean),
    website: z.string().max(0),
  })
  .superRefine((value, ctx) => {
    if (value.preferredContactMethod !== "video") return;
    if (!value.date) ctx.addIssue({ code: "custom", path: ["date"], message: "Required" });
    if (!value.slot) ctx.addIssue({ code: "custom", path: ["slot"], message: "Required" });
  });

const slots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

function nextBusinessDays(count: number, locale: string) {
  const out: { value: string; weekday: string; daymonth: string; iso: Date }[] = [];
  const date = new Date();
  while (out.length < count) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day === 0 || day === 6) continue;
    out.push({
      value: date.toISOString().slice(0, 10),
      weekday: date.toLocaleDateString(locale, { weekday: "short" }),
      daymonth: date.toLocaleDateString(locale, { month: "short", day: "numeric" }),
      iso: new Date(date),
    });
  }
  return out;
}

export function BookingDialog({
  open,
  onOpenChange,
  intent,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  intent: BookingIntent;
}) {
  const { t, lang } = useI18n();
  const locale = lang === "sv" ? "sv-SE" : lang === "es" ? "es-ES" : "en-GB";
  const timezone = typeof Intl === "undefined" ? "Europe/Stockholm" : Intl.DateTimeFormat().resolvedOptions().timeZone;
  const dates = useMemo(() => nextBusinessDays(8, locale), [locale]);
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    industry: "vvs" as "vvs" | "electrician" | "other",
    missedCallsPerWeek: "",
    preferredContactMethod: "email" as ContactMethod,
    requestType: intent,
    date: dates[0]?.value ?? "",
    slot: "",
    timezone,
    consent: false,
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: "" }));
    if (submitError) setSubmitError(null);
  };

  const validateStep = (currentStep: Step) => {
    const nextErrors: Record<string, string> = {};
    if (currentStep === 0) {
      if (!form.name.trim()) nextErrors.name = t("booking.required");
      if (!form.company.trim()) nextErrors.company = t("booking.required");
      if (!z.string().email().safeParse(form.email.trim()).success) nextErrors.email = t("booking.invalidEmail");
      if (!/^[+0-9\s\-()]{6,32}$/.test(form.phone.trim())) nextErrors.phone = t("booking.invalidPhone");
    }
    if (currentStep === 1) {
      if (!form.missedCallsPerWeek.trim()) nextErrors.missedCallsPerWeek = t("booking.required");
      if (form.preferredContactMethod === "video") {
        if (!form.date) nextErrors.date = t("booking.required");
        if (!form.slot) nextErrors.slot = t("booking.required");
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((current) => Math.min(2, current + 1) as Step);
  };

  const submit = async () => {
    const parsed = schema.safeParse({ ...form, requestType: intent });
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        nextErrors[String(issue.path[0])] = issue.path[0] === "consent" ? t("booking.required") : issue.message;
      }
      setErrors(nextErrors);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(data?.error || t("booking.error.generic"));
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : t("booking.error.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setForm({
      name: "",
      company: "",
      email: "",
      phone: "",
      industry: "vvs",
      missedCallsPerWeek: "",
      preferredContactMethod: "email",
      requestType: intent,
      date: dates[0]?.value ?? "",
      slot: "",
      timezone,
      consent: false,
      website: "",
    });
    setErrors({});
    setStep(0);
    setSubmitted(false);
    setSubmitting(false);
    setSubmitError(null);
  };

  const selectedDate = dates.find((date) => date.value === form.date);
  const fullDateLabel = selectedDate?.iso.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }) ?? "";
  const industryLabel = t(`booking.industry.${form.industry}` as Parameters<typeof t>[0]);
  const contactLabel = t(`booking.contact.${form.preferredContactMethod}` as Parameters<typeof t>[0]);
  const requestLabel = t(`booking.request.${intent}` as Parameters<typeof t>[0]);
  const stepLabels = [t("booking.step.company"), t("booking.step.needs"), t("booking.step.review")];

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) setTimeout(reset, 250);
      }}
    >
      <DialogContent className="flex max-h-[92vh] w-[calc(100vw-1.5rem)] flex-col gap-0 overflow-hidden rounded-3xl border-border p-0 sm:max-w-[560px]">
        {submitted ? (
          <SuccessState
            name={form.name}
            contactLabel={contactLabel}
            dateLabel={form.preferredContactMethod === "video" ? fullDateLabel : ""}
            slot={form.preferredContactMethod === "video" ? form.slot : ""}
            timezone={timezone}
            onDone={() => onOpenChange(false)}
            t={t}
          />
        ) : (
          <>
            <div className="border-b border-border/60 px-6 pb-5 pt-7 sm:px-8">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <Sparkles className="h-3 w-3 text-brand" />
                <span>{requestLabel}</span>
              </div>
              <DialogTitle className="mt-3 text-[22px] font-semibold leading-tight tracking-tight sm:text-2xl">
                {t("booking.title")}
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {t("booking.subtitle")}
              </DialogDescription>
              <div className="mt-5 flex items-center gap-2">
                {stepLabels.map((label, index) => {
                  const active = step === index;
                  const done = step > index;
                  return (
                    <div key={label} className="flex flex-1 items-center gap-2">
                      <div className={`flex items-center gap-2 ${active || done ? "text-foreground" : "text-muted-foreground"}`}>
                        <div className={`grid h-6 w-6 place-items-center rounded-full border text-[11px] font-semibold ${done ? "border-brand bg-brand text-brand-foreground" : active ? "border-foreground bg-foreground text-background" : "border-border bg-background"}`}>
                          {done ? <Check className="h-3 w-3" /> : index + 1}
                        </div>
                        <span className="hidden text-[11px] font-medium tracking-tight sm:inline">{label}</span>
                      </div>
                      {index < stepLabels.length - 1 && <div className="h-px flex-1 bg-border/80" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              <div className="hidden" aria-hidden="true">
                <Label htmlFor="booking-website">Website</Label>
                <Input id="booking-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website", event.target.value)} />
              </div>
              <AnimatePresence initial={false}>
                {step === 0 && (
                  <motion.div key="company" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="grid gap-5 sm:grid-cols-2">
                    <Field id="booking-name" label={t("booking.name")} error={errors.name}>
                      <Input id="booking-name" value={form.name} onChange={(event) => update("name", event.target.value)} autoComplete="name" className="h-12 rounded-xl" />
                    </Field>
                    <Field id="booking-company" label={t("booking.company")} error={errors.company}>
                      <Input id="booking-company" value={form.company} onChange={(event) => update("company", event.target.value)} autoComplete="organization" className="h-12 rounded-xl" />
                    </Field>
                    <Field id="booking-email" label={t("booking.email")} error={errors.email}>
                      <Input id="booking-email" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} autoComplete="email" className="h-12 rounded-xl" />
                    </Field>
                    <Field id="booking-phone" label={t("booking.phone")} error={errors.phone}>
                      <Input id="booking-phone" value={form.phone} onChange={(event) => update("phone", event.target.value)} inputMode="tel" autoComplete="tel" className="h-12 rounded-xl" />
                    </Field>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div key="needs" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-5">
                    <Field id="booking-industry" label={t("booking.industry")}>
                      <select id="booking-industry" value={form.industry} onChange={(event) => update("industry", event.target.value as typeof form.industry)} className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm">
                        <option value="vvs">{t("booking.industry.vvs")}</option>
                        <option value="electrician">{t("booking.industry.electrician")}</option>
                        <option value="other">{t("booking.industry.other")}</option>
                      </select>
                    </Field>
                    <Field id="booking-missed-calls" label={t("booking.missedCalls")} error={errors.missedCallsPerWeek}>
                      <Input id="booking-missed-calls" value={form.missedCallsPerWeek} onChange={(event) => update("missedCallsPerWeek", event.target.value)} inputMode="numeric" placeholder="5–10" className="h-12 rounded-xl" />
                    </Field>
                    <Field id="booking-contact-method" label={t("booking.contactMethod")}>
                      <select id="booking-contact-method" value={form.preferredContactMethod} onChange={(event) => update("preferredContactMethod", event.target.value as ContactMethod)} className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm">
                        <option value="email">{t("booking.contact.email")}</option>
                        <option value="sms">{t("booking.contact.sms")}</option>
                        <option value="video">{t("booking.contact.video")}</option>
                      </select>
                    </Field>

                    {form.preferredContactMethod === "video" && (
                      <div className="space-y-5 border-t border-border/60 pt-5">
                        <p className="text-sm font-medium">{t("booking.videoHint")}</p>
                        <Section icon={Calendar} title={t("booking.pickDay")} error={errors.date}>
                          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {dates.map((date) => (
                              <button key={date.value} type="button" onClick={() => update("date", date.value)} className={`w-[72px] shrink-0 rounded-2xl border py-3 text-center text-xs ${form.date === date.value ? "border-foreground bg-foreground text-background" : "border-border bg-background"}`}>
                                <span className="block text-[10px] uppercase tracking-wider opacity-70">{date.weekday}</span>
                                <span className="mt-1 block text-base font-semibold tabular-nums">{date.iso.getDate()}</span>
                                <span className="mt-0.5 block text-[10px] capitalize opacity-70">{date.daymonth.replace(/\d+/, "").trim()}</span>
                              </button>
                            ))}
                          </div>
                        </Section>
                        <Section icon={Clock} title={t("booking.pickTime")} error={errors.slot}>
                          <div className="grid grid-cols-4 gap-2">
                            {slots.map((slot) => (
                              <button key={slot} type="button" onClick={() => update("slot", slot)} className={`h-11 rounded-xl border text-[13px] font-medium tabular-nums ${form.slot === slot ? "border-foreground bg-foreground text-background" : "border-border bg-background"}`}>
                                {slot}
                              </button>
                            ))}
                          </div>
                        </Section>
                      </div>
                    )}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="review" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-5">
                    <div className="space-y-3.5 rounded-2xl border border-border bg-surface p-5">
                      <SummaryRow icon={Sparkles} label={requestLabel} value={industryLabel} />
                      <SummaryRow icon={User} label={t("booking.name")} value={form.name} />
                      <SummaryRow icon={Building2} label={t("booking.company")} value={form.company} />
                      <SummaryRow icon={Mail} label={t("booking.email")} value={form.email} />
                      <SummaryRow icon={Phone} label={t("booking.phone")} value={form.phone} />
                      <SummaryRow icon={Phone} label={t("booking.contactMethod")} value={contactLabel} />
                      {form.preferredContactMethod === "video" && <SummaryRow icon={Calendar} label={t("booking.date")} value={`${fullDateLabel} · ${form.slot}`} />}
                    </div>
                    <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                      <input type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} className="mt-1 h-4 w-4 accent-foreground" />
                      <span>{t("booking.privacyConsent")} <a href="/privacy" className="underline hover:text-foreground">{t("booking.privacy")}</a>.</span>
                    </label>
                    {errors.consent && <p className="text-xs text-destructive">{errors.consent}</p>}
                    {submitError && <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-xs text-destructive">{submitError}</div>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-border/60 bg-surface/60 px-6 py-4 sm:px-8">
              <div className="flex items-center gap-3">
                {step > 0 ? (
                  <Button type="button" variant="ghost" size="lg" onClick={() => setStep((current) => Math.max(0, current - 1) as Step)} className="px-4">
                    <ArrowLeft className="h-4 w-4" />{t("booking.back")}
                  </Button>
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><Shield className="h-3 w-3" />{t("booking.private")}</div>
                )}
                <div className="flex-1" />
                {step < 2 ? (
                  <Button type="button" size="lg" variant="brand" onClick={goNext} className="min-w-[140px]">{t("booking.continue")}<ArrowRight className="h-4 w-4" /></Button>
                ) : (
                  <Button type="button" size="lg" variant="brand" onClick={submit} disabled={submitting} className="min-w-[160px]">{submitting ? t("booking.sending") : t("booking.confirm")}</Button>
                )}
              </div>
              {step === 2 && <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">{t("booking.legal")} <a href="/terms" className="underline hover:text-foreground">{t("booking.terms")}</a> {t("booking.and")} <a href="/privacy" className="underline hover:text-foreground">{t("booking.privacy")}</a>.</p>}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SuccessState({ name, contactLabel, dateLabel, slot, timezone, onDone, t }: { name: string; contactLabel: string; dateLabel: string; slot: string; timezone: string; onDone: () => void; t: ReturnType<typeof useI18n>["t"] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="px-6 py-12 text-center sm:px-10">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand text-brand-foreground"><Check className="h-6 w-6" /></div>
      <DialogTitle className="mt-6 text-2xl font-semibold tracking-tight">{t("booking.success.title")}</DialogTitle>
      <DialogDescription className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{t("booking.success.body", { name: name.split(" ")[0] || "" })}</DialogDescription>
      <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-border bg-surface px-5 py-4 text-left">
        <SummaryRow icon={Mail} label={t("booking.contactMethod")} value={contactLabel} />
        {dateLabel && <div className="mt-3"><SummaryRow icon={Calendar} label={t("booking.date")} value={`${dateLabel} · ${slot} · ${timezone}`} /></div>}
      </div>
      <Button variant="brand" size="lg" className="mt-8" onClick={onDone}>{t("booking.done")}</Button>
    </motion.div>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return <div><Label htmlFor={id} className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{label}</Label><div className="mt-2">{children}</div>{error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}</div>;
}

function Section({ icon: Icon, title, error, children }: { icon: typeof Calendar; title: string; error?: string; children: React.ReactNode }) {
  return <div><div className="mb-3 flex items-center gap-2"><Icon className="h-3.5 w-3.5 text-muted-foreground" /><h3 className="text-sm font-semibold tracking-tight">{title}</h3></div>{children}{error && <p className="mt-2 text-xs text-destructive">{error}</p>}</div>;
}

function SummaryRow({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return <div className="flex items-start gap-3"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" /><span className="w-24 shrink-0 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</span><span className="min-w-0 break-words text-sm font-medium text-foreground">{value}</span></div>;
}
