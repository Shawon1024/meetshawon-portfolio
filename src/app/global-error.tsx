"use client";

import {
  AlertTriangle,
  Home,
  RefreshCw,
} from "lucide-react";
import {
  useEffect,
} from "react";
import Link from "next/link";
interface GlobalErrorProps {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps) {
  useEffect(() => {
    console.error(
      "Global application error:",
      error,
    );
  }, [
    error,
  ]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#071A1A] text-white">
        <main className="flex min-h-screen items-center justify-center px-6 py-20">
          <div className="mx-auto w-full max-w-2xl text-center">

            {/* ICON */}

            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-red-300">
              <AlertTriangle
                size={30}
              />
            </div>

            {/* LABEL */}

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-red-300">
              Critical Error
            </p>

            {/* TITLE */}

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Something went wrong
            </h1>

            {/* DESCRIPTION */}

            <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-400">
              An unexpected error prevented the application from loading
              correctly. Try reloading the application or return to the
              homepage.
            </p>

            {/* ERROR REFERENCE */}

            {error.digest && (
              <p className="mt-4 text-xs text-gray-600">
                Error reference:{" "}
                {error.digest}
              </p>
            )}

            {/* ACTIONS */}

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

              <button
                type="button"
                onClick={() => {
                  reset();
                }}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-400 px-5 py-3 text-sm font-semibold text-[#071A1A] transition hover:bg-green-300 sm:w-auto"
              >
                <RefreshCw
                  size={17}
                />

                Try Again
              </button>

<Link
  href="/"
  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-gray-200 transition hover:border-green-400/30 hover:text-green-300 sm:w-auto"
>
  <Home size={17} />

  Back to Home
</Link>

            </div>

          </div>
        </main>
      </body>
    </html>
  );
}