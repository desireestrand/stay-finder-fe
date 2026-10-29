"use client";

import { useState } from "react";
import type { Property } from "@/types/property";
import type { Booking, BookingStatus } from "@/types/booking";
import UserIncomingBookingsList from "./UserIncomingBookingsList";
import ConfirmModal from "./ConfirmModal";
import Link from "next/link";
import T from "./typography";
import Image from "next/image";

interface UserPropertyCardProps {
  property: Property;
  bookings: Booking[];
  onDeleteProperty: (id: string) => void | Promise<void>;
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const imageUrl =
    property.image_url ||
    "https://img.magnific.com/premium-vector/silhouette-skyline-illustration_53876-78792.jpg?semt=ais_hybrid&w=740&q=80";

  async function handleDelete() {
    try {
      setIsDeleting(true);
      await onDeleteProperty(property.property_id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete property";
      alert(message);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  }

  return (
    <>
      <div className="border border-zinc-200 rounded-2xl p-5 lg:p-6 flex flex-col gap-5 bg-white">
        <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between">
          <div className="flex gap-4 items-center w-full lg:w-auto min-w-0 flex-1">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 lg:h-20 lg:w-20 overflow-hidden rounded-xl bg-zinc-100 shrink-0">
              <Image
                src={imageUrl}
                alt={property.title}
                fill
                sizes="(max-width: 1024px) 96px, 80px"
                unoptimized
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-center min-w-0 flex-1 gap-1">
              <T.Header
                size="sm"
                className="line-clamp-2 lg:truncate text-base sm:text-lg lg:text-sm"
              >
                {property.title}
              </T.Header>

              <p className="text-xs sm:text-sm lg:text-xs text-zinc-500 truncate">
                {property.city}, {property.country}
              </p>

              <p className="text-xs sm:text-sm lg:text-xs font-semibold text-zinc-900 mt-0.5">
                {property.price_per_night} SEK{" "}
                <span className="font-normal text-zinc-500">
                  / night
                </span>
              </p>
            </div>
          </div>

          <div className="flex w-full lg:w-auto gap-2.5 items-center justify-between lg:justify-end pt-3 lg:pt-0 shrink-0">
            <Link
              href={`/properties/${property.property_id}`}
              className="flex-1 lg:flex-none text-center rounded-lg bg-zinc-100 px-4 py-2.5 lg:py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-200 transition"
            >
              View
            </Link>

            <Link
              href={`/properties/${property.property_id}/edit`}
              className="flex-1 lg:flex-none text-center rounded-lg bg-zinc-900 px-4 py-2.5 lg:py-2 text-xs font-medium text-white hover:bg-zinc-800 transition"
            >
              Edit
            </Link>

            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex-1 lg:flex-none text-center rounded-lg bg-red-50 px-4 py-2.5 lg:py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition"
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

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete property"
        description={`Are you sure you want to delete "${property.title}"? All associated bookings will also be deleted.`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
