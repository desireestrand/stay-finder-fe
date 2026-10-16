"use client";

import { useState } from "react";
import type { BookingDates } from "@/types/booking";

type BookingFormProps = {
  propertyId: string;
  dates?: BookingDates;
  onBookingComplete?: () => void;
};

export default function BookingForm({ propertyId, dates, onBookingComplete }: BookingFormProps) {
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!dates) {
      setError("Please select check-in and check-out dates.");
      return;
    }

    setPending(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/properties/${propertyId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            guest_name: guestName,
            guest_email: guestEmail,
            check_in: dates.check_in,
            check_out: dates.check_out,
            guests,
            status: "pending",
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create booking");
      }

      onBookingComplete?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 text-sm">
        <label>Guest Name</label>
        <input
          type="text"
          required
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <label>Guest Email</label>
        <input
          type="email"
          required
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <label>Number of Guests</label>
        <input
          type="number"
          min={1}
          required
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        {pending ? "Booking..." : "Confirm Booking"}
      </button>
    </form>
  );
}