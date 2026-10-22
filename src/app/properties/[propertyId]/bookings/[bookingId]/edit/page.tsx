"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import T from "@/components/typography";
import BookingForm from "@/components/BookingForm";
import { useAuth } from "@/contexts/AuthContext";
import { getBookingById, updateGuestBooking } from "@/utils/bookingService";
import type { Booking } from "@/types/booking";

export default function EditBookingPage({
  params,
}: {
  params: Promise<{ propertyId: string; bookingId: string }>;
}) {
  const { propertyId, bookingId } = use(params);
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    if (user && bookingId) {
      async function fetchBooking() {
        try {
          setLoadingData(true);
          const fetchedBooking = await getBookingById(bookingId);
          setBooking(fetchedBooking);
        } catch (err) {
          setError("Failed to load booking details.");
        } finally {
          setLoadingData(false);
        }
      }
      fetchBooking();
    }
  }, [user, bookingId]);

  async function onUpdate(data: {
    check_in?: string;
    check_out?: string;
    guests?: number;
    guest_name?: string;
    guest_email?: string;
  }) {
    setError(null);
    try {
      await updateGuestBooking(propertyId, bookingId, data as Partial<Booking>);
      router.push("/profile");
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not update booking.";
      setError(message);
      return { error: message };
    }
  }

  if (isAuthLoading || loadingData) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p>Loading booking...</p>
      </div>
    );
  }

  if (!user || !booking) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
        <p className="text-red-500">Booking not found or failed to load.</p>
      </div>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <T.Header size="lg">Edit Booking</T.Header>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600 border border-red-200 text-sm">
          {error}
        </div>
      )}

      <BookingForm initialData={booking} action={onUpdate} />
    </main>
  );
}