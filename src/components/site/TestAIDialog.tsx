import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle2, CalendarCheck, Mail, Sparkles } from "lucide-react";

const RETELL_ORB_URL =
  "https://agent.retellai.com/orb/agent_3b81fadcba03101e07cb4911e6?token=e5cd68c4559382a072c5483135d4dc83";

type Phase = "idle" | "calling" | "ended";

export function TestAIDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(0);
  const tickRef = useRef<number | null>(null);

  // When dialog opens, treat it as a "live call" session and start a soft timer.
  useEffect(() => {
    if (!open) return;
    setPhase("calling");
    setSeconds(0);
    tickRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [open]);

  const endCall = () => {
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
    setPhase("ended");
  };

  const reset = () => {
    setPhase("calling");
    setSeconds(0);
    if (tickRef.current) window.clearInterval(tickRef.current);
    tickRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-background border-border max-h-[92vh] flex flex-col">
        <DialogHeader className="px-5 md:px-7 pt-5 md:pt-6 pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <DialogTitle className="text-base md:text-lg font-light tracking-tight">
              Talk to the AI receptionist
            </DialogTitle>
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground border border-border/70 px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              English demo
            </span>
          </div>
          <DialogDescription className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">
            This live demo speaks <span className="text-foreground">English only</span>. Production
            receptionists run in Swedish, Spanish, German and more. Allow microphone access when
            prompted.
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 md:px-7 flex items-center justify-between gap-3 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className={`h-1.5 w-1.5 rounded-full ${phase === "calling" ? "bg-brand animate-pulse" : "bg-muted-foreground/40"}`} />
            {phase === "calling" ? "Live call" : phase === "ended" ? "Call ended" : "Idle"}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] tabular-nums text-muted-foreground">{mm}:{ss}</span>
            {phase === "calling" ? (
              <button
                onClick={endCall}
                className="text-[10px] uppercase tracking-[0.3em] text-foreground hover:opacity-70 transition-opacity"
              >
                End & view summary
              </button>
            ) : (
              <button
                onClick={reset}
                className="text-[10px] uppercase tracking-[0.3em] text-foreground hover:opacity-70 transition-opacity"
              >
                Restart
              </button>
            )}
          </div>
        </div>

        <div className="relative w-full flex-1 min-h-[340px] md:min-h-[460px] bg-background overflow-y-auto">
          {phase !== "ended" && open && (
            <iframe
              src={RETELL_ORB_URL}
              title="Leadmap AI receptionist demo"
              allow="microphone; autoplay; clipboard-write"
              className="absolute inset-0 w-full h-full border-0"
            />
          )}
          {phase === "ended" && (
            <div className="p-5 md:p-7 space-y-5">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-px w-6 bg-foreground/30" />
                  <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                    Transcript · sample
                  </span>
                </div>
                <div className="space-y-2.5 text-[13px] leading-relaxed border-l border-border/70 pl-4">
                  <p><span className="text-muted-foreground text-[10px] uppercase tracking-[0.3em] mr-2">AI</span>Thanks for calling Leadmap — this is Ada. How can I help?</p>
                  <p><span className="text-muted-foreground text-[10px] uppercase tracking-[0.3em] mr-2">You</span>I'd like a quote for a kitchen leak.</p>
                  <p><span className="text-muted-foreground text-[10px] uppercase tracking-[0.3em] mr-2">AI</span>Got it. Could I take your postcode and the best number to reach you?</p>
                  <p><span className="text-muted-foreground text-[10px] uppercase tracking-[0.3em] mr-2">You</span>Sure — SE1 2AB, 555 0143.</p>
                  <p><span className="text-muted-foreground text-[10px] uppercase tracking-[0.3em] mr-2">AI</span>Perfect. I'll send this to the owner for confirmation and they'll be in touch shortly.</p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-px w-6 bg-foreground/30" />
                  <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                    Owner summary
                  </span>
                </div>
                <div className="border border-border/70 p-4 md:p-5 space-y-3 text-[13px]">
                  <SummaryRow icon={Sparkles} label="Intent" value="Kitchen leak — quote requested" />
                  <SummaryRow icon={CheckCircle2} label="Qualified" value="High intent · urgent" />
                  <SummaryRow icon={CalendarCheck} label="Preferred slot" value="Tomorrow AM" />
                  <SummaryRow icon={Mail} label="Sent to" value="owner@yourbusiness.com" />
                </div>
                <p className="mt-3 text-[10.5px] uppercase tracking-[0.3em] text-muted-foreground">
                  Qualified booking request · sent to owner for confirmation
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-3.5 w-3.5 mt-0.5 text-foreground/60 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
        <div className="text-foreground leading-snug">{value}</div>
      </div>
    </div>
  );
}
