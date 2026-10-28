import type { Property } from "@/types/property";
import { cn } from "@/utils/cn";
import Link from "next/link";
import T from "./typography";
import Image from "next/image";

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
        "group block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:shadow-md",
        className,
      )}
    >
      <article className="flex flex-col h-full">
        <div className="relative h-64 w-full overflow-hidden bg-zinc-100">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
            className="object-cover object-center transition duration-500 group-hover:scale-105"
          />

          {property.kind && (
            <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-semibold text-zinc-900 shadow-sm uppercase tracking-wider">
              {property.kind}
            </span>
          )}
        </div>

        <div className="flex flex-col p-5 justify-between flex-1 gap-4">
          <div>
            <T.Header
              size="sm"
              className="line-clamp-1 group-hover:text-zinc-600 transition-colors"
            >
              {property.title}
            </T.Header>

            <p className="mt-1 text-sm text-zinc-500">
              {property.city}, {property.country} · Max {property.max_guests}{" "}
              guests
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
            <div>
              <span className="text-base font-bold text-zinc-900">
                {property.price_per_night} SEK
              </span>
              <span className="text-xs text-zinc-500">
                {" "}
                / night
              </span>
            </div>

            <span className="text-sm font-medium text-zinc-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              View property →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}