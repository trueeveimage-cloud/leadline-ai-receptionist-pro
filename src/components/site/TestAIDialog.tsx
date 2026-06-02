import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const RETELL_ORB_URL =
  "https://agent.retellai.com/orb/agent_3b81fadcba03101e07cb4911e6?token=e5cd68c4559382a072c5483135d4dc83";

export function TestAIDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-background border-border">
        <DialogHeader className="px-6 pt-6 pb-3">
          <DialogTitle className="text-lg font-light tracking-tight">
            Talk to the AI receptionist
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Allow microphone access when prompted. The call runs live in your browser.
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-full h-[520px] bg-background">
          {open && (
            <iframe
              src={RETELL_ORB_URL}
              title="Leadmap AI receptionist demo"
              allow="microphone; autoplay; clipboard-write"
              className="absolute inset-0 w-full h-full border-0"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
