"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserMenu() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (isLoading) {
    return <span className="text-sm text-zinc-400">Loading...</span>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/host/properties/new"
          className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
        >
          + List a stay
        </Link>

        <Link
          href="/profile"
          className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors"
        >
          My pages
        </Link>

        <span className="hidden lg:inline text-sm text-zinc-500 dark:text-zinc-400">
          {user.email}
        </span>

        <button
          onClick={handleLogout}
          className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/auth/login"
        className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors px-3 py-2"
      >
        Log in
      </Link>

      <Link
        href="/auth/signup"
        className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
      >
        Create account
      </Link>
    </div>
  );
}
