import Link from "next/link";
import {
  ArrowLeft,
  Home,
  SearchX,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center px-6 py-20">
      <div className="mx-auto w-full max-w-2xl text-center">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-green-400/20 bg-green-400/10 text-green-300">
          <SearchX size={30} />
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-green-400">
          Error 404
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Page not found
        </h1>

        <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist, may have been
          moved, or is no longer available.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-400 px-5 py-3 text-sm font-semibold text-[#071A1A] transition hover:bg-green-300 sm:w-auto"
          >
            <Home size={17} />
            Back to Home
          </Link>

          <Link
            href="/blog"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-gray-200 transition hover:border-green-400/30 hover:text-green-300 sm:w-auto"
          >
            <ArrowLeft size={17} />
            Browse Blog
          </Link>
        </div>
      </div>
    </main>
  );
}