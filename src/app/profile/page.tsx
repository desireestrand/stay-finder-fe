"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import T from "@/components/typography";
import Link from "next/link";
import { deleteProperty, getUserProperties } from "@/utils/propertyService";
import type { Property } from "@/types/property";
import type { Booking } from "@/types/booking";
import {
  getUserBookings,
  getPropertyBookings,
  updateBookingStatus,
  updateGuestBooking,
  deleteBooking,
} from "@/utils/bookingService";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"properties" | "bookings">(
    "properties",
  );

  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyBookings, setPropertyBookings] = useState<
    Record<string, Booking[]>
  >({});
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      async function fetchData() {
        try {
          setLoadingData(true);

          const [fetchedProperties, fetchedBookings] = await Promise.all([
            getUserProperties(),
            getUserBookings(),
          ]);

          setProperties(fetchedProperties || []);
          setBookings(fetchedBookings || []);

          const bookingsMap: Record<string, Booking[]> = {};

          for (const property of fetchedProperties || []) {
            try {
              const propBookings = await getPropertyBookings(
                property.property_id,
              );
              bookingsMap[property.property_id] = propBookings;
            } catch (error) {
              console.error(
                `Failed to fetch bookings for property ${property.property_id}`,
                error,
              );
            }
          }
          setPropertyBookings(bookingsMap);
        } catch (error) {
          console.error("Failed to fetch profile data", error);
        } finally {
          setLoadingData(false);
        }
      }
      fetchData();
    } else if (!isLoading) {
      setLoadingData(false);
    }
  }, [user]);

  async function handleDelete(propertyId: string) {
    if (window.confirm("Are you sure you want to delete this property?")) {
      const result = await deleteProperty(propertyId);

      if (result.error) {
        alert(result.error);
        return;
      }

      setProperties((prev) => prev.filter((p) => p.property_id !== propertyId));
    }
  }

  async function handleGuestDelete(propertyId: string, bookingId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to completely delete this booking? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteBooking(propertyId, bookingId);
      
      setBookings((prev) => prev.filter((b) => b.booking_id !== bookingId));
    } catch (error) {
      alert("Could not delete booking.");
    }
  }

  async function handleGuestCancel(propertyId: string, bookingId: string) {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const updated = await updateGuestBooking(propertyId, bookingId, {
          status: "cancelled",
        });

        setBookings((prev) =>
          prev.map((b) => (b.booking_id === bookingId ? updated : b)),
        );
      } catch (error) {
        alert("Could not cancel booking.");
      }
    }
  }

  async function handleBookingStatusUpdate(
    propertyId: string,
    bookingId: string,
    newStatus: "confirmed" | "cancelled",
  ) {
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
      alert("Could not update booking status.");
    }
  }

  if (isLoading || loadingData) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <div>
        <T.Header size="lg">My Profile</T.Header>
        <p className="text-sm text-zinc-500 py-2">Logged in as: {user.email}</p>
      </div>

      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("properties")}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition ${
            activeTab === "properties"
              ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
              : "border-transparent text-zinc-500 hover:text-zinc-700"
          }`}
        >
          My Properties ({properties.length})
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition ${
            activeTab === "bookings"
              ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
              : "border-transparent text-zinc-500 hover:text-zinc-700"
          }`}
        >
          My Bookings ({bookings.length})
        </button>
      </div>

      {activeTab === "properties" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties.length === 0 ? (
            <p className="text-sm text-zinc-500">
              You haven't listed any properties yet.
            </p>
          ) : (
            properties.map((property) => {
              const currentBookings =
                propertyBookings[property.property_id] || [];

              return (
                <div
                  key={property.property_id}
                  className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col gap-4 bg-white dark:bg-zinc-900 shadow-sm"
                >
                  <div className="flex gap-4 items-center">
                    {property.image_url ? (
                      <div className="h-20 w-20 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 shrink-0">
                        <img
                          src={property.image_url}
                          alt={property.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 text-[10px] text-center p-1 shrink-0">
                        No image
                      </div>
                    )}

                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div>
                        <h3 className="font-semibold text-base leading-snug">
                          {property.title}
                        </h3>
                        <p className="text-xs text-zinc-500">
                          {property.city}, {property.country}
                        </p>
                        <p className="text-xs font-medium mt-1">
                          {property.price_per_night} SEK / night
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/properties/${property.property_id}`}
                        className="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition"
                      >
                        View
                      </Link>

                      <Link
                        href={`/properties/${property.property_id}/edit`}
                        className="rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 transition"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(property.property_id)}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-900/50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-1">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                      Incoming Reservations ({currentBookings.length})
                    </h4>

                    {currentBookings.length === 0 ? (
                      <p className="text-xs text-zinc-400 italic">
                        No reservations for this property yet.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {currentBookings.map((booking) => (
                          <div
                            key={booking.booking_id}
                            className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg text-xs"
                          >
                            <div>
                              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                {booking.guest_name} ({booking.guest_email})
                              </p>
                              <p className="text-zinc-500 mt-0.5">
                                {booking.check_in} → {booking.check_out} (
                                {booking.guests} guests) • Status:{" "}
                                <span className="font-semibold capitalize text-zinc-700 dark:text-zinc-300">
                                  {booking.status}
                                </span>
                              </p>
                            </div>

                            <div className="flex gap-2">
                              {booking.status !== "cancelled" && (
                                <Link
                                  href={`/properties/${booking.property_id}/bookings/${booking.booking_id}/edit`}
                                  className="rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-3 py-1.5 text-xs font-medium transition hover:bg-zinc-800"
                                >
                                  Edit
                                </Link>
                              )}

                              {booking.status === "pending" && (
                                <button
                                  onClick={() =>
                                    handleBookingStatusUpdate(
                                      property.property_id,
                                      booking.booking_id,
                                      "confirmed",
                                    )
                                  }
                                  className="rounded bg-emerald-600 px-2.5 py-1 text-white font-medium hover:bg-emerald-700 transition"
                                >
                                  Confirm
                                </button>
                              )}
                              {booking.status === "pending" ||
                                (booking.status === "confirmed" && (
                                  <button
                                    onClick={() =>
                                      handleBookingStatusUpdate(
                                        property.property_id,
                                        booking.booking_id,
                                        "cancelled",
                                      )
                                    }
                                    className="rounded bg-zinc-200 dark:bg-zinc-700 px-2.5 py-1 text-zinc-800 dark:text-zinc-200 font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
                                  >
                                    Cancel
                                  </button>
                                ))}
                              {booking.status === "cancelled" && (
                                <button
                                  onClick={() =>
                                    deleteBooking(
                                      property.property_id,
                                      booking.booking_id,
                                    )
                                  }
                                  className="rounded bg-zinc-200 dark:bg-zinc-700 px-2.5 py-1 text-zinc-800 dark:text-zinc-200 font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === "bookings" && (
        <div className="flex flex-col gap-4">
          {bookings.length === 0 ? (
            <p className="text-sm text-zinc-500">
              You have no active bookings.
            </p>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.booking_id}
                className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex justify-between items-center bg-white dark:bg-zinc-900 shadow-sm"
              >
                <div>
                  <h3 className="font-semibold text-base">
                    Booking at Property #{booking.property_id.slice(0, 8)}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    {booking.check_in} → {booking.check_out} • Status:{" "}
                    <span className="font-medium capitalize">
                      {booking.status}
                    </span>
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <Link
                    href={`/properties/${booking.property_id}`}
                    className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium hover:bg-zinc-200 dark:bg-zinc-800 transition"
                  >
                    View property
                  </Link>

                  {booking.status !== "cancelled" && (
                    <>
                      <Link
                        href={`/properties/${booking.property_id}/bookings/${booking.booking_id}/edit`}
                        className="rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-3 py-1.5 text-xs font-medium transition hover:bg-zinc-800"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          handleGuestCancel(
                            booking.property_id,
                            booking.booking_id,
                          )
                        }
                        className="rounded bg-zinc-200 dark:bg-zinc-700 px-2.5 py-1 text-zinc-800 dark:text-zinc-200 font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600 transition text-xs"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {booking.status === "cancelled" && (
                    <button
                      onClick={() =>
                        handleGuestDelete(
                          booking.property_id,
                          booking.booking_id,
                        )
                      }
                      className="rounded bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 px-2.5 py-1 font-medium hover:bg-red-100 transition text-xs"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}
