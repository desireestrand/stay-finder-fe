import type { Booking } from "@/types/booking";
import UserBookingCard from "./UserBookingCard";

interface UserBookingsListProps {
  bookings: Booking[];
  onCancelBooking: (propertyId: string, bookingId: string) => void;
  onDeleteBooking: (propertyId: string, bookingId: string) => void;
}

export default function UserBookingsTab({
  bookings,
  onCancelBooking,
  onDeleteBooking,
}: UserBookingsListProps) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-800">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          You have no bookings yet.
        </p>
        
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          When you book a stay, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {bookings.map((booking) => (
        <UserBookingCard
          key={booking.booking_id}
          booking={booking}
          onCancelBooking={onCancelBooking}
          onDeleteBooking={onDeleteBooking}
        />
      ))}
    </div>
  );
}
