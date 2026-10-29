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

  const [showPastBookings, setShowPastBookings] = useState(false);

  const today = new Date().toLocaleDateString("sv-SE");

  const activeBookings = bookings.filter((b) => b.check_in >= today);
  const pastBookings = bookings
    .filter((b) => b.check_in < today)
    .sort((a, b) => b.check_in.localeCompare(a.check_in));

  function handleConfirmAction() {
    if (!selectedBooking) return;

    if (selectedBooking.action === "cancel") {
      onUpdateBookingStatus(propertyId, selectedBooking.id, "cancelled");
    } else if (selectedBooking.action === "delete") {
      onDeleteBooking(propertyId, selectedBooking.id);
    }
    setSelectedBooking(null);
  }

  const renderBookingList = (listToRender: Booking[]) => {
    if (listToRender.length === 0) {
      return (
        <p className="text-xs text-zinc-400 italic">No reservations found.</p>
      );
    }

    return (
      <div className="flex flex-col gap-2.5">
        {listToRender.map((booking) => {
          const isPastBooking = booking.check_in < today;

          const showButtons =
            (!isPastBooking && booking.status === "pending") ||
            (!isPastBooking && booking.status !== "cancelled") ||
            booking.status === "cancelled";

          return (
            <div
              key={booking.booking_id}
              className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-zinc-50 p-4 rounded-xl text-xs border border-zinc-100"
            >
              <div>
                <p className="font-semibold text-zinc-900">
                  {booking.guest_name}{" "}
                  <span className="font-normal text-zinc-500">
                    ({booking.guest_email})
                  </span>
                </p>

                <p className="text-zinc-500 mt-0.5">
                  {booking.check_in} → {booking.check_out}
                </p>

                <p className="text-zinc-500 mt-0.5">
                  {booking.guests} {booking.guests === 1 ? "guest" : "guests"} •
                  Total price:{" "}
                  <span className="font-semibold text-zinc-900">
                    {booking.total_price} SEK
                  </span>{" "}
                </p>

                <p className="text-zinc-500 mt-0.5">
                  Status:{" "}
                  <span className="font-semibold capitalize text-zinc-700">
                    {booking.status}
                  </span>
                </p>
              </div>

              {showButtons && (
                <div className="flex w-full lg:w-auto gap-2.5 items-center justify-between lg:justify-end border-t lg:border-t-0 border-zinc-100 shrink-0">
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
                      className="flex-1 lg:flex-none text-center rounded-lg bg-green-600 px-4 py-2.5 lg:py-2 text-xs font-medium text-white hover:bg-green-700 transition"
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
                      className="flex-1 lg:flex-none text-center rounded-lg bg-zinc-200 px-4 py-2.5 lg:py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-300 transition"
                    >
                      Cancel
                    </button>
                  )}

                  {!isPastBooking && booking.status === "cancelled" && (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedBooking({
                          id: booking.booking_id,
                          action: "delete",
                        })
                      }
                      className="flex-1 lg:flex-none text-center rounded-lg bg-red-50 px-4 py-2.5 lg:py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="border-t border-zinc-100 pt-4 mt-2 flex flex-col gap-6">
        <div>
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Incoming reservations ({activeBookings.length})
          </h4>
          {renderBookingList(activeBookings)}
        </div>

        <div className="border-t border-zinc-100 pt-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Past reservations ({pastBookings.length})
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

      <ConfirmModal
        isOpen={selectedBooking !== null}
        title={
          selectedBooking?.action === "cancel"
            ? "Cancel reservation"
            : "Delete booking"
        }
        description={
          selectedBooking?.action === "cancel"
            ? "Are you sure you want to cancel this guest's reservation?"
            : "Are you sure you want to delete this booking record?"
        }
        confirmText={
          selectedBooking?.action === "cancel" ? "Confirm cancel" : "Delete"
        }
        cancelText="Cancel"
        variant={selectedBooking?.action === "delete" ? "danger" : "default"}
        onConfirm={handleConfirmAction}
        onClose={() => setSelectedBooking(null)}
      />
    </>
  );
}
