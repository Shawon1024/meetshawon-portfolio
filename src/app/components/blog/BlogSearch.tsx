"use client";

import {
  Search,
  X,
} from "lucide-react";
import {
  FormEvent,
  useState,
} from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function BlogSearch() {
  const router =
    useRouter();

  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();

  const currentQuery =
    searchParams.get("q") ?? "";

  const [query, setQuery] =
    useState(currentQuery);


  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const params =
      new URLSearchParams(
        searchParams.toString(),
      );

    const cleanQuery =
      query.trim();

    if (cleanQuery) {
      params.set(
        "q",
        cleanQuery,
      );
    } else {
      params.delete("q");
    }

    const queryString =
      params.toString();

    router.push(
      queryString
        ? `${pathname}?${queryString}`
        : pathname,
    );
  };

  // --------------------------------------------------
  // CLEAR SEARCH ONLY
  // --------------------------------------------------

  const clearSearch =
    () => {
      const params =
        new URLSearchParams(
          searchParams.toString(),
        );

      params.delete("q");

      setQuery("");

      const queryString =
        params.toString();

      router.push(
        queryString
          ? `${pathname}?${queryString}`
          : pathname,
      );
    };

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="relative"
    >
      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
      />

      <input
        type="search"
        value={query}
        onChange={(
          event,
        ) =>
          setQuery(
            event.target.value,
          )
        }
        placeholder="Search articles..."
        aria-label="Search articles"
        className="w-full rounded-2xl border border-white/10 bg-[var(--surface)]/70 py-3.5 pl-12 pr-28 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-400/40"
      />

      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {currentQuery && (
          <button
            type="button"
            onClick={
              clearSearch
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white/5 hover:text-white"
            aria-label="Clear search"
          >
            <X
              size={17}
            />
          </button>
        )}

        <button
          type="submit"
          className="rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-green-400"
        >
          Search
        </button>
      </div>
    </form>
  );
}