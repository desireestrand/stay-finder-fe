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
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-bold text-xl text-black flex items-center gap-2"
          >
            StayFinder
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/properties" className="hover:text-black transition">
              Properties
            </Link>

            <div className="relative group py-4">
              <button className="flex items-center gap-1 hover:text-black transition">
                Categories{" "}
                <span className="text-xs transition-transform group-hover:rotate-180">
                  ▾
                </span>
              </button>

              <div className="absolute top-full left-0 w-44 bg-white border rounded-lg shadow-lg py-2 hidden group-hover:flex flex-col z-50">
                <Link
                  href="/properties/kind/apartment"
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  Apartments
                </Link>
                <Link
                  href="/properties/kind/villa"
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  Villas
                </Link>
                <Link
                  href="/properties/kind/cabin"
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  Cabins
                </Link>
              </div>
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <span className="text-sm text-gray-400">Loading...</span>
          ) : user ? (
            <>
              <span className="text-sm text-gray-600 hidden lg:inline">
                Logged in as: {user.email}
              </span>

              <Link
                href="/properties/new"
                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
              >
                + Add property
              </Link>

              <Link
                href="/profile"
                className="text-sm font-medium text-gray-700 hover:text-black transition"
              >
                My pages
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-800 transition"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-gray-700 hover:text-black transition px-3 py-2"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
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
