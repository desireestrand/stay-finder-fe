export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-900 mx-auto"></div>
      <p className="text-sm text-zinc-600">Loading content...</p>
    </div>
  );
}