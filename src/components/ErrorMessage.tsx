export default function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="rounded-lg bg-red-50 p-4 text-red-600 border border-red-200">
      {message}
    </div>
  );
}