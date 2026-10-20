import PropertyList from "@/components/PropertyList";
import type { PropertyKind } from "@/types/property";

type PageProps = {
  params: Promise<{ kind: PropertyKind }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PropertyKindPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const kind = resolvedParams.kind;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10">
      <PropertyList searchParams={searchParams} kind={kind} />
    </main>
  );
}
