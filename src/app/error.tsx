"use client";

import {
  AlertTriangle,
  Home,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import {
  useEffect,
} from "react";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(
      "Application error:",
      error,
    );
  }, [
    error,
  ]);

  return (
    <main className="flex min-h-[75vh] items-center justify-center px-6 py-20">
      <div className="mx-auto w-full max-w-2xl text-center">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-red-300">
          <AlertTriangle size={30} />
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-red-300">
          Something went wrong
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          We couldn&apos;t load this page
        </h1>

        <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-400">
          An unexpected error occurred while loading this page. You can try
          again or return to the homepage.
        </p>

        {error.digest && (
          <p className="mt-4 text-xs text-gray-600">
            Error reference: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              reset();
            }}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-400 px-5 py-3 text-sm font-semibold text-[#071A1A] transition hover:bg-green-300 sm:w-auto"
          >
            <RefreshCw size={17} />
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
  );
}