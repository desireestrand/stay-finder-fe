import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600">
      <Link
        href="/properties"
        className="hover:text-zinc-900 transition-colors"
      >
        Properties
      </Link>

      <div className="relative group py-2">
        <button className="flex items-center gap-1 hover:text-zinc-900 transition-colors">
          Categories
          <span className="text-xs transition-transform duration-200 group-hover:rotate-180">
            ▾
          </span>
        </button>

        <div className="absolute top-full left-0 w-48 bg-white border border-zinc-200 rounded-2xl py-2 hidden group-hover:flex flex-col z-50">
          <Link
            href="/properties/kind/apartment"
            className="px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            Apartments
          </Link>
          <Link
            href="/properties/kind/villa"
            className="px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            Villas
          </Link>
          <Link
            href="/properties/kind/cabin"
            className="px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            Cabins
          </Link>
        </div>
      </div>
    </nav>
  );
}
