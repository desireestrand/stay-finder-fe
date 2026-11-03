"use client";

import { useState } from "react";
import type { Booking } from "@/types/booking";
import UserBookingCard from "./UserBookingCard";

interface UserBookingsTabProps {
  bookings: Booking[];
  onCancelBooking: (
    propertyId: string,
    bookingId: string,
  ) => void | Promise<void>;
  onDeleteBooking: (
    propertyId: string,
    bookingId: string,
  ) => void | Promise<void>;
}

export default function UserBookingsTab({
  bookings,
  onCancelBooking,
  onDeleteBooking,
}: UserBookingsTabProps) {
  const [showPastBookings, setShowPastBookings] = useState(false);

  const today = new Date().toLocaleDateString("sv-SE");

  const activeBookings = bookings.filter((b) => b.check_in >= today);
  const pastBookings = bookings
    .filter((b) => b.check_in < today)
    .sort((a, b) => b.check_in.localeCompare(a.check_in));

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-300 py-12 text-center">
        <p className="text-sm font-medium text-zinc-900">
          You have no bookings yet.
        </p>

        <p className="text-xs text-zinc-500">
          When you book a stay, it will appear here.
        </p>
      </div>
    );
  }

  const renderBookingList = (listToRender: Booking[]) => {
    if (listToRender.length === 0) {
      return <p className="text-xs text-zinc-400 italic">No bookings found.</p>;
    }

    return (
      <div className="flex flex-col gap-3">
        {listToRender.map((booking) => (
          <UserBookingCard
            key={booking.booking_id}
            booking={booking}
            onCancelBooking={onCancelBooking}
            onDeleteBooking={onDeleteBooking}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
          Active bookings ({activeBookings.length})
        </h4>

        {renderBookingList(activeBookings)}
      </div>

      <div className="border-t border-zinc-100 pt-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider pt-1">
            Past bookings ({pastBookings.length})
          </h4>

          <button
            type="button"
            onClick={() => setShowPastBookings((prev) => !prev)}
            className="text-xs font-medium text-zinc-600 hover:text-zinc-900 underline transition"
          >
            {showPastBookings ? "Hide past" : "Show past"}
          </button>
        </div>

        {showPastBookings && renderBookingList(pastBookings)}
      </div>
    </div>
  );
}
