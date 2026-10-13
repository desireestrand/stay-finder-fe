import { getPropertyById } from "@/app/utils/propertyService";
import T from "@/components/typography";
import Link from "next/link";

type PropertyDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return (
      <main className="p-8 max-w-3xl mx-auto">
        <T.Header size="lg">Property not found</T.Header>
        <Link href="/" className="text-blue-500 underline mt-4 inline-block">Back to home</Link>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-3xl mx-auto flex flex-col gap-4">
      <T.Header size="lg">{property.title}</T.Header>
      <p className="text-zinc-600 dark:text-zinc-400">{property.description}</p>
      <p><strong>Location:</strong> {property.city}, {property.country}</p>
      <p><strong>Price:</strong> {property.price_per_night} kr / natt</p>
      <p><strong>Max guests:</strong> {property.max_guests}</p>
      <p><strong>Type:</strong> {property.kind}</p>
      <Link href="/" className="text-blue-500 underline mt-4 inline-block">Back to home</Link>
    </main>
  );
}