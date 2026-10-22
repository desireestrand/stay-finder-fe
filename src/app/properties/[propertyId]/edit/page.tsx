"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import type { Property } from "@/types/property";
import { getPropertyById, updateProperty } from "@/utils/propertyService";
import PageWrapper from "@/components/PageWrapper";
import PropertyForm from "@/components/PropertyForm";
import ErrorMessage from "@/components/ErrorMessage";
import T from "@/components/typography";

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = use(params);

  const router = useRouter();

  const { user } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);

  const [loadingProperty, setLoadingProperty] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !propertyId) return;

    async function fetchProperty() {
      try {
        setLoadingProperty(true);
        const data = await getPropertyById(propertyId);

        if (!data) {
          setError("Property not found.");
        } else if (data.user_id !== user?.id) {
          router.push("/");
          return;
        } else {
          setProperty(data);
        }
      } catch (error) {
        setError("Failed to load property details.");
      } finally {
        setLoadingProperty(false);
      }
    }
    fetchProperty();
  }, [propertyId, user, router]);

  async function onUpdate(formData: FormData) {
    setError(null);

    try {
      const result = await updateProperty(propertyId, formData);

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
        error instanceof Error ? error.message : "Could not update property.";
      setError(message);
      return { error: message };
    }
  }

  return (
    <PageWrapper>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
        <T.Header size="lg">
          {property ? `Edit stay: ${property.title}` : "Edit stay"}
        </T.Header>

        <ErrorMessage message={error} />

        {loadingProperty ? (
          <p className="text-sm text-zinc-500">Loading property...</p>
        ) : !property ? (
          <p className="text-sm text-red-500">Property not found.</p>
        ) : (
          <PropertyForm
            action={onUpdate}
            values={property}
            submitLabel="Save changes"
            pendingLabel="Saving..."
          />
        )}
      </main>
    </PageWrapper>
  );
}
