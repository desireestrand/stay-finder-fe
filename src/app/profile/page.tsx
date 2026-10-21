"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import T from "@/components/typography";
import Link from "next/link";
import { deleteProperty, getUserProperties } from "@/utils/propertyService";

export default function ProfilePage() {
  const router = useRouter();

  const { user, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"properties" | "bookings">(
    "properties",
  );

  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

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

          const fetchedProps = await getUserProperties();

          setProperties(fetchedProps || []);
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
            properties.map((property) => (
              <div
                key={property.property_id}
                className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex gap-4 items-center bg-white dark:bg-zinc-900 shadow-sm"
              >
                {property.image_url ? (
                  <div className="h-24 w-24 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={property.image_url}
                      alt={property.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 text-[10px] text-center p-1">
                    No image
                  </div>
                )}

                <div className="flex flex-1 flex-col justify-between h-full py-1">
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

                  <div className="flex gap-2 mt-3">
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
              </div>
            ))
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
                className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex justify-between items-center bg-white dark:bg-zinc-900"
              >
                <div>
                  <h3 className="font-semibold text-base">
                    {booking.property?.title || "Property"}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {booking.check_in} → {booking.check_out}
                  </p>
                </div>
                <Link
                  href={`/properties/${booking.property_id}`}
                  className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium hover:bg-zinc-200 dark:bg-zinc-800"
                >
                  View property
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}
