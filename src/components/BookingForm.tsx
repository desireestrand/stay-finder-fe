"use client";

import { useState } from "react";
import { SubmitEvent } from "react";
import type { BookingDates, Booking } from "@/types/booking";
import ErrorMessage from "@/components/ErrorMessage";

type BookingFormProps = {
  propertyId?: string;
  bookingId?: string;
  initialData?: Booking;
  dates?: BookingDates;
  onBookingComplete?: () => void;
  action?: (data: {
    check_in?: string;
    check_out?: string;
    guests?: number;
    guest_name?: string;
    guest_email?: string;
  }) => Promise<{ error?: string; success?: boolean }>;
};

export default function BookingForm({
  propertyId,
  bookingId,
  initialData,
  dates,
  onBookingComplete,
  action,
}: BookingFormProps) {
  const [guestName, setGuestName] = useState(initialData?.guest_name || "");
  const [guestEmail, setGuestEmail] = useState(initialData?.guest_email || "");
  const [guests, setGuests] = useState(initialData?.guests || 1);

  const [checkIn, setCheckIn] = useState(
    initialData?.check_in || dates?.check_in || "",
  );
  const [checkOut, setCheckOut] = useState(
    initialData?.check_out || dates?.check_out || "",
  );

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates.");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    setPending(true);
    setError(null);

    try {
      if (action) {
        const result = await action({
          guest_name: guestName,
          guest_email: guestEmail,
          check_in: checkIn,
          check_out: checkOut,
          guests,
        });

        if (result?.error) {
          throw new Error(result.error);
        }
      } else {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/properties/${propertyId}`;

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            guest_name: guestName,
            guest_email: guestEmail,
            check_in: checkIn,
            check_out: checkOut,
            guests,
            status: "pending",
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(
            data.message || data.error || "Failed to create booking",
          );
        }
      }

      onBookingComplete?.();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 text-sm">
        <label className="font-medium text-zinc-700 dark:text-zinc-300">
          Guest Name
        </label>

        <input
          type="text"
          required
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        />
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <label className="font-medium text-zinc-700 dark:text-zinc-300">
          Guest Email
        </label>

        <input
          type="email"
          required
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 text-sm">
          <label className="font-medium text-zinc-700 dark:text-zinc-300">
            Check-in
          </label>

          <input
            type="date"
            required
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>

        <div className="flex flex-col gap-1 text-sm">
          <label className="font-medium text-zinc-700 dark:text-zinc-300">
            Check-out
          </label>

          <input
            type="date"
            required
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <label className="font-medium text-zinc-700 dark:text-zinc-300">
          Number of Guests
        </label>
        
        <input
          type="number"
          min={1}
          required
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        />
      </div>

      <ErrorMessage message={error} />

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? "Saving..." : bookingId ? "Save Changes" : "Confirm Booking"}
      </button>
    </form>
  );
}
