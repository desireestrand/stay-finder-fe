"use client";

import BookingForm from "@/components/BookingForm";
import type { Property } from "@/types/property";
import T from "@/components/typography";
import { useRouter } from "next/navigation";

export default function PropertyBookerCard({ property }: { property: Property }) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <T.Header size="sm">Book your stay</T.Header>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {property.price_per_night} SEK
          </span>{" "}
          / night
        </p>
      </div>

      <BookingForm 
        propertyId={property.property_id} 
        pricePerNight={property.price_per_night}
        onBookingComplete={() => {
          alert("Booking confirmed successfully!");
          router.push("/profile");
          router.refresh();
        }}
      />
    </div>
  );
}