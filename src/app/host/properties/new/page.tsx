"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PropertyForm from "@/components/PropertyForm";
import T from "@/components/typography";
import { createProperty } from "@/utils/propertyService";
import { useAuth } from "@/contexts/AuthContext";

export default function NewPropertyPage() {
  const router = useRouter();

  const { user, isLoading } = useAuth();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

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
      const message =
        error instanceof Error ? error.message : "Could not create property.";
      setError(message);
      return { error: message };
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <T.Header size="lg">List a stay</T.Header>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <PropertyForm action={onCreate} />
    </main>
  );
}
