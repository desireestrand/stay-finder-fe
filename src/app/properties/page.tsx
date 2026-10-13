import PropertyCard from "@/components/PropertyCard";
import { getProperties } from "@/lib/api";

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <main>
      <h1>Properties</h1>
      <section>
        {properties.map((property) => (
          <PropertyCard key={property.property_id} property={property} />
        ))}
      </section>
    </main>
  );
}