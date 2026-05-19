import { createContext, useContext, useState, type ReactNode } from "react";
import { CallDemoDialog } from "./CallDemoDialog";
import { BookingDialog } from "./BookingDialog";

type Ctx = {
  openCallDemo: () => void;
  openBooking: () => void;
};

const DialogsContext = createContext<Ctx | null>(null);

export function useDialogs() {
  const ctx = useContext(DialogsContext);
  if (!ctx) throw new Error("useDialogs must be used inside DialogsProvider");
  return ctx;
}

export function DialogsProvider({ children }: { children: ReactNode }) {
  const [callOpen, setCallOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <DialogsContext.Provider
      value={{
        openCallDemo: () => setCallOpen(true),
        openBooking: () => setBookingOpen(true),
      }}
    >
      {children}
      <CallDemoDialog open={callOpen} onOpenChange={setCallOpen} />
      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
    </DialogsContext.Provider>
  );
}
