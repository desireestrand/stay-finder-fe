import type { Booking } from "@/types/booking";

export async function getUserBookings(): Promise<Booking[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/me`);

  const response = await fetch(url, {
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch your bookings");
  }

  return response.json();
}

export async function getPropertyBookings(
  propertyId: string,
): Promise<Booking[]> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/properties/${propertyId}`,
  );

  const response = await fetch(url, {
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch bookings for property");
  }

  return response.json();
}

export async function getBookingById(bookingId: string): Promise<Booking> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/${bookingId}`
  );

  const response = await fetch(url, {
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch booking");
  }

  return response.json();
}

export async function updateBookingStatus(
  propertyId: string,
  bookingId: string,
  status: "confirmed" | "cancelled",
): Promise<Booking> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/properties/${propertyId}/${bookingId}`,
  );

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update booking status");
  }

  return response.json();
}

export async function updateGuestBooking(
  propertyId: string,
  bookingId: string,
  updates: {
    check_in?: string;
    check_out?: string;
    guests?: number;
    guest_name?: string;
    guest_email?: string;
    status?: string;
  },
): Promise<Booking> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/properties/${propertyId}/${bookingId}`,
  );

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "Failed to update booking");
  }

  return response.json();
}

export async function deleteBooking(
  propertyId: string,
  bookingId: string,
): Promise<boolean> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/properties/${propertyId}/${bookingId}`,
  );

  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete booking");
  }

  return true;
}
