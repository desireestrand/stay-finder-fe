"use client";

import { useState } from "react";
import type { Booking } from "@/types/booking";
import Link from "next/link";
import T from "./typography";
import ConfirmModal from "./ConfirmModal";

interface UserBookingCardProps {
  booking: Booking;
  onCancelBooking: (
    propertyId: string,
    bookingId: string,
  ) => Promise<void> | void;
  onDeleteBooking: (
    propertyId: string,
    bookingId: string,
  ) => Promise<void> | void;
}

export default function UserBookingCard({
  booking,
  onCancelBooking,
  onDeleteBooking,
}: UserBookingCardProps) {
  const [modalAction, setModalAction] = useState<"cancel" | "delete" | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const today = new Date().toLocaleDateString("sv-SE");
  const isPastBooking = booking.check_in < today;

  async function handleConfirm() {
    setIsProcessing(true);
    try {
      if (modalAction === "cancel") {
        await onCancelBooking(booking.property_id, booking.booking_id);
      } else if (modalAction === "delete") {
        await onDeleteBooking(booking.property_id, booking.booking_id);
      }
    } finally {
      setIsProcessing(false);
      setModalAction(null);
    }
  }

  return (
    <>
      <div className="border border-zinc-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
        <div className="flex flex-col gap-1">
          <T.Header size="sm">
            Booking at property #{booking.property_id.slice(33, 36)}
          </T.Header>

          <p className="text-xs text-zinc-500">
            {booking.check_in} → {booking.check_out}
          </p>

          <p className="text-xs text-zinc-500">
            {booking.guests} {booking.guests === 1 ? "guest" : "guests"} • Total
            price:{" "}
            <span className="font-semibold text-zinc-900">
              {booking.total_price} SEK
            </span>
          </p>

          <p className="text-xs font-medium text-zinc-700 mt-0.5">
            Status:{" "}
            <span className="capitalize font-semibold">{booking.status}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Link
            href={`/properties/${booking.property_id}`}
            className="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-200 transition"
          >
            View property
          </Link>

          {booking.status !== "cancelled" && !isPastBooking && (
            <>
              <Link
                href={`/properties/${booking.property_id}/bookings/${booking.booking_id}/edit`}
                className="rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white hover:bg-zinc-800 transition"
              >
                Edit
              </Link>

              <button
                type="button"
                onClick={() => setModalAction("cancel")}
                className="rounded-lg bg-zinc-200 px-3 py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-300 transition"
              >
                Cancel
              </button>
            </>
          )}

          {booking.status === "cancelled" && (
            <button
              type="button"
              onClick={() => setModalAction("delete")}
              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={modalAction !== null}
        title={
          modalAction === "cancel" ? "Cancel reservation" : "Delete booking"
        }
        description={
          modalAction === "cancel"
            ? "Are you sure you want to cancel this booking?"
            : "Are you sure you want to permanently delete this booking record?"
        }
        confirmText={
          isProcessing
            ? "Processing..."
            : modalAction === "cancel"
              ? "Confirm cancel"
              : "Delete"
        }
        cancelText="Close"
        variant={modalAction === "delete" ? "danger" : "default"}
        onConfirm={handleConfirm}
        onClose={() => setModalAction(null)}
      />
    </>
  );
}
