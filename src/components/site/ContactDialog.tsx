import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Check, Send } from "lucide-react";
import { z } from "zod";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CONTACT_EMAIL } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(5).max(2000),
  website: z.string().max(0),
});

export function ContactDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { lang } = useI18n();
  const sv = lang === "sv";
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const reset = () => {
    setForm({ name: "", email: "", message: "", website: "" });
    setErrors({});
    setSent(false);
    setSending(false);
    setServerError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/public/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !json.ok) {
        setServerError(
          sv
            ? "Kunde inte skicka. Försök igen eller mejla oss direkt."
            : "Couldn't send. Please try again or email us directly.",
        );
        setSending(false);
        return;
      }
      setSent(true);
    } catch {
      setServerError(sv ? "Nätverksfel. Försök igen." : "Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setTimeout(reset, 250);
      }}
    >
      <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-[500px] p-0 gap-0 rounded-3xl border-border overflow-hidden">
        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-8 py-12 text-center"
          >
            <div className="mx-auto h-14 w-14 rounded-full bg-brand text-brand-foreground grid place-items-center">
              <Check className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <DialogTitle className="mt-6 text-2xl font-semibold tracking-tight">
              {sv ? "Meddelandet är mottaget" : "Message received"}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground">
              {sv
                ? "Tack. En person återkommer inom en arbetsdag."
                : "Thanks. A real person will reply within one business day."}
            </DialogDescription>
            <Button variant="brand" size="lg" className="mt-8" onClick={() => onOpenChange(false)}>
              {sv ? "Stäng" : "Close"}
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-border/60">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <MessageCircle className="h-3 w-3 text-brand" />
                <span>{sv ? "Svar inom en arbetsdag" : "Reply within one business day"}</span>
              </div>
              <DialogTitle className="mt-3 text-2xl font-semibold tracking-tight">
                {sv ? "Kontakta oss" : "Get in touch"}
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-sm text-muted-foreground">
                {sv
                  ? "Frågor om pris, uppstart eller integrationer? Skriv en rad. En person läser varje meddelande."
                  : "Questions about pricing, setup or integrations? Write us a line. A real person reads every message."}
              </DialogDescription>
            </div>

            <form onSubmit={submit} className="px-6 sm:px-8 py-6 space-y-5">
              <div className="hidden" aria-hidden="true">
                <Label htmlFor="contact-website">Website</Label>
                <Input
                  id="contact-website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setForm((current) => ({ ...current, website: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-medium">
                  {sv ? "Namn" : "Name"}
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Jane Doe"
                  className="h-12 rounded-xl mt-2"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-destructive">
                    {sv ? "Obligatoriskt" : "Required"}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-medium">
                  {sv ? "E-post" : "Email"}
                </Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="anna@foretag.se"
                  className="h-12 rounded-xl mt-2"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">
                    {sv ? "Ange en giltig e-postadress" : "Enter a valid email"}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-medium">
                  {sv ? "Meddelande" : "Message"}
                </Label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder={
                    sv
                      ? "Berätta om samtalsvolymen och vad AI-receptionisten ska hantera…"
                      : "Tell us about your call volume and what the AI should handle…"
                  }
                  rows={5}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-destructive">
                    {sv ? "Berätta lite mer" : "Tell us a bit more"}
                  </p>
                )}
              </div>

              {serverError && <p className="text-xs text-destructive">{serverError}</p>}

              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  variant="brand"
                  className="w-full"
                  disabled={sending}
                >
                  {sending ? (
                    sv ? (
                      "Skickar…"
                    ) : (
                      "Sending…"
                    )
                  ) : (
                    <>
                      {sv ? "Skicka meddelande" : "Send message"}
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              <div className="pt-3 border-t border-border/60">
                <ContactPill icon={Mail} label="E-post" value={CONTACT_EMAIL} />
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ContactPill({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-9 w-9 rounded-xl bg-surface border border-border grid place-items-center">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
        <div className="text-xs font-medium truncate">{value}</div>
      </div>
    </div>
  );
}
