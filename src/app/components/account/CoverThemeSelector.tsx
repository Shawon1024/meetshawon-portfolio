"use client";

import {
  Check,
  Loader2,
  Palette,
} from "lucide-react";
import {
  useState,
} from "react";

import { createClient } from "../../lib/supabase/client";

interface CoverThemeSelectorProps {
  userId: string;
  initialTheme:
    | string
    | null;
}

const COVER_THEMES = [
  {
    value: "emerald",
    name: "Cyber Green",
    description:
      "Emerald energy on a dark background.",
    image:
      "/images/profile-covers/cyber-green.png",
  },

  {
    value: "ocean",
    name: "Deep Ocean",
    description:
      "Electric blue energy on deep navy.",
    image:
      "/images/profile-covers/deep-ocean.png",
  },

  {
    value: "violet",
    name: "Purple Nebula",
    description:
      "Violet energy on a cosmic dark background.",
    image:
      "/images/profile-covers/purple-nebula.png",
  },

  {
    value: "amber",
    name: "Crimson Flow",
    description:
      "Crimson energy on a deep black background.",
    image:
      "/images/profile-covers/crimson-flow.png",
  },

  {
    value: "midnight",
    name: "Midnight Smoke",
    description:
      "Silver-blue energy on dark charcoal.",
    image:
      "/images/profile-covers/midnight-smoke.png",
  },
] as const;

export default function CoverThemeSelector({
  userId,
  initialTheme,
}: CoverThemeSelectorProps) {
  const [
    selectedTheme,
    setSelectedTheme,
  ] = useState(
    initialTheme ??
      "emerald",
  );

  const [
    savedTheme,
    setSavedTheme,
  ] = useState(
    initialTheme ??
      "emerald",
  );

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const handleSave =
    async () => {
      setError("");
      setSuccess("");

      if (
        selectedTheme ===
        savedTheme
      ) {
        setSuccess(
          "This cover theme is already selected.",
        );

        return;
      }

      try {
        setSaving(
          true,
        );

        const supabase =
          createClient();

        const {
          error:
            updateError,
        } =
          await supabase
            .from(
              "profiles",
            )
            .update({
              cover_theme:
                selectedTheme,
            })
            .eq(
              "id",
              userId,
            );

        if (
          updateError
        ) {
          throw updateError;
        }

        setSavedTheme(
          selectedTheme,
        );

        setSuccess(
          "Cover theme updated successfully.",
        );
      } catch (
        error
      ) {
        console.error(
          "Cover theme update failed:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Your cover theme could not be updated.",
        );
      } finally {
        setSaving(
          false,
        );
      }
    };

  return (
    <section className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-8">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
          <Palette
            size={19}
          />
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300">
            Appearance
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Cover Theme
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Choose a cover for your public profile. Custom cover photo uploads
            can be added later.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {COVER_THEMES.map(
          (
            theme,
          ) => {
            const selected =
              selectedTheme ===
              theme.value;

            return (
              <button
                key={
                  theme.value
                }
                type="button"
                onClick={() => {
                  setSelectedTheme(
                    theme.value,
                  );

                  setError("");
                  setSuccess("");
                }}
                aria-pressed={
                  selected
                }
                className={`overflow-hidden rounded-2xl border text-left transition ${
                  selected
                    ? "border-green-400/50 ring-1 ring-green-400/20"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
<div
  className="relative h-28 overflow-hidden bg-black"
  style={{
    backgroundImage:
      `url("${theme.image}")`,
    backgroundSize:
      "cover",
    backgroundPosition:
      "center",
  }}
>
  <div className="absolute inset-0 bg-black/5" />

  {selected && (
    <span className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-green-400 text-black shadow-lg">
      <Check
        size={16}
      />
    </span>
  )}
</div>

                <div className="bg-black/10 p-4">
                  <p className="font-medium text-white">
                    {
                      theme.name
                    }
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {
                      theme.description
                    }
                  </p>
                </div>
              </button>
            );
          },
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
        >
          {
            error
          }
        </p>
      )}

      {success && (
        <p
          role="status"
          className="mt-6 rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm text-green-300"
        >
          {
            success
          }
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => {
            void handleSave();
          }}
          disabled={
            saving
          }
          className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving && (
            <Loader2
              size={17}
              className="animate-spin"
            />
          )}

          {saving
            ? "Saving..."
            : "Save Cover Theme"}
        </button>
      </div>
    </section>
  );
}