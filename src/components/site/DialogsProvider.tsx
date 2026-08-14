import { createContext, useContext, useState, type ReactNode } from "react";
import { BookingDialog, type BookingIntent } from "./BookingDialog";
import { ContactDialog } from "./ContactDialog";
import { TestAIDialog } from "./TestAIDialog";

type Ctx = {
  openBooking: (intent?: BookingIntent) => void;
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
  const [bookingIntent, setBookingIntent] = useState<BookingIntent>("demo");
  const [contactOpen, setContactOpen] = useState(false);
  const [testAIOpen, setTestAIOpen] = useState(false);

  return (
    <DialogsContext.Provider
      value={{
        openBooking: (intent = "demo") => {
          setBookingIntent(intent);
          setBookingOpen(true);
        },
        openContact: () => setContactOpen(true),
        openTestAI: () => setTestAIOpen(true),
      }}
    >
      {children}
      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} intent={bookingIntent} />
      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
      <TestAIDialog open={testAIOpen} onOpenChange={setTestAIOpen} />
    </DialogsContext.Provider>
  );
}
