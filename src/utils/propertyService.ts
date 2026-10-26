import type {
  Property,
  PropertyKind,
  PropertyListFilter,
} from "@/types/property";
import type { PaginatedListResponse } from "@/types/global";
import { parseErrorResponse } from "./error";

export type CreatePropertyState = {
  error?: string;
  propertyId?: string;
};

export type UpdatePropertyState = {
  error?: string;
  propertyId?: string;
};

function buildQueryString(filters?: Partial<PropertyListFilter>): string {
  const params = new URLSearchParams();

  if (!filters) return params.toString();

  if (filters.city) params.set("city", filters.city);
  if (filters.max_guests) params.set("max_guests", String(filters.max_guests));
  if (filters.min_price !== undefined)
    params.set("min_price", String(filters.min_price));
  if (filters.max_price !== undefined)
    params.set("max_price", String(filters.max_price));
  if (filters.start_date) params.set("start_date", filters.start_date);
  if (filters.end_date) params.set("end_date", filters.end_date);
  if (filters.q) params.set("q", filters.q);
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.offset) params.set("offset", String(filters.offset));
  if (filters.sort_by) params.set("sort_by", filters.sort_by);
  if (filters.sort_order) params.set("sort_order", filters.sort_order);

  return params.toString();
}

export async function getUserProperties(): Promise<Property[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/properties/me`);

  const response = await fetch(url, {
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    const message = await parseErrorResponse(
      response,
      "Failed to fetch your properties",
    );
    throw new Error(message);
  }

  return response.json();
}

export async function getProperties(
  filters?: Partial<PropertyListFilter>,
): Promise<PaginatedListResponse<Property>> {
  const queryString = buildQueryString(filters);

  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/properties${queryString ? `?${queryString}` : ""}`,
  );

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await parseErrorResponse(
      response,
      "Failed to fetch properties",
    );
    throw new Error(message);
  }

  return response.json();
}

export async function getPropertiesByKind(
  kind: PropertyKind,
  filters?: Partial<PropertyListFilter>,
): Promise<PaginatedListResponse<Property>> {
  const queryString = buildQueryString(filters);

  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/properties/kind/${kind}${queryString ? `?${queryString}` : ""}`,
  );

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    const message = await parseErrorResponse(
      response,
      "Failed to fetch properties by kind",
    );
    throw new Error(message);
  }

  return response.json();
}

export async function getPropertyById(propertyId: string): Promise<Property | null> {
  try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/properties/${propertyId}`,
    );

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }

      const message = await parseErrorResponse(
        response,
        "Failed to fetch property",
      );
      throw new Error(message);
    }

    return response.json();
  } catch {
    return null;
  }
}

export async function createProperty(
  formData: FormData,
): Promise<CreatePropertyState> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const kind = String(formData.get("kind") ?? "");
  const maxGuests = Number(formData.get("max_guests"));
  const pricePerNight = Number(formData.get("price_per_night"));
  const imageUrl = String(formData.get("image_url") ?? "").trim();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/properties`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        city,
        country,
        kind,
        max_guests: maxGuests,
        price_per_night: pricePerNight,
        image_url: imageUrl || null,
      }),
    },
  );

  if (response.status === 401) {
    return { error: "You need to be signed in to list a stay." };
  }

  if (!response.ok) {
    const message = await parseErrorResponse(
      response,
      "Could not create the stay. Check the fields and try again.",
    );
    throw new Error(message);
  }

  const property: Property = await response.json();
  return { propertyId: property.property_id };
}

export async function updateProperty(
  propertyId: string,
  formData: FormData,
): Promise<UpdatePropertyState> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const kind = String(formData.get("kind") ?? "");
  const maxGuests = Number(formData.get("max_guests"));
  const pricePerNight = Number(formData.get("price_per_night"));
  const imageUrl = String(formData.get("image_url") ?? "").trim();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/properties/${propertyId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        city,
        country,
        kind,
        max_guests: maxGuests,
        price_per_night: pricePerNight,
        image_url: imageUrl || null,
      }),
    },
  );

  if (response.status === 401) {
    return { error: "You need to be signed in to update a stay." };
  }

  if (!response.ok) {
    const message = await parseErrorResponse(
      response,
      "Could not update the stay. Check the fields and try again.",
    );
    throw new Error(message);
  }

  const property: Property = await response.json();
  return { propertyId: property.property_id };
}

export async function deleteProperty(
  propertyId: string,
): Promise<{ error?: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/properties/${propertyId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (response.status === 401) {
    return { error: "You need to be signed in to delete a stay." };
  }

  if (!response.ok) {
    const message = await parseErrorResponse(
      response,
      "Could not delete stay.",
    );
    throw new Error(message);
  }

  return {};
}
