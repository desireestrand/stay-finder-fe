"use client";

import PageWrapper from "@/components/PageWrapper";
import ErrorMessage from "@/components/ErrorMessage";
import T from "@/components/typography";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <PageWrapper>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-6 px-6 py-20 text-center">
        <T.Header size="lg">Something went wrong</T.Header>

        <div className="w-full">
          <ErrorMessage message={error.message || "An unexpected error occurred."} />
        </div>

        <button
          onClick={reset}
          className="rounded-lg bg-zinc-900 px-4 py-2.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
        >
          Try again
        </button>
      </main>
    </PageWrapper>
  );
}