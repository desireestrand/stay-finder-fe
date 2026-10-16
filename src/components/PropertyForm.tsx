"use client";

import { SubmitEvent, useState, type FormEvent } from "react";
import type { CreatePropertyState } from "@/utils/propertyService";

const fieldClassName =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-300";

export type PropertyFormValues = {
  title?: string;
  description?: string;
  location?: string;
  kind?: string;
  max_guests?: number;
  price_per_night?: number;
};

type PropertyFormProps = {
  action: (formData: FormData) => Promise<CreatePropertyState>;
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
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(undefined);
    setPending(true);
    try {
      const result = await action(formData);
      setError(result.error);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Title
        <input
          name="title"
          required
          defaultValue={values?.title}
          className={fieldClassName}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Description
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={values?.description}
          className={fieldClassName}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Location
        <input
          name="location"
          required
          defaultValue={values?.location}
          className={fieldClassName}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
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
        </select>
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Max guests
          <input
            name="max_guests"
            type="number"
            min={1}
            required
            defaultValue={values?.max_guests}
            className={fieldClassName}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Price per night
          <input
            name="price_per_night"
            type="number"
            min={100}
            required
            defaultValue={values?.price_per_night}
            className={fieldClassName}
          />
        </label>
      </div>
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}