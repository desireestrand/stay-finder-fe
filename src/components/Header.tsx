"use client";

import Link from "next/link";
import NavBar from "./NavBar";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
   <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900"
          >
            StayFinder
          </Link>

         <NavBar />
        </div>

        <UserMenu />
      </div>
    </header>
  );
}