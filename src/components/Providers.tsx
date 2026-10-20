"use client"

import { AuthProvider } from "@/contexts/AuthContext";
import type { PropsWithChildren } from "react";

export default function Providers({children}:PropsWithChildren) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}