"use client";

import {
  Loader2,
  MapPin,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

interface LocationSearchProps {
  value: string;

  onChange: (
    value: string,
  ) => void;
}

interface PhotonProperties {
  name?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  country?: string;
  countrycode?: string;
}

interface PhotonFeature {
  properties: PhotonProperties;
}

interface PhotonResponse {
  features: PhotonFeature[];
}

function buildLocationLabel(
  properties: PhotonProperties,
) {
  const place =
    properties.city ||
    properties.town ||
    properties.village ||
    properties.name;

  const parts = [
    place,
    properties.state,
    properties.country,
  ].filter(
    (
      part,
      index,
      array,
    ) =>
      Boolean(part) &&
      array.indexOf(part) ===
        index,
  );

  return parts.join(", ");
}

export default function LocationSearch({
  value,
  onChange,
}: LocationSearchProps) {
  const [
    search,
    setSearch,
  ] = useState(
    value ?? "",
  );

  const [
    results,
    setResults,
  ] =
    useState<PhotonFeature[]>(
      [],
    );

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    open,
    setOpen,
  ] =
    useState(false);

  const [
    focused,
    setFocused,
  ] =
    useState(false);

  const [
    hasInteracted,
    setHasInteracted,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const wrapperRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  // --------------------------------------------------
  // CLOSE WHEN CLICKING OUTSIDE
  // --------------------------------------------------

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(
          false,
        );

        setFocused(
          false,
        );
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  // --------------------------------------------------
  // SEARCH LOCATIONS
  // --------------------------------------------------

  useEffect(() => {
    const query =
      search.trim();

    /*
     * Do not search automatically when the page loads
     * with an existing saved location.
     *
     * Search only after the user focuses the field
     * and actually edits/types something.
     */
    if (
      !focused ||
      !hasInteracted ||
      query.length < 3
    ) {
      return;
    }

    const controller =
      new AbortController();

    const timer =
      window.setTimeout(
        async () => {
          try {
            setLoading(
              true,
            );

            setError("");

            const params =
              new URLSearchParams({
                q: query,
                limit: "8",
                lang: "en",
              });

            const response =
              await fetch(
                `https://photon.komoot.io/api/?${params.toString()}`,
                {
                  signal:
                    controller.signal,
                },
              );

            if (
              !response.ok
            ) {
              throw new Error(
                "Location search failed.",
              );
            }

            const data =
              (await response.json()) as PhotonResponse;

            const filteredResults =
              data.features.filter(
                (
                  feature,
                ) => {
                  const properties =
                    feature.properties;

                  return Boolean(
                    properties.city ||
                      properties.town ||
                      properties.village ||
                      properties.name,
                  );
                },
              );

            setResults(
              filteredResults,
            );

            setOpen(
              filteredResults.length >
                0,
            );
          } catch (
            searchError
          ) {
            if (
              searchError instanceof DOMException &&
              searchError.name ===
                "AbortError"
            ) {
              return;
            }

            console.error(
              "Location search failed:",
              searchError,
            );

            setResults(
              [],
            );

            setOpen(
              false,
            );

            setError(
              "Location suggestions could not be loaded.",
            );
          } finally {
            setLoading(
              false,
            );
          }
        },
        450,
      );

    return () => {
      window.clearTimeout(
        timer,
      );

      controller.abort();
    };
  }, [
    search,
    focused,
    hasInteracted,
  ]);

  // --------------------------------------------------
  // INPUT CHANGE
  // --------------------------------------------------

  const handleInputChange = (
    nextValue: string,
  ) => {
    setSearch(
      nextValue,
    );

    onChange(
      nextValue,
    );

    setHasInteracted(
      true,
    );

    setError("");

    if (
      nextValue
        .trim()
        .length <
      3
    ) {
      setResults(
        [],
      );

      setOpen(
        false,
      );
    }
  };

  // --------------------------------------------------
  // INPUT FOCUS
  // --------------------------------------------------

  const handleFocus =
    () => {
      setFocused(
        true,
      );
    };

  // --------------------------------------------------
  // SELECT LOCATION
  // --------------------------------------------------

  const selectLocation = (
    feature: PhotonFeature,
  ) => {
    const label =
      buildLocationLabel(
        feature.properties,
      );

    if (!label) {
      return;
    }

    setSearch(
      label,
    );

    onChange(
      label,
    );

    setResults(
      [],
    );

    setOpen(
      false,
    );

    setHasInteracted(
      false,
    );

    setError("");
  };

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div
      ref={
        wrapperRef
      }
      className="relative"
    >
      <label className="block text-sm font-medium text-gray-300">
        Location

        <div className="relative mt-2">
          <MapPin
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            value={
              search
            }
            onChange={(
              event,
            ) =>
              handleInputChange(
                event.target
                  .value,
              )
            }
            onFocus={
              handleFocus
            }
            maxLength={100}
            autoComplete="off"
            placeholder="Start typing a city..."
            className="w-full rounded-xl border border-white/10 bg-black/10 py-3 pl-11 pr-12 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400"
          />

          {loading && (
            <Loader2
              size={17}
              className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-green-300"
            />
          )}
        </div>
      </label>

      {/* RESULTS */}

      {open &&
        focused &&
        hasInteracted &&
        results.length >
          0 && (
          <div className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-white/10 bg-[#102A2A] shadow-2xl">
            {results.map(
              (
                result,
                index,
              ) => {
                const label =
                  buildLocationLabel(
                    result.properties,
                  );

                if (
                  !label
                ) {
                  return null;
                }

                return (
                  <button
                    key={`${label}-${index}`}
                    type="button"
                    onMouseDown={(
                      event,
                    ) => {
                      event.preventDefault();

                      selectLocation(
                        result,
                      );
                    }}
                    className="flex w-full cursor-pointer items-start gap-3 border-b border-white/5 px-4 py-3 text-left transition last:border-b-0 hover:bg-white/5"
                  >
                    <MapPin
                      size={16}
                      className="mt-0.5 shrink-0 text-green-300"
                    />

                    <span className="min-w-0">
                      <span className="block text-sm text-white">
                        {
                          label
                        }
                      </span>

                      {result
                        .properties
                        .countrycode && (
                        <span className="mt-0.5 block text-xs uppercase text-gray-500">
                          {
                            result
                              .properties
                              .countrycode
                          }
                        </span>
                      )}
                    </span>
                  </button>
                );
              },
            )}
          </div>
        )}

      {error && (
        <p className="mt-2 text-xs text-amber-300">
          {error}
        </p>
      )}

      <p className="mt-2 text-xs leading-5 text-gray-500">
        Type at least 3 characters and choose a location from the suggestions.
      </p>
    </div>
  );
}