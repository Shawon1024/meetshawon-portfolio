import {
  Loader2,
} from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-[65vh] items-center justify-center px-6 py-20">
      <div
        role="status"
        aria-live="polite"
        className="text-center"
      >
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-green-400/20 bg-green-400/10 text-green-300">
          <Loader2
            size={26}
            className="animate-spin"
          />
        </div>

        <p className="mt-5 text-sm font-medium text-gray-300">
          Loading...
        </p>

        <span className="sr-only">
          Please wait while the page loads.
        </span>
      </div>
    </main>
  );
}