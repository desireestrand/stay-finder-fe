import type { Property } from "@/types/property";
import type { Booking, BookingStatus } from "@/types/booking";
import UserIncomingBookingsList from "./UserIncomingBookingsList";
import Link from "next/link";
import T from "./typography";
import Image from "next/image";

interface UserPropertyCardProps {
  property: Property;
  bookings: Booking[];
  onDeleteProperty: (id: string) => void;
  onUpdateBookingStatus: (
    propertyId: string,
    bookingId: string,
    status: BookingStatus,
  ) => void;
  onDeleteBooking: (propertyId: string, bookingId: string) => void;
}

export default function UserPropertyCard({
  property,
  bookings,
  onDeleteProperty,
  onUpdateBookingStatus,
  onDeleteBooking,
}: UserPropertyCardProps) {
  const imageUrl =
    property.image_url ||
    "https://img.magnific.com/premium-vector/silhouette-skyline-illustration_53876-78792.jpg?semt=ais_hybrid&w=740&q=80";

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col gap-4 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4 items-center flex-1 min-w-0">
          <div className="h-20 w-20 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0">
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              sizes="80px"
              loading="eager"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-between py-0.5 min-w-0 flex-1">
            <T.Header size="sm" className="truncate">
              {property.title}
            </T.Header>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
              {property.city}, {property.country}
            </p>

            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
              {property.price_per_night} SEK{" "}
              <span className="font-normal text-zinc-500 dark:text-zinc-400">
                / night
              </span>
            </p>
          </div>
        </div>

        <div className="flex gap-2 items-center w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
          <Link
            href={`/properties/${property.property_id}`}
            className="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition"
          >
            View
          </Link>

          <Link
            href={`/properties/${property.property_id}/edit`}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
          >
            Edit
          </Link>

          <button
            onClick={() => onDeleteProperty(property.property_id)}
            className="rounded-lg bg-red-50 dark:bg-red-950/50 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition"
          >
            Delete
          </button>
        </div>
      </div>

      <UserIncomingBookingsList
        bookings={bookings}
        propertyId={property.property_id}
        onUpdateBookingStatus={onUpdateBookingStatus}
        onDeleteBooking={onDeleteBooking}
      />
    </div>
  );
}
