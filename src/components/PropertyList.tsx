import PropertyCard from "./PropertyCard";
import PropertyFilter from "./PropertyFilter";
import { getProperties } from "@/utils/propertyService";
import type { PropertyListFilter } from "@/types/property";
import T from "./typography";

type PropertyListProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PropertyList({
  searchParams,
}: PropertyListProps) {
  const params = await searchParams;

  const filters: PropertyListFilter = {
    q: params.q?.toString() || "",
    city: params.city?.toString() || "",
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
    max_guests: params.max_guests ? Number(params.max_guests) : undefined,
    sort_by: (params.sort_by as any) || "created_at",
    sort_order: (params.sort_order as any) || "desc",
    limit: 10,
    offset: params.offset ? Number(params.offset) : 0,
  };

  console.log("Filters received:", filters);

  const result = await getProperties(filters);
  const properties = result.data;

  return (
   <div className="flex flex-col gap-8 max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <T.Header size="lg">Find your perfect stay</T.Header>
      </div>

      <PropertyFilter filter={filters} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.property_id} property={property} />
        ))}
      </div>
    </div>
  );
}
