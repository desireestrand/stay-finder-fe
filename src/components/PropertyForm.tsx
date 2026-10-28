"use client";

import type { SubmitEvent } from "react";
import { useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import type { PropertyKind } from "@/types/property";

const fieldClassName =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black";

export type PropertyFormValues = {
  title?: string;
  description?: string;
  city?: string;
  country?: string;
  kind?: PropertyKind;
  max_guests?: number;
  price_per_night?: number;
  image_url?: string | null;
};

interface PropertyFormProps {
  onSubmit: (
    formData: FormData,
  ) => Promise<{ success?: boolean; error?: string } | void>;
  values?: PropertyFormValues;
  submitLabel?: string;
  pendingLabel?: string;
}

export default function PropertyForm({
  onSubmit,
  values,
  submitLabel = "Create stay",
  pendingLabel = "Creating…",
}: PropertyFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    setError(null);
    setPending(true);

    try {
      const result = await onSubmit(formData);

      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save property";
      setError(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-6"
    >
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-600">
          Title
          <input
            name="title"
            required
            defaultValue={values?.title}
            placeholder="Ex. Cozy apartment in city center"
            className={fieldClassName}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-600">
          Description
          <textarea
            name="description"
            required
            rows={4}
            defaultValue={values?.description}
            placeholder="Describe your property..."
            className={fieldClassName}
          />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-600">
            City
            <input
              name="city"
              required
              defaultValue={values?.city}
              placeholder="Ex. Stockholm"
              className={fieldClassName}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-600">
            Country
            <input
              name="country"
              required
              defaultValue={values?.country}
              placeholder="Ex. Sweden"
              className={fieldClassName}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-600">
            Kind
            <select
              name="kind"
              required
              defaultValue={values?.kind ?? ""}
              className={fieldClassName}
            >
              <option value="" disabled>
                Choose a kind
              </option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="cabin">Cabin</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-600">
            Image URL
            <input
              name="image_url"
              type="url"
              defaultValue={values?.image_url ?? ""}
              placeholder="https://example.com/image.jpg"
              className={fieldClassName}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-600">
            Max guests
            <input
              name="max_guests"
              type="number"
              min={1}
              required
              defaultValue={values?.max_guests}
              placeholder="2"
              className={fieldClassName}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-600">
            Price per night (SEK)
            <input
              name="price_per_night"
              type="number"
              min={100}
              required
              defaultValue={values?.price_per_night}
              placeholder="1000"
              className={fieldClassName}
            />
          </label>
        </div>
      </div>

      <ErrorMessage message={error} />

      <button
        type="submit"
        disabled={pending}
        className="w-full md:w-auto rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60"
      >
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}
