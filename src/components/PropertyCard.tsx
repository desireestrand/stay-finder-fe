import type { Property } from "@/types/property";
import T from "./typography";
import Link from "next/link";
import { cn } from "@/app/utils/cn";

type PropertyCardProps = {
  property: Property;
  className?: string;
};

export default function PropertyCard({
  property,
  className,
}: PropertyCardProps) {
  return (
    <div className={cn("shadow-md p-4 rounded-md flex flex-col gap-2 bg-white dark:bg-zinc-900", className)}>
      <T.Header size="lg">
        {property.title}
      </T.Header>
      <p>{property.city}, {property.country}</p> {/* Visar stad och land från databasen */}
      <p>{property.price_per_night} kr / natt</p>
      <Link 
        href={`/properties/${property.property_id}`} 
        className="text-blue-600 dark:text-blue-400 font-medium hover:underline mt-2 inline-block"
      >
        View details
      </Link>
    </div>
  );
}