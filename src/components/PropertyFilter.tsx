"use client";

import {
  PropertyListFilter,
  PropertySortBy,
  SortOrder,
} from "@/types/property";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, SetStateAction, Dispatch } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import type { SubmitEvent } from "react";

interface SearchBarProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  placeholder?: string;
}

function Searchbar({ search, setSearch, placeholder }: SearchBarProps) {
  return (
    <input
      type="search"
      value={search}
      placeholder={placeholder}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-300 dark:focus:ring-zinc-300"
    />
  );
}

interface PropertyFilterProps {
  filter: PropertyListFilter;
}

export default function PropertyFilter({ filter }: PropertyFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const today = new Date().toLocaleDateString("sv-SE");

  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState(filter.q || "");
  const [city, setCity] = useState(filter.city || "");
  const [maxGuests, setMaxGuests] = useState(
    filter.max_guests ? String(filter.max_guests) : "",
  );

  const [minPrice, setMinPrice] = useState(
    filter.min_price !== undefined ? String(filter.min_price) : "",
  );
  const [maxPrice, setMaxPrice] = useState(
    filter.max_price !== undefined ? String(filter.max_price) : "",
  );

  const [startDate, setStartDate] = useState(filter.start_date || "");
  const [endDate, setEndDate] = useState(filter.end_date || "");

  const [sortBy, setSortBy] = useState<PropertySortBy>(
    filter.sort_by || "created_at",
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    filter.sort_order || "desc",
  );

  useEffect(() => {
    setQ(filter.q || "");
    setCity(filter.city || "");
    setMaxGuests(filter.max_guests ? String(filter.max_guests) : "");
    setMinPrice(filter.min_price !== undefined ? String(filter.min_price) : "");
    setMaxPrice(filter.max_price !== undefined ? String(filter.max_price) : "");
    setStartDate(filter.start_date || "");
    setEndDate(filter.end_date || "");
    setSortBy(filter.sort_by || "created_at");
    setSortOrder(filter.sort_order || "desc");
  }, [pathname, filter]);

  const handleSearch = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if ((startDate && !endDate) || (!startDate && endDate)) {
      setError("Both start date and end date must be provided together.");
      return;
    }

    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      setError("End date must be after start date.");
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (q) params.set("q", q);
    else params.delete("q");

    if (city) params.set("city", city);
    else params.delete("city");

    if (maxGuests) params.set("max_guests", maxGuests);
    else params.delete("max_guests");

    if (minPrice) params.set("min_price", minPrice);
    else params.delete("min_price");

    if (maxPrice) params.set("max_price", maxPrice);
    else params.delete("max_price");

    if (startDate) params.set("start_date", startDate);
    else params.delete("start_date");

    if (endDate) params.set("end_date", endDate);
    else params.delete("end_date");

    if (sortBy) params.set("sort_by", sortBy);
    if (sortOrder) params.set("sort_order", sortOrder);

    params.delete("offset");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <form
      noValidate
      onSubmit={handleSearch}
      className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Search words
          </label>

          <Searchbar
            search={q}
            setSearch={setQ}
            placeholder="Ex. pool, loft, cozy"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            City
          </label>

          <Searchbar
            search={city}
            setSearch={setCity}
            placeholder="Ex. Stockholm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Guests
          </label>

          <input
            type="number"
            min={1}
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
            placeholder="Number of guests"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-300 dark:focus:ring-zinc-300"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-4 border-t border-zinc-100 md:flex-row md:items-end md:justify-between dark:border-zinc-800">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Available dates (Check-in / Check-out)
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="date"
                value={startDate}
                min={today}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-10 w-full sm:w-1/2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-300"
              />

              <span className="text-zinc-400 hidden sm:inline">-</span>

              <input
                type="date"
                value={endDate}
                min={startDate || today}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-10 w-full sm:w-1/2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-300"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Price per night (SEK)
            </label>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className="h-10 w-24 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-300"
              />

              <span className="text-zinc-400">-</span>

              <input
                type="number"
                min={0}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className="h-10 w-24 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-300"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Sort by
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as PropertySortBy)}
              className="h-10 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-300"
            >
              <option value="created_at">Newest</option>
              <option value="price_per_night">Price</option>
              <option value="title">Title</option>
              <option value="city">City</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Order
            </label>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="h-10 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-300"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto">
          <button
            type="submit"
            className="w-full md:w-auto rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Apply filters
          </button>
        </div>
      </div>

      <ErrorMessage message={error} />
    </form>
  );
}
