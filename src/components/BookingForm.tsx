"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import type { BookingDates, Booking, NewBooking } from "@/types/booking";
import { createBooking } from "@/utils/bookingService";
import ErrorMessage from "@/components/ErrorMessage";

interface BookingFormProps {
  propertyId?: string;
  bookingId?: string;
  pricePerNight?: number;
  initialData?: Booking;
  dates?: BookingDates;
  onBookingComplete?: () => void;
  onSubmit?: (
    data: Partial<NewBooking>,
  ) => Promise<{ error?: string; success?: boolean }>;
}

export default function BookingForm({
  propertyId,
  bookingId,
  pricePerNight,
  initialData,
  dates,
  onBookingComplete,
  onSubmit,
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

  const today = new Date().toLocaleDateString("sv-SE");

  const calculateNights = (checkInStr: string, checkOutStr: string) => {
    if (!checkInStr || !checkOutStr) return 0;

    const start = new Date(checkInStr);
    const end = new Date(checkOutStr);

    const diffTime = end.getTime() - start.getTime();

    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  const nights = calculateNights(checkIn, checkOut);
  const totalPrice = pricePerNight ? nights * pricePerNight : 0;

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setError(null);

    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setError("Check-out date must be after check-in date");
      return;
    }

    if (guests < 1) {
      setError("Number of guests must be at least 1");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setPending(true);

    try {
      if (onSubmit) {
        const result = await onSubmit({
          guest_name: guestName,
          guest_email: guestEmail,
          check_in: checkIn,
          check_out: checkOut,
          guests,
        });

        if (result?.error) {
          throw new Error(result.error);
        }
      } else if (propertyId) {
        await createBooking(propertyId, {
          guest_name: guestName,
          guest_email: guestEmail,
          check_in: checkIn,
          check_out: checkOut,
          guests,
          status: "pending",
        });
      }

      onBookingComplete?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to process booking";
      setError(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 text-sm">
        <label className="font-medium text-zinc-700 dark:text-zinc-300">
          Guest name
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
          Guest email
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
            min={today}
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
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <label className="font-medium text-zinc-700 dark:text-zinc-300">
          Number of guests
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

      {nights > 0 && pricePerNight && (
        <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900 text-sm space-y-2 border border-zinc-200 dark:border-zinc-800">
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <span>
              {pricePerNight} SEK × {nights} {nights === 1 ? "night" : "nights"}
            </span>
            <span>{nights * pricePerNight} SEK</span>
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 flex justify-between font-semibold text-zinc-900 dark:text-zinc-100">
            <span>Total price</span>
            <span>{totalPrice} SEK</span>
          </div>
        </div>
      )}

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
