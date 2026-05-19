import { createContext, useContext, useState, type ReactNode } from "react";
import { BookingDialog } from "./BookingDialog";

type Ctx = {
  openBooking: () => void;
};

const DialogsContext = createContext<Ctx | null>(null);

export function useDialogs() {
  const ctx = useContext(DialogsContext);
  if (!ctx) throw new Error("useDialogs must be used inside DialogsProvider");
  return ctx;
}

export function DialogsProvider({ children }: { children: ReactNode }) {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <DialogsContext.Provider value={{ openBooking: () => setBookingOpen(true) }}>
      {children}
      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
    </DialogsContext.Provider>
  );
}
