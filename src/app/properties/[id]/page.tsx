import { getPropertyById } from "@/utils/propertyService";
import PropertyActionBox from "@/components/PropertyActionBox";
import Link from "next/link";
import { notFound } from "next/navigation";
import T from "@/components/typography";

export default async function PropertyPage({
  params,
}: PageProps<"/properties/[id]">) {
  const { id } = await params;

  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  const imageUrl =
    property.image_url ||
    "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop";

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        >
          ← Back to all stays
        </Link>
      </div>

      <div className="flex flex-col gap-1.5">
        <T.Header size="lg">{property.title}</T.Header>

        <p className="text-zinc-600 dark:text-zinc-400">
          {property.city}, {property.country}{" "}
        </p>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 items-start">
        <div className="flex flex-col gap-6 lg:col-span-2 w-full">
          <div className="relative h-100 w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 shadow-sm">
            <img
              src={imageUrl}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p>
              <span className="text-lg text-zinc-900 dark:text-zinc-100 font-semibold">
                {property.price_per_night} SEK
              </span>

              <span className="text-lg text-zinc-500 dark:text-zinc-400">
                {" "}
                / night
              </span>
            </p>
          </div>

          <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
            <h3 className="py-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              About the property
            </h3>

            <p>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {property.kind && `${property.kind.toLocaleUpperCase()}`}{" "}
              </span>

              <span className="text-zinc-400 dark:text-zinc-600">·</span>

              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {" "}
                Max {property.max_guests} guests
              </span>
            </p>

            <p className="py-3 leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {property.user_id && (
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                Owner:
              </span>{" "}
              {property.user_id}
            </div>
          )}
        </div>

        <div className="lg:col-span-1 w-full order-last">
          <div className="lg:sticky lg:top-24">
            <PropertyActionBox property={property} />
          </div>
        </div>
      </div>
    </main>
  );
}
