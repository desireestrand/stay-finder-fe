import type { Property } from "@/types/property";
import type { Booking, BookingStatus } from "@/types/booking";
import UserPropertyCard from "./UserPropertyCard";
import Link from "next/link";

interface UserPropertiesTabProps {
  properties: Property[];
  propertyBookings: Record<string, Booking[]>;
  onDeleteProperty: (id: string) => void;
  onUpdateBookingStatus: (
    propertyId: string,
    bookingId: string,
    status: BookingStatus,
  ) => void;
  onDeleteBooking: (propertyId: string, bookingId: string) => void;
}

export default function UserPropertiesTab({
  properties,
  propertyBookings,
  onDeleteProperty,
  onUpdateBookingStatus,
  onDeleteBooking,
}: UserPropertiesTabProps) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-800">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          You haven't listed any properties yet.
        </p>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          List your first stay to start receiving bookings.
        </p>
        
        <Link
          href="/host/properties/new"
          className="mt-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
        >
          + List a stay
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {properties.map((property) => (
        <UserPropertyCard
          key={property.property_id}
          property={property}
          bookings={propertyBookings[property.property_id] || []}
          onDeleteProperty={onDeleteProperty}
          onUpdateBookingStatus={onUpdateBookingStatus}
          onDeleteBooking={onDeleteBooking}
        />
      ))}
    </div>
  );
}
