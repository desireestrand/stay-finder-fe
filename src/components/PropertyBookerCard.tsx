"use client";

import { useState } from "react";
import BookingForm from "@/components/BookingForm";
import type { Property } from "@/types/property";
import T from "@/components/typography";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";

export default function PropertyBookerCard({
  property,
}: {
  property: Property;
}) {
  const router = useRouter();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
        <div>
          <T.Header size="sm">Book your stay</T.Header>
          <p className="text-xs text-zinc-500 mt-1">
            <span className="font-semibold text-zinc-900">
              {property.price_per_night} SEK
            </span>{" "}
            / night
          </p>
        </div>

        <BookingForm
          propertyId={property.property_id}
          pricePerNight={property.price_per_night}
          onBookingComplete={() => {
            setIsSuccessModalOpen(true);
          }}
        />
      </div>

      <ConfirmModal
        isOpen={isSuccessModalOpen}
        title="Booking confirmed!"
        description="Your reservation has been successfully created. You can view your bookings in your profile."
        confirmText="Go to profile"
        variant="default"
        onConfirm={() => {
          router.push("/profile");
          router.refresh();
        }}
        onClose={() => {
          setIsSuccessModalOpen(false);
          router.push("/profile");
          router.refresh();
        }}
      />
    </>
  );
}
