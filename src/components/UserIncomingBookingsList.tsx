import type { Booking } from "@/types/booking";

interface UserIncomingBookingsListProps {
  bookings: Booking[];
  propertyId: string;
  onUpdateBookingStatus: (
    propertyId: string,
    bookingId: string,
    status: "confirmed" | "cancelled",
  ) => void;
  onDeleteBooking: (propertyId: string, bookingId: string) => void;
}

export default function UserIncomingBookingsList({
  bookings,
  propertyId,
  onUpdateBookingStatus,
  onDeleteBooking,
}: UserIncomingBookingsListProps) {
  return (
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
          {bookings.map((booking) => (
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
                  guests) • Status:{" "}
                  <span className="font-semibold capitalize text-zinc-700 dark:text-zinc-300">
                    {booking.status}
                  </span>
                </p>
              </div>

              <div className="flex gap-2 items-center">
                {booking.status === "pending" && (
                  <button
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

                {booking.status !== "cancelled" && (
                  <button
                    onClick={() =>
                      onUpdateBookingStatus(
                        propertyId,
                        booking.booking_id,
                        "cancelled",
                      )
                    }
                    className="rounded-lg bg-zinc-200 dark:bg-zinc-700 px-3 py-1.5 text-zinc-800 dark:text-zinc-200 font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
                  >
                    Cancel
                  </button>
                )}

                {booking.status === "cancelled" && (
                  <button
                    onClick={() =>
                      onDeleteBooking(propertyId, booking.booking_id)
                    }
                    className="rounded-lg bg-red-50 dark:bg-red-950/50 px-3 py-1.5 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}