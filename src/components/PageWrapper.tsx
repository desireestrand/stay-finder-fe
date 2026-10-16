// src/components/PageWrapper.tsx
"use client";

import { useAuth } from "@/contexts/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p className="p-8 text-center">Loading...</p>;
  }

  if (!user) {
    redirect("/auth/login");
  }

  return <div className="container mx-auto">{children}</div>;
}