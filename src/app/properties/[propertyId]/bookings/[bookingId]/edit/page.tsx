"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import type { Booking, NewBooking } from "@/types/booking";
import { getBookingById, updateGuestBooking } from "@/utils/bookingService";
import PageWrapper from "@/components/PageWrapper";
import BookingForm from "@/components/BookingForm";
import ErrorMessage from "@/components/ErrorMessage";
import T from "@/components/typography";

export default function EditBookingPage({
  params,
}: {
  params: Promise<{ propertyId: string; bookingId: string }>;
}) {
  const { propertyId, bookingId } = use(params);

  const router = useRouter();

  const { user } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);

  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !bookingId) return;

    async function fetchBooking() {
      try {
        setLoadingData(true);

        const fetchedBooking = await getBookingById(bookingId);

        setBooking(fetchedBooking);
      } catch (error) {
        setError("Failed to load booking details.");
      } finally {
        setLoadingData(false);
      }
    }
    fetchBooking();
  }, [user, bookingId]);

  async function onUpdate(bookingData: Partial<NewBooking>) {
    setError(null);

    try {
      await updateGuestBooking(
        propertyId,
        bookingId,
        bookingData,
      );

      router.push("/profile");

      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not update booking.";

      setError(message);

      return { error: message };
    }
  }

  return (
    <PageWrapper>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
        <T.Header size="lg">Edit Booking</T.Header>

        <ErrorMessage message={error} />

        {loadingData ? (
          <p className="text-sm text-zinc-500">Loading booking...</p>
        ) : !booking ? (
          <p className="text-sm text-red-500">Booking not found.</p>
        ) : (
          <BookingForm initialData={booking} action={onUpdate} />
        )}
      </main>
    </PageWrapper>
  );
}
