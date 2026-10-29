import type {
  Property,
  PropertyKind,
  PropertyListFilter,
  PropertySortBy,
  SortOrder,
} from "@/types/property";
import { getProperties, getPropertiesByKind } from "@/utils/propertyService";
import PropertyCard from "./PropertyCard";
import PropertyFilter from "./PropertyFilter";
import ErrorMessage from "./ErrorMessage";
import T from "./typography";
import Link from "next/link";

interface PropertyListProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  kind?: PropertyKind;
}

export default async function PropertyList({
  searchParams,
  kind,
}: PropertyListProps) {
  const params = await searchParams;

  const limit = 12;
  const offset = params.offset ? Number(params.offset) : 0;

  const filters: PropertyListFilter = {
    q: params.q?.toString() || "",
    city: params.city?.toString() || "",
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
    max_guests: params.max_guests ? Number(params.max_guests) : undefined,
    start_date: params.start_date?.toString() || undefined,
    end_date: params.end_date?.toString() || undefined,
    sort_by: (params.sort_by as PropertySortBy) || "created_at",
    sort_order: (params.sort_order as SortOrder) || "desc",
    limit,
    offset,
  };

  let properties: Property[] = [];
  let totalCount = 0;

  let errorMessage: string | null = null;

  try {
    const result = kind
      ? await getPropertiesByKind(kind, filters)
      : await getProperties(filters);
    properties = result.data;
    totalCount = result.count;
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Failed to fetch properties";
  }

  const titleText = kind
    ? `${kind.charAt(0).toUpperCase() + kind.slice(1)}s`
    : "Find your perfect stay";

  const createPageUrl = (newOffset: number) => {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => urlParams.append(key, v));
        } else {
          urlParams.set(key, value);
        }
      }
    });

    if (newOffset > 0) {
      urlParams.set("offset", String(newOffset));
    } else {
      urlParams.delete("offset");
    }

    return `?${urlParams.toString()}`;
  };

  const hasPreviousPage = offset > 0;
  const hasNextPage = offset + limit < totalCount;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  return (
    <div className="flex flex-col gap-8 w-full py-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <T.Header size="lg">{titleText}</T.Header>
      </div>

      <PropertyFilter filter={filters} />

      <ErrorMessage message={errorMessage} />

      {!errorMessage && properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-300 py-16 text-center">
          <p className="text-lg font-medium text-zinc-900">
            No properties found...
          </p>

          <p className="text-sm text-zinc-500">
            Try changing or clearing your filters to see more results.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.property_id} property={property} />
            ))}
          </div>

          {(hasPreviousPage || hasNextPage) && (
            <div className="flex items-center justify-between border-t border-zinc-200 pt-6 mt-4">
              {hasPreviousPage ? (
                <Link
                  href={createPageUrl(Math.max(0, offset - limit))}
                  className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-200 transition"
                >
                  ← Previous
                </Link>
              ) : (
                <div />
              )}

              <span className="text-sm text-zinc-500">
                Page {currentPage} of {totalPages}
              </span>

              {hasNextPage ? (
                <Link
                  href={createPageUrl(offset + limit)}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition"
                >
                  Next →
                </Link>
              ) : (
                <div />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
