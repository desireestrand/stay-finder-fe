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

type PropertyListProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  kind?: PropertyKind;
};

export default async function PropertyList({
  searchParams,
  kind,
}: PropertyListProps) {
  const params = await searchParams;

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
    limit: 10,
    offset: params.offset ? Number(params.offset) : 0,
  };

  let properties: Property[] = [];
  let errorMessage: string | null = null;

  try {
    const result = kind
      ? await getPropertiesByKind(kind, filters)
      : await getProperties(filters);
    properties = result.data;
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Failed to fetch properties";
  }

  const titleText = kind
    ? `${kind.charAt(0).toUpperCase() + kind.slice(1)}s`
    : "Find your perfect stay";

  return (
    <div className="flex flex-col gap-8 w-full py-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <T.Header size="lg">{titleText}</T.Header>
      </div>

      <PropertyFilter filter={filters} />

      <ErrorMessage message={errorMessage} />

      {!errorMessage && properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-800">
          <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            No properties found...
          </p>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Try changing or clearing your filters to see more results.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.property_id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
