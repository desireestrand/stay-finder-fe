"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const [modalAction, setModalAction] = useState<"cancel" | "delete" | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const today = new Date().toLocaleDateString("sv-SE");
  const isPastBooking = booking.check_in < today;

  const showButtons =
    (!isPastBooking && booking.status === "pending") ||
    (!isPastBooking && booking.status !== "cancelled") ||
    booking.status === "cancelled";

  async function handleConfirm() {
    setIsProcessing(true);
    try {
      if (modalAction === "cancel") {
        await onCancelBooking(booking.property_id, booking.booking_id);
      } else if (modalAction === "delete") {
        await onDeleteBooking(booking.property_id, booking.booking_id);
      }
      
      router.refresh();
    } finally {
      setIsProcessing(false);
      setModalAction(null);
    }
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-zinc-50 p-4 rounded-xl text-xs border border-zinc-100">
        <div>
          <T.Header size="sm" className="text-zinc-900 font-semibold">
            Booking at property #{booking.property_id.slice(33, 36)}
          </T.Header>

          <p className="text-zinc-500 mt-0.5">
            {booking.check_in} → {booking.check_out}
          </p>

          <p className="text-zinc-500 mt-0.5">
            {booking.guests} {booking.guests === 1 ? "guest" : "guests"} • Total
            price:{" "}
            <span className="font-semibold text-zinc-900">
              {booking.total_price} SEK
            </span>
          </p>

          <p className="text-zinc-500 mt-0.5">
            Status:{" "}
            <span className="font-semibold capitalize text-zinc-700">
              {booking.status}
            </span>
          </p>
        </div>

        <div className="flex w-full lg:w-auto gap-2.5 items-center justify-between lg:justify-end border-t lg:border-t-0 border-zinc-100 shrink-0">
          <Link
            href={`/properties/${booking.property_id}`}
            className="flex-1 lg:flex-none text-center rounded-lg bg-zinc-100 px-4 py-2.5 lg:py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-200 transition"
          >
            View property
          </Link>

          {showButtons && (
            <>
              {!isPastBooking && booking.status !== "cancelled" && (
                <Link
                  href={`/properties/${booking.property_id}/bookings/${booking.booking_id}/edit`}
                  className="flex-1 lg:flex-none text-center rounded-lg bg-zinc-900 px-4 py-2.5 lg:py-2 text-xs font-medium text-white hover:bg-zinc-800 transition"
                >
                  Edit
                </Link>
              )}

              {!isPastBooking && booking.status !== "cancelled" && (
                <button
                  type="button"
                  onClick={() => setModalAction("cancel")}
                  className="flex-1 lg:flex-none text-center rounded-lg bg-zinc-200 px-4 py-2.5 lg:py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-300 transition"
                >
                  Cancel
                </button>
              )}

              {!isPastBooking && booking.status === "cancelled" && (
                <button
                  type="button"
                  onClick={() => setModalAction("delete")}
                  className="flex-1 lg:flex-none text-center rounded-lg bg-red-50 px-4 py-2.5 lg:py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition"
                >
                  Delete
                </button>
              )}
            </>
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
        cancelText="Cancel"
        variant={modalAction === "delete" ? "danger" : "default"}
        onConfirm={handleConfirm}
        onClose={() => setModalAction(null)}
      />
    </>
  );
}
