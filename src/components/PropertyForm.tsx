"use client";

import { SubmitEvent, useState } from "react";
import type {
  CreatePropertyState,
  UpdatePropertyState,
} from "@/utils/propertyService";

const fieldClassName =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-300 dark:focus:ring-zinc-300";

export type PropertyFormValues = {
  title?: string;
  description?: string;
  city?: string;
  country?: string;
  kind?: string;
  max_guests?: number;
  price_per_night?: number;
  image_url?: string | null;
};

type PropertyFormProps = {
  action: (
    formData: FormData,
  ) => Promise<CreatePropertyState | UpdatePropertyState>;
  values?: PropertyFormValues;
  submitLabel?: string;
  pendingLabel?: string;
};

export default function PropertyForm({
  action,
  values,
  submitLabel = "Create stay",
  pendingLabel = "Creating…",
}: PropertyFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    setError(null);
    setPending(true);

    try {
      const result = await action(formData);

      if (result?.error) {
        setError(result.error);
      }
    } catch (error) {
      setError("Could not create property.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Title
          <input
            name="title"
            required
            defaultValue={values?.title}
            placeholder="Ex. Cozy apartment in city center"
            className={fieldClassName}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
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
          <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            City
            <input
              name="city"
              required
              defaultValue={values?.city}
              placeholder="Ex. Stockholm"
              className={fieldClassName}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
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
          <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
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

          <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
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
          <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
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
          
          <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
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

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full md:w-auto rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}
