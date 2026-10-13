import type { Property } from "@/types/property";

export type PropertiesFilter = {
  city?: string;
};

export async function getProperties({ city }: PropertiesFilter = {}): Promise<
  Property[]
> {
  const url = new URL(`http://localhost:3000/properties`);

  if (city) {
    url.searchParams.append("city", city);
  }

  try {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) return [];

    const json = await response.json();

    const propertiesArray = json.data || json.properties || json;

    return Array.isArray(propertiesArray) ? propertiesArray : [];
  } catch (e) {
    console.error("Fetch error:", e);
    return [];
  }
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const response = await fetch(
      `http://localhost:3000/properties/${id}`,
      {
        cache: "no-store",
      },
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch property");
    }

    return response.json();
  } catch (e) {
    return null;
  }
}
