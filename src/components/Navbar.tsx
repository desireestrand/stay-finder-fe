"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth";

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4">
        
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-blue-600">
            StayFinder
          </Link>

          <Link href="/properties" className="text-gray-700 hover:text-blue-600">
            Boenden
          </Link>

          <div className="relative group">
            <button className="text-gray-700 hover:text-blue-600 flex items-center gap-1">
              Kategorier
            </button>

            <div className="absolute left-0 top-full hidden group-hover:block bg-white border rounded-md shadow-md py-2 w-40 z-10">
              <Link href="/properties/kind/apartment" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Lägenheter
              </Link>
              <Link href="/properties/kind/villa" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Villor
              </Link>
              <Link href="/properties/kind/cabin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Stugor
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {loading ? (
            <span className="text-sm text-gray-400">Laddar...</span>
          ) : user ? (
            <>
              <Link 
                href="/properties/new" 
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + Skapa boende
              </Link>

              <Link 
                href="/profile" 
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Mina sidor
              </Link>

              <button
                onClick={logout}
                className="text-sm font-medium text-red-600 hover:text-red-800"
              >
                Logga ut
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Logga in
              </Link>

              <Link 
                href="/signup" 
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Skapa konto
              </Link>
            </>
          )}
        </div>

      </nav>
    </header>
  );
}