"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import type { PropertiesFilter } from "@/utils/propertyService";

type SearchBarProps = {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
};

function Searchbar({ search, setSearch }: SearchBarProps) {
  return (
    <input
      type="search"
      value={search}
      placeholder="Location"
      onChange={(e) => setSearch(e.target.value)}
      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-300"
    />
  );
}

type PropertyFilterProps = {
  filter: PropertiesFilter;
};

export default function PropertyFilter({ filter }: PropertyFilterProps) {
  const router = useRouter();
  const [search, setSearch] = useState(filter.location || "");

  const onFiltering = () => {
    const params = new URLSearchParams();
    if (search) {
      params.set("location", search);
    }
    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  };

  return (
    <div className="flex gap-2">
      <Searchbar search={search} setSearch={setSearch} />
      <button
        type="button"
        onClick={onFiltering}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        Filter
      </button>
    </div>
  );
}