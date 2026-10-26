"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import type { Property } from "@/types/property";
import type { Booking, BookingStatus } from "@/types/booking";
import { deleteProperty, getUserProperties } from "@/utils/propertyService";
import {
  getUserBookings,
  getPropertyBookings,
  updateBookingStatus,
  updateGuestBooking,
  deleteBooking,
} from "@/utils/bookingService";
import PageWrapper from "@/components/PageWrapper";
import ProfileTabs from "@/components/ProfileTabs";
import UserPropertiesTab from "@/components/UserPropertiesTab";
import UserBookingsTab from "@/components/UserBookingsTab";
import ErrorMessage from "@/components/ErrorMessage";
import T from "@/components/typography";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"properties" | "bookings">("properties");

  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyBookings, setPropertyBookings] = useState<Record<string, Booking[]>>({});
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      if (!isLoading) setLoadingData(false);
      return;
    }

    async function fetchData() {
      try {
        setLoadingData(true);
        setError(null);

        const [fetchedProperties, fetchedBookings] = await Promise.all([
          getUserProperties(),
          getUserBookings(),
        ]);

        setProperties(fetchedProperties || []);
        setBookings(fetchedBookings || []);

        const bookingsEntries = await Promise.all(
          (fetchedProperties || []).map(async (property) => {
            try {
              const b = await getPropertyBookings(property.property_id);

              return [property.property_id, b];
            } catch {
              return [property.property_id, []];
            }
          }),
        );

        setPropertyBookings(Object.fromEntries(bookingsEntries));
      } catch (error) {
        setError("Could not load profile data. Please try again later.");
      } finally {
        setLoadingData(false);
      }
    }

    fetchData();
  }, [user, isLoading]);

  async function handleDeleteProperty(propertyId: string) {
    setError(null);

    try {
      await deleteProperty(propertyId);

      setProperties((prev) => prev.filter((p) => p.property_id !== propertyId));
    } catch (error) {
      setError("Could not delete property.");
    }
  }

  async function handleCancelGuestBooking(
    propertyId: string,
    bookingId: string,
  ) {
    setError(null);

    try {
      const updated = await updateGuestBooking(propertyId, bookingId, {
        status: "cancelled",
      });

      setBookings((prev) =>
        prev.map((b) => (b.booking_id === bookingId ? updated : b)),
      );
    } catch (error) {
      setError("Could not cancel booking.");
    }
  }

  async function handleDeleteBooking(propertyId: string, bookingId: string) {
    setError(null);

    try {
      await deleteBooking(propertyId, bookingId);

      setBookings((prev) => prev.filter((b) => b.booking_id !== bookingId));
    } catch (error) {
      setError("Could not delete booking.");
    }
  }

  async function handleBookingStatusUpdate(
    propertyId: string,
    bookingId: string,
    newStatus: BookingStatus,
  ) {
    setError(null);

    try {
      const updatedBooking = await updateBookingStatus(
        propertyId,
        bookingId,
        newStatus,
      );

      setPropertyBookings((prev) => ({
        ...prev,
        [propertyId]: (prev[propertyId] || []).map((b) =>
          b.booking_id === bookingId ? updatedBooking : b,
        ),
      }));
    } catch (error) {
      setError("Could not update booking status.");
    }
  }

  if (loadingData) {
    return (
      <PageWrapper>
        <div className="flex flex-1 items-center justify-center py-20">
          <p>Loading profile data...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
        <div>
          <T.Header size="lg">My Profile</T.Header>
          <p className="text-sm text-zinc-500 py-2">
            Logged in as: {user?.email}
          </p>
        </div>

        <ErrorMessage message={error} />

        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          propertiesCount={properties.length}
          bookingsCount={bookings.length}
        />

        {activeTab === "properties" && (
          <UserPropertiesTab
            properties={properties}
            propertyBookings={propertyBookings}
            onDeleteProperty={handleDeleteProperty}
            onUpdateBookingStatus={handleBookingStatusUpdate}
            onDeleteBooking={handleDeleteBooking}
          />
        )}

        {activeTab === "bookings" && (
          <UserBookingsTab
            bookings={bookings}
            onCancelBooking={handleCancelGuestBooking}
            onDeleteBooking={handleDeleteBooking}
          />
        )}
      </main>
    </PageWrapper>
  );
}
