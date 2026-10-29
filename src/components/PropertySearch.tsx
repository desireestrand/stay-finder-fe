"use client";

import { useState } from "react";
import type { Property } from "@/types/property";
import PropertyCard from "./PropertyCard";

interface PropertySearchProps {
  properties: Property[];
};

export default function PropertySearch({ properties }: PropertySearchProps) {
  const [search, setSearch] = useState("");

  const filteredProperties = properties.filter((property) =>
    property.title.toLowerCase().includes(search.toLowerCase()) ||
    property.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <input
        type="search"
        placeholder="Search by title or city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900"
      />
      <div className="flex flex-col gap-3">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.property_id} property={property} />
        ))}
      </div>
    </div>
  );
}