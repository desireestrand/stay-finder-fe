"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
          >
            StayFinder
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <Link href="/properties" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Properties
            </Link>

            <div className="relative group py-2">
              <button className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                Categories
                <span className="text-xs transition-transform duration-200 group-hover:rotate-180">
                  ▾
                </span>
              </button>

              <div className="absolute top-full left-0 w-48 bg-white border border-zinc-200 rounded-2xl shadow-xl py-2 hidden group-hover:flex flex-col z-50 dark:border-zinc-800 dark:bg-zinc-900">
                <Link
                  href="/properties/kind/apartment"
                  className="px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                >
                  Apartments
                </Link>

                <Link
                  href="/properties/kind/villa"
                  className="px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                >
                  Villas
                </Link>

                <Link
                  href="/properties/kind/cabin"
                  className="px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cabins
                </Link>
              </div>
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <span className="text-sm text-zinc-400">Loading...</span>
          ) : user ? (
            <>
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
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
}