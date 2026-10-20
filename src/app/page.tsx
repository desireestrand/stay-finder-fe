import PropertyList from "@/components/PropertyList";

export default function HomePage({ searchParams }: PageProps<"/">) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10">
      <PropertyList searchParams={searchParams} />
    </main>
  );
}