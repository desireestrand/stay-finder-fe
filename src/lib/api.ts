import { Property } from "@/types/property";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  }

  return API_BASE_URL;
}

export async function getProperties(): Promise<Property[]> {
  const response = await fetch(`${getApiBaseUrl()}/properties`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch properties");
  }

  return response.json();
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const response = await fetch(`${getApiBaseUrl()}/properties/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch property");
  }

  return response.json();
}

export async function createBooking(
  propertyId: string,
  input: CreateBookingInput,
): Promise<Booking> {
  const response = await fetch(
    `${getApiBaseUrl()}/bookings/properties/${propertyId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    const body = (await response.json()) as ApiError;
    const message = body.errors?.map(([, text]) => text).join(", ");
    throw new Error(message || "Failed to create booking");
  }

  return response.json();
}