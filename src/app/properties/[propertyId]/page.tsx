import { getPropertyById } from "@/utils/propertyService";
import PropertyActionBox from "@/components/PropertyActionBox";
import PageWrapper from "@/components/PageWrapper";
import Link from "next/link";
import { notFound } from "next/navigation";
import T from "@/components/typography";
import Image from "next/image";

export default async function PropertyPage({
  params,
}: PageProps<"/properties/[propertyId]">) {
  const { propertyId } = await params;

  const property = await getPropertyById(propertyId);

  if (!property) {
    notFound();
  }

  const imageUrl =
    property.image_url ||
    "https://img.magnific.com/premium-vector/silhouette-skyline-illustration_53876-78792.jpg?semt=ais_hybrid&w=740&q=80";

  return (
    <PageWrapper>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            ← Back to all stays
          </Link>
        </div>

        <div className="flex flex-col gap-1.5">
          <T.Header size="lg">{property.title}</T.Header>

          <p className="text-zinc-600">
            {property.city}, {property.country}{" "}
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 items-start">
          <div className="flex flex-col gap-6 lg:col-span-2 w-full">
            <div className="relative h-100 w-full overflow-hidden rounded-2xl bg-zinc-100 shadow-sm">
              <Image
                src={imageUrl}
                alt={property.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                unoptimized
                priority
                className="object-cover"
              />
            </div>

            <div>
              <p>
                <span className="text-lg text-zinc-900 font-semibold">
                  {property.price_per_night} SEK
                </span>

                <span className="text-lg text-zinc-500">
                  {" "}
                  / night
                </span>
              </p>
            </div>

            <div className="border-t border-zinc-100 pt-6">
              <h3 className="py-1 text-lg font-semibold text-zinc-900">
                About the property
              </h3>

              <p className="text-sm text-zinc-500">
                {property.kind && `${property.kind.toLocaleUpperCase()} `}
                <span className="text-zinc-400">
                  ·
                </span> Max {property.max_guests} guests
              </p>

              <p className="py-3 leading-relaxed text-zinc-700 whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {property.user_id && (
              <div className="text-sm text-zinc-500">
                <span className="font-medium text-zinc-900">
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
    </PageWrapper>
  );
}