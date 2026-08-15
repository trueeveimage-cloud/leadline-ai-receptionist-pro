import { createContext, useContext, useState, type ReactNode } from "react";
import { BookingDialog, type BookingPrefill } from "./BookingDialog";
import { ContactDialog } from "./ContactDialog";
import { TestAIDialog } from "./TestAIDialog";
import { captureMarketingAttribution, recordMarketingEvent } from "@/lib/marketing";

type Ctx = {
  openBooking: (prefill?: BookingPrefill) => void;
  openContact: () => void;
  openTestAI: () => void;
};

const DialogsContext = createContext<Ctx | null>(null);

export function useDialogs() {
  const ctx = useContext(DialogsContext);
  if (!ctx) throw new Error("useDialogs must be used inside DialogsProvider");
  return ctx;
}

export function DialogsProvider({ children }: { children: ReactNode }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingPrefill, setBookingPrefill] = useState<BookingPrefill | undefined>();
  const [contactOpen, setContactOpen] = useState(false);
  const [testAIOpen, setTestAIOpen] = useState(false);

  const openBooking = (prefill?: BookingPrefill) => {
    recordMarketingEvent("demo_open", {
      attribution: captureMarketingAttribution({ cta_variant: "book_demo" }),
    });
    setBookingPrefill(prefill);
    setBookingOpen(true);
  };

  return (
    <DialogsContext.Provider
      value={{
        openBooking,
        openContact: () => setContactOpen(true),
        openTestAI: () => {
          recordMarketingEvent("demo_open", {
            attribution: captureMarketingAttribution({ cta_variant: "voice_demo", niche: "vvs" }),
          });
          setTestAIOpen(true);
        },
      }}
    >
      {children}
      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} prefill={bookingPrefill} />
      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
      <TestAIDialog open={testAIOpen} onOpenChange={setTestAIOpen} />
    </DialogsContext.Provider>
  );
}
