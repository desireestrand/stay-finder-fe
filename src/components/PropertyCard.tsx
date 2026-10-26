import type { Property } from "@/types/property";
import { cn } from "@/utils/cn";
import Link from "next/link";
import T from "./typography";

interface PropertyCardProps {
  property: Property;
  className?: string;
};

export default function PropertyCard({
  property,
  className,
}: PropertyCardProps) {
  const imageUrl =
    property.image_url ||
    "https://img.magnific.com/premium-vector/silhouette-skyline-illustration_53876-78792.jpg?semt=ais_hybrid&w=740&q=80";

  return (
    <Link
      href={`/properties/${property.property_id}`}
      className={cn(
        "group block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900",
        className,
      )}
    >
      <article className="flex flex-col h-full">
        <div className="relative h-64 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={imageUrl}
            alt={property.title}
            className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
          />

          {property.kind && (
            <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-semibold text-zinc-900 shadow-sm uppercase tracking-wider dark:bg-zinc-950/80 dark:text-zinc-100">
              {property.kind}
            </span>
          )}
        </div>

        <div className="flex flex-col p-5 justify-between flex-1 gap-4">
          <div>
            <T.Header
              size="sm"
              className="line-clamp-1 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors"
            >
              {property.title}
            </T.Header>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {property.city}, {property.country} · Max {property.max_guests}{" "}
              guests
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <div>
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {property.price_per_night} SEK
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {" "}
                / night
              </span>
            </div>

            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              View property →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}