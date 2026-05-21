import { createContext, useContext, useState, type ReactNode } from "react";
import { BookingDialog } from "./BookingDialog";
import { ContactDialog } from "./ContactDialog";

type Ctx = {
  openBooking: () => void;
  openContact: () => void;
};

const DialogsContext = createContext<Ctx | null>(null);

export function useDialogs() {
  const ctx = useContext(DialogsContext);
  if (!ctx) throw new Error("useDialogs must be used inside DialogsProvider");
  return ctx;
}

export function DialogsProvider({ children }: { children: ReactNode }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <DialogsContext.Provider
      value={{
        openBooking: () => setBookingOpen(true),
        openContact: () => setContactOpen(true),
      }}
    >
      {children}
      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
    </DialogsContext.Provider>
  );
}
