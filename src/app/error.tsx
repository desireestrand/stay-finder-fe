"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="p-8 flex flex-col items-center justify-center gap-4 min-h-screen">
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <p className="text-red-500">{error.message}</p>
      <button 
        onClick={reset}
        className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md"
      >
        Try again
      </button>
    </main>
  );
}