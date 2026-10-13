import { getProperties, PropertiesFilter } from "@/app/utils/propertyService";

import PropertyCard from "./PropertyCard";
import PropertyFilter from "./PropertyFilter";
import T from "./typography";

type PropertyListProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PropertyList({
  searchParams,
}: PropertyListProps) {
  const city = (await searchParams).city?.toString() || "";
  const propertiesFilter: PropertiesFilter = {
    city,
  };
  const properties = await getProperties(propertiesFilter);

  return (
    <div>
      <T.Header size="lg">[PROPERTIES]</T.Header>
      <PropertyFilter filter={propertiesFilter} />
      <div className="flex flex-col gap-4 mt-4">
        {properties.map((property) => (
          <PropertyCard key={property.property_id} property={property} />
        ))}
      </div>
    </div>
  );
}