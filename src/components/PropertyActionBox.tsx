"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PropertyBookerCard from "@/components/PropertyBookerCard";
import type { Property } from "@/types/property";
import { deleteProperty } from "@/utils/propertyService";

export default function PropertyActionBox({ property }: { property: Property }) {
  const { user } = useAuth();
  const router = useRouter();

  const isOwner = user && user.id === property.user_id;

  async function handleDelete() {
    if (window.confirm("Are you sure you want to delete this property?")) {
      const result = await deleteProperty(property.property_id);

      if (result.error) {
        alert(result.error);
        return;
      }

      router.push("/profile");
      router.refresh();
    }
  }

  if (isOwner) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-zinc-900 shadow-sm">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Manage your property
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            You are the owner of this stay. You can edit details or remove it entirely.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link
            href={`/properties/${property.property_id}/edit`}
            className="w-full text-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 transition"
          >
            Edit Property
          </Link>
          
          <button
            onClick={handleDelete}
            className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition"
          >
            Delete Property
          </button>
        </div>
      </div>
    );
  }

  return <PropertyBookerCard property={property} />;
}