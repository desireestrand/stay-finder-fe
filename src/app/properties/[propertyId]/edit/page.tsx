"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PropertyForm from "@/components/PropertyForm";
import T from "@/components/typography";
import { getPropertyById, updateProperty } from "@/utils/propertyService";
import { useAuth } from "@/contexts/AuthContext";
import type { Property } from "@/types/property";

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    async function fetchProperty() {
      const resolvedParams = await params;
      const data = await getPropertyById(resolvedParams.id);

      if (!data) {
        setError("Property not found.");
      } else {
        if (user && data.user_id !== user.id) {
          router.push("/");
          return;
        }
        setProperty(data);
      }
      setLoadingProperty(false);
    }
    fetchProperty();
  }, [params, user, router]);

  async function onUpdate(formData: FormData) {
    setError(null);
    const propertyData = await params;

    try {
      const result = await updateProperty(propertyData.id, formData);

      if (result.error) {
        setError(result.error);
        return { error: result.error };
      }

      if (result.propertyId) {
        router.push(`/properties/${result.propertyId}`);
      }

      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not update property.";
      setError(message);
      return { error: message };
    }
  }

  if (isLoading || loadingProperty) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p>Loading property...</p>
      </div>
    );
  }

  if (!user || !property) {
    return null;
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <T.Header size="lg">Edit stay: {property.title}</T.Header>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600 border border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900">
          {error}
        </div>
      )}

      <PropertyForm
        action={onUpdate}
        values={property}
        submitLabel="Save changes"
        pendingLabel="Saving..."
      />
    </main>
  );
}
