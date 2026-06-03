import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
      <DialogContent className="max-w-md p-0 overflow-hidden bg-background border-border max-h-[88vh] flex flex-col gap-0">
        <DialogHeader className="px-4 pt-4 pb-2 space-y-1.5">
          <div className="flex items-center justify-between gap-2 pr-6">
            <DialogTitle className="text-sm font-light tracking-tight">
              Talk to the AI receptionist
            </DialogTitle>
            <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] text-muted-foreground border border-border/70 px-2 py-0.5">
              <span className="h-1 w-1 rounded-full bg-brand" />
              EN demo
            </span>
          </div>
          <DialogDescription className="text-[10.5px] text-muted-foreground leading-relaxed">
            English only. Production agents run in your language. Allow mic when prompted.
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 flex items-center justify-between gap-2 py-2 border-y border-border/60">
          <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className={`h-1 w-1 rounded-full ${phase === "calling" ? "bg-brand animate-pulse" : "bg-muted-foreground/40"}`} />
            {phase === "calling" ? "Live" : phase === "ended" ? "Ended" : "Idle"}
            <span className="tabular-nums normal-case tracking-normal ml-1">{mm}:{ss}</span>
          </div>
          {phase === "calling" ? (
            <button
              onClick={endCall}
              className="text-[9px] uppercase tracking-[0.25em] text-foreground hover:opacity-70 transition-opacity"
            >
              End call
            </button>
          ) : (
            <button
              onClick={reset}
              className="text-[9px] uppercase tracking-[0.25em] text-foreground hover:opacity-70 transition-opacity"
            >
              Restart
            </button>
          )}
        </div>

        <div className="relative w-full flex-1 min-h-[300px] md:min-h-[380px] bg-background overflow-hidden">
          {phase !== "ended" && open && (
            <iframe
              src={RETELL_ORB_URL}
              title="Leadmap AI receptionist demo"
              allow="microphone; autoplay; clipboard-write"
              className="absolute inset-0 w-full h-full border-0"
            />
          )}
          {phase === "ended" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 py-8">
              <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                Call ended · {mm}:{ss}
              </span>
              <p className="text-sm font-light text-foreground max-w-[28ch] leading-relaxed">
                In production, every call is transcribed and a qualified summary is sent to the
                owner within seconds.
              </p>
              <button
                onClick={reset}
                className="mt-6 text-[10px] uppercase tracking-[0.3em] text-foreground border border-border/70 px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
