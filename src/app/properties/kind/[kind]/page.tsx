import type { PropertyKind } from "@/types/property";
import PageWrapper from "@/components/PageWrapper";
import PropertyList from "@/components/PropertyList";

interface PageProps {
  params: Promise<{ kind: PropertyKind }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PropertyKindPage({
  params,
  searchParams,
}: PageProps) {
  const { kind } = await params;

  return (
    <PageWrapper>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10">
        <PropertyList searchParams={searchParams} kind={kind} />
      </main>
    </PageWrapper>
  );
}
