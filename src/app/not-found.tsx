import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import T from "@/components/typography";

export default function NotFound() {
  return (
    <PageWrapper>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-6 px-6 py-20 text-center">
        <T.Header size="lg">Page not found (404)</T.Header>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          The page you are looking for might have been moved, deleted or does not exist.
        </p>

        <Link
          href="/"
          className="rounded-lg bg-zinc-900 px-4 py-2.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
        >
          Back to start
        </Link>
      </main>
    </PageWrapper>
  );
}