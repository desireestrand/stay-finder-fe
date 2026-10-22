"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProperty } from "@/utils/propertyService";
import PageWrapper from "@/components/PageWrapper";
import PropertyForm from "@/components/PropertyForm";
import ErrorMessage from "@/components/ErrorMessage";
import T from "@/components/typography";

export default function NewPropertyPage() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  async function onCreate(formData: FormData) {
    setError(null);

    try {
      const result = await createProperty(formData);

      if (result.error) {
        setError(result.error);
        return { error: result.error };
      }

      if (result.propertyId) {
        router.push(`/properties/${result.propertyId}`);
      }

      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not create property.";
      setError(message);
      return { error: message };
    }
  }

  return (
    <PageWrapper>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
        <T.Header size="lg">List a stay</T.Header>
        <ErrorMessage message={error} />
        <PropertyForm action={onCreate} />
      </main>
    </PageWrapper>
  );
}
