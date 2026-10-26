"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { deleteProperty } from "@/utils/propertyService";
import type { Property } from "@/types/property";
import PropertyBookerCard from "@/components/PropertyBookerCard";
import Link from "next/link";
import T from "@/components/typography";

export default function PropertyActionBox({
  property,
}: {
  property: Property;
}) {
  const { user } = useAuth();
  const router = useRouter();

  const isOwner = user && user.id === property.user_id;

  async function handleDelete() {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteProperty(property.property_id);

        router.push("/profile");
        router.refresh();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete property.";
        alert(message);
      }
    }
  }

  if (!user) {
    const currentPath = `/properties/${property.property_id}`;
    const loginUrl = `/auth/login?redirectTo=${currentPath}`;
    const signupUrl = `/auth/signup?redirectTo=${currentPath}`;

    return (
      <div className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <T.Header size="sm">Log in to book your stay</T.Header>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            You need to be logged in to make a reservation for this property.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link
            href={loginUrl}
            className="w-full text-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
          >
            Log in
          </Link>

          <Link
            href={signupUrl}
            className="w-full text-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
          >
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  if (isOwner) {
    return (
      <div className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <T.Header size="sm">Manage your property</T.Header>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            You are the owner of this stay. You can edit details or remove it
            entirely.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link
            href={`/properties/${property.property_id}/edit`}
            className="w-full text-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
          >
            Edit Property
          </Link>

          <button
            onClick={handleDelete}
            className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 transition"
          >
            Delete Property
          </button>
        </div>
      </div>
    );
  }

  return <PropertyBookerCard property={property} />;
}
