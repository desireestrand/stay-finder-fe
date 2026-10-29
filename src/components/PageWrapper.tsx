"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";

export default function PageWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const { user, isLoading } = useAuth();

  const isAuthPage = pathname.startsWith("/auth");
  const isProtectedPropertyPage = pathname.includes("/new") || pathname.includes("/edit");
  const isProfilePage = pathname.startsWith("/profile");
  const isProtected = isProfilePage || isProtectedPropertyPage;

  useEffect(() => {
    if (isLoading) return;

   if (isProtected && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, isProtected, router]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p className="text-sm text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (isProtected && !user) {
    return null;
  }

  return <div className="container mx-auto px-4 py-6">{children}</div>;
}
