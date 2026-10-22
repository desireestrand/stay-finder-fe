import type { Booking } from "@/types/booking";
import Link from "next/link";
import T from "./typography";

interface UserBookingCardProps {
  booking: Booking;
  onCancelBooking: (propertyId: string, bookingId: string) => void;
  onDeleteBooking: (propertyId: string, bookingId: string) => void;
}

export default function UserBookingCard({
  booking,
  onCancelBooking,
  onDeleteBooking,
}: UserBookingCardProps) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="flex flex-col gap-1">
        <T.Header size="sm">
          Booking at Property #{booking.property_id.slice(0, 8)}
        </T.Header>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {booking.check_in} → {booking.check_out}
        </p>

        <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-0.5">
          Status:{" "}
          <span className="capitalize font-semibold">{booking.status}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Link
          href={`/properties/${booking.property_id}`}
          className="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition"
        >
          View property
        </Link>

        {booking.status !== "cancelled" && (
          <>
            <Link
              href={`/properties/${booking.property_id}/bookings/${booking.booking_id}/edit`}
              className="rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
            >
              Edit
            </Link>

            <button
              onClick={() =>
                onCancelBooking(booking.property_id, booking.booking_id)
              }
              className="rounded-lg bg-zinc-200 px-3 py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition"
            >
              Cancel
            </button>
          </>
        )}

        {booking.status === "cancelled" && (
          <button
            onClick={() =>
              onDeleteBooking(booking.property_id, booking.booking_id)
            }
            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-900/50 transition"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}