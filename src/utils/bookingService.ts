import type { Booking, BookingStatus, NewBooking } from "@/types/booking";
import { parseErrorResponse } from "./error";

export async function getUserBookings(): Promise<Booking[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/me`);

  const response = await fetch(url, {
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    const message = await parseErrorResponse(
      response,
      "Failed to fetch your bookings",
    );
    throw new Error(message);
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
    const message = await parseErrorResponse(
      response,
      "Failed to fetch bookings for property",
    );
    throw new Error(message);
  }

  return response.json();
}

export async function getBookingById(bookingId: string): Promise<Booking> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/${bookingId}`,
  );

  const response = await fetch(url, {
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    const message = await parseErrorResponse(
      response,
      "Failed to fetch booking",
    );
    throw new Error(message);
  }

  return response.json();
}

export async function createBooking(
  propertyId: string,
  bookingData: NewBooking,
): Promise<Booking> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/properties/${propertyId}`,
  );

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const message = await parseErrorResponse(
      response,
      "Failed to create booking",
    );
    throw new Error(message);
  }

  return response.json();
}

export async function updateBookingStatus(
  propertyId: string,
  bookingId: string,
  status: BookingStatus,
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
    const message = await parseErrorResponse(
      response,
      "Failed to update booking status",
    );
    throw new Error(message);
  }

  return response.json();
}

export async function updateGuestBooking(
  propertyId: string,
  bookingId: string,
  updates: Partial<NewBooking>& { status?: BookingStatus },
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
    const message = await parseErrorResponse(
      response,
      "Failed to update booking",
    );
    throw new Error(message);
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
    const message = await parseErrorResponse(
      response,
      "Failed to delete booking",
    );
    throw new Error(message);
  }

  return true;
}
