"use client";

import { useState } from "react";
import type { Booking, BookingStatus } from "@/types/booking";
import ConfirmModal from "./ConfirmModal";

interface UserIncomingBookingsListProps {
  bookings: Booking[];
  propertyId: string;
  onUpdateBookingStatus: (
    propertyId: string,
    bookingId: string,
    status: BookingStatus,
  ) => void;
  onDeleteBooking: (propertyId: string, bookingId: string) => void;
}

export default function UserIncomingBookingsList({
  bookings,
  propertyId,
  onUpdateBookingStatus,
  onDeleteBooking,
}: UserIncomingBookingsListProps) {
  const [selectedBooking, setSelectedBooking] = useState<{
    id: string;
    action: "cancel" | "delete";
  } | null>(null);

  const today = new Date().toLocaleDateString("sv-SE");

  function handleConfirmAction() {
    if (!selectedBooking) return;

    if (selectedBooking.action === "cancel") {
      onUpdateBookingStatus(propertyId, selectedBooking.id, "cancelled");
    } else if (selectedBooking.action === "delete") {
      onDeleteBooking(propertyId, selectedBooking.id);
    }
    setSelectedBooking(null);
  }

  return (
    <>
      <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-2">
        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 dark:text-zinc-400">
          Incoming Reservations ({bookings.length})
        </h4>

        {bookings.length === 0 ? (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">
            No reservations for this property yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {bookings.map((booking) => {
              const isPastBooking = booking.check_in < today;

              return (
                <div
                  key={booking.booking_id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-xl text-xs border border-zinc-100 dark:border-zinc-800"
                >
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {booking.guest_name}{" "}
                      <span className="font-normal text-zinc-500 dark:text-zinc-400">
                        ({booking.guest_email})
                      </span>
                    </p>

                    <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {booking.check_in} → {booking.check_out} ({booking.guests}{" "}
                      {booking.guests === 1 ? "guest" : "guests"}) •{" "}
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {booking.total_price} SEK
                      </span>{" "}
                      • Status:{" "}
                      <span className="font-semibold capitalize text-zinc-700 dark:text-zinc-300">
                        {booking.status}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-2 items-center">
                    {!isPastBooking && booking.status === "pending" && (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateBookingStatus(
                            propertyId,
                            booking.booking_id,
                            "confirmed",
                          )
                        }
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-white font-medium hover:bg-emerald-700 transition shadow-sm"
                      >
                        Confirm
                      </button>
                    )}

                    {!isPastBooking && booking.status !== "cancelled" && (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedBooking({
                            id: booking.booking_id,
                            action: "cancel",
                          })
                        }
                        className="rounded-lg bg-zinc-200 dark:bg-zinc-700 px-3 py-1.5 text-zinc-800 dark:text-zinc-200 font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
                      >
                        Cancel
                      </button>
                    )}

                    {booking.status === "cancelled" && (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedBooking({
                            id: booking.booking_id,
                            action: "delete",
                          })
                        }
                        className="rounded-lg bg-red-50 dark:bg-red-950/50 px-3 py-1.5 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={selectedBooking !== null}
        title={
          selectedBooking?.action === "cancel"
            ? "Cancel Reservation"
            : "Delete Booking"
        }
        description={
          selectedBooking?.action === "cancel"
            ? "Are you sure you want to cancel this guest's reservation?"
            : "Are you sure you want to delete this booking record?"
        }
        confirmText={
          selectedBooking?.action === "cancel" ? "Confirm Cancel" : "Delete"
        }
        cancelText="Cancel"
        variant={selectedBooking?.action === "delete" ? "danger" : "default"}
        onConfirm={handleConfirmAction}
        onClose={() => setSelectedBooking(null)}
      />
    </>
  );
}
