"use client";

import {
  BadgeCheck,
  Globe2,
  Loader2,
  MapPin,
  Save,
  UserRound,
} from "lucide-react";
import {
  FormEvent,
  useState,
} from "react";

import AvatarUploader from "./AvatarUploader";
import VerifiedBadge from "../ui/VerifiedBadge";
import { createClient } from "../../lib/supabase/client";

interface ProfileEditorProps {
  userId: string;
  email: string | null;

  initialProfile: {
    display_name: string | null;
    username: string | null;
    username_set: boolean;
    bio: string | null;
    avatar_url: string | null;
    location: string | null;
    website_url: string | null;
    role: string | null;
    verified: boolean;
  };
}

export default function ProfileEditor({
  userId,
  email,
  initialProfile,
}: ProfileEditorProps) {
  const supabase =
    createClient();

  const [displayName, setDisplayName] =
    useState(
      initialProfile.display_name ?? "",
    );

  const [username, setUsername] =
    useState(
      initialProfile.username ?? "",
    );

  const [bio, setBio] =
    useState(
      initialProfile.bio ?? "",
    );

  const [location, setLocation] =
    useState(
      initialProfile.location ?? "",
    );

  const [websiteUrl, setWebsiteUrl] =
    useState(
      initialProfile.website_url ?? "",
    );

  const [avatarUrl, setAvatarUrl] =
    useState<string | null>(
      initialProfile.avatar_url,
    );

  const [usernameLocked, setUsernameLocked] =
    useState(
      initialProfile.username_set ||
        Boolean(
          initialProfile.username,
        ),
    );

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // --------------------------------------------------
  // USERNAME VALIDATION
  // --------------------------------------------------

  const cleanUsername = (
    value: string,
  ) => {
    return value
      .trim()
      .toLowerCase();
  };

  const usernameIsValid = (
    value: string,
  ) => {
    return /^[a-z0-9._]{3,30}$/.test(
      value,
    );
  };

  // --------------------------------------------------
  // WEBSITE NORMALISATION
  // --------------------------------------------------

  const normaliseWebsite = (
    value: string,
  ) => {
    const clean =
      value.trim();

    if (!clean) {
      return "";
    }

    if (
      clean.startsWith(
        "http://",
      ) ||
      clean.startsWith(
        "https://",
      )
    ) {
      return clean;
    }

    return `https://${clean}`;
  };

  // --------------------------------------------------
  // SAVE PROFILE
  // --------------------------------------------------

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanDisplayName =
      displayName.trim();

    const cleanBio =
      bio.trim();

    const cleanLocation =
      location.trim();

    const cleanWebsite =
      normaliseWebsite(
        websiteUrl,
      );

    const cleanUser =
      cleanUsername(
        username,
      );

    if (!cleanDisplayName) {
      setError(
        "Please enter a display name.",
      );
      return;
    }

    if (
      cleanDisplayName.length >
      80
    ) {
      setError(
        "Display name must be 80 characters or fewer.",
      );
      return;
    }

    if (
      !usernameLocked &&
      cleanUser &&
      !usernameIsValid(
        cleanUser,
      )
    ) {
      setError(
        "Username must be 3–30 characters and can only contain lowercase letters, numbers, dots, and underscores.",
      );
      return;
    }

    if (
      cleanBio.length >
      300
    ) {
      setError(
        "Bio must be 300 characters or fewer.",
      );
      return;
    }

    if (
      cleanLocation.length >
      100
    ) {
      setError(
        "Location must be 100 characters or fewer.",
      );
      return;
    }

    try {
      setSaving(true);

      const updateData: {
        display_name: string;
        bio: string | null;
        location: string | null;
        website_url: string | null;
        username?: string;
        username_set?: boolean;
      } = {
        display_name:
          cleanDisplayName,

        bio:
          cleanBio ||
          null,

        location:
          cleanLocation ||
          null,

        website_url:
          cleanWebsite ||
          null,
      };

      if (
        !usernameLocked &&
        cleanUser
      ) {
        updateData.username =
          cleanUser;

        updateData.username_set =
          true;
      }

      const {
        error,
      } = await supabase
        .from("profiles")
        .update(updateData)
        .eq(
          "id",
          userId,
        );

      if (error) {
        if (
          error.code === "23505"
        ) {
          throw new Error(
            "That username is already taken.",
          );
        }

        if (
          error.message
            .toLowerCase()
            .includes(
              "username cannot be changed",
            )
        ) {
          throw new Error(
            "Your username cannot be changed once it has been set.",
          );
        }

        throw error;
      }

      if (
        !usernameLocked &&
        cleanUser
      ) {
        setUsernameLocked(true);
        setUsername(
          cleanUser,
        );
      }

      setWebsiteUrl(
        cleanWebsite,
      );

      setSuccess(
        "Profile updated successfully.",
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Your profile could not be updated.",
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-8"
    >
      {/* =============================================
          PROFILE HEADER
      ============================================= */}

      <section className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
              Profile
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <h2 className="text-3xl font-bold text-white">
                {
                  displayName ||
                  "Your profile"
                }
              </h2>

              {initialProfile.verified && (
                <VerifiedBadge
                  size={20}
                />
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              {usernameLocked &&
                username && (
                  <span>
                    @{username}
                  </span>
                )}

              {initialProfile.role && (
                <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs uppercase tracking-wider text-gray-400">
                  {
                    initialProfile.role
                  }
                </span>
              )}

              {initialProfile.verified && (
                <span className="inline-flex items-center gap-1.5 text-blue-300">
                  <BadgeCheck
                    size={15}
                  />
                  Verified
                </span>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {email && (
              <p>
                Signed in as{" "}
                <span className="text-gray-300">
                  {email}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8">
          <AvatarUploader
            userId={
              userId
            }
            initialAvatarUrl={
              avatarUrl
            }
            displayName={
              displayName ||
              "User"
            }
            onAvatarChange={(
              value,
            ) =>
              setAvatarUrl(
                value,
              )
            }
          />
        </div>
      </section>

      {/* =============================================
          BASIC DETAILS
      ============================================= */}

      <section className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-8">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
            <UserRound
              size={19}
            />
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
              Identity
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Profile Details
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-6">
          {/* Display Name */}

          <label className="block text-sm font-medium text-gray-300">
            Display name

            <input
              type="text"
              value={
                displayName
              }
              onChange={(
                event,
              ) =>
                setDisplayName(
                  event.target
                    .value,
                )
              }
              maxLength={80}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400"
              placeholder="Your display name"
            />

            <span className="mt-2 block text-xs text-gray-500">
              This is the name shown on comments and your public profile.
            </span>
          </label>

          {/* Username */}

          <label className="block text-sm font-medium text-gray-300">
            Username

            <div className="relative mt-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                @
              </span>

              <input
                type="text"
                value={
                  username
                }
                disabled={
                  usernameLocked
                }
                onChange={(
                  event,
                ) =>
                  setUsername(
                    event.target
                      .value,
                  )
                }
                maxLength={30}
                className="w-full rounded-xl border border-white/10 bg-black/10 py-3 pl-9 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="username"
              />
            </div>

            {usernameLocked ? (
              <span className="mt-2 block text-xs text-amber-300">
                Your username has been set and cannot be changed.
              </span>
            ) : (
              <span className="mt-2 block text-xs leading-5 text-gray-500">
                3–30 characters. Use lowercase letters, numbers, dots, and
                underscores only. Your username can only be chosen once.
              </span>
            )}
          </label>

          {/* Bio */}

          <label className="block text-sm font-medium text-gray-300">
            Bio

            <textarea
              value={bio}
              onChange={(
                event,
              ) =>
                setBio(
                  event.target
                    .value,
                )
              }
              maxLength={300}
              rows={5}
              className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400"
              placeholder="Tell people a little about yourself..."
            />

            <div className="mt-2 flex justify-end">
              <span className="text-xs text-gray-500">
                {bio.length}/300
              </span>
            </div>
          </label>
        </div>
      </section>

      {/* =============================================
          ADDITIONAL DETAILS
      ============================================= */}

      <section className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
            Details
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Additional Information
          </h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Location */}

          <label className="block text-sm font-medium text-gray-300">
            Location

            <div className="relative mt-2">
              <MapPin
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={
                  location
                }
                onChange={(
                  event,
                ) =>
                  setLocation(
                    event.target
                      .value,
                  )
                }
                maxLength={100}
                placeholder="City, Country"
                className="w-full rounded-xl border border-white/10 bg-black/10 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400"
              />
            </div>
          </label>

          {/* Website */}

          <label className="block text-sm font-medium text-gray-300">
            Website

            <div className="relative mt-2">
              <Globe2
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={
                  websiteUrl
                }
                onChange={(
                  event,
                ) =>
                  setWebsiteUrl(
                    event.target
                      .value,
                  )
                }
                maxLength={300}
                placeholder="https://example.com"
                className="w-full rounded-xl border border-white/10 bg-black/10 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400"
              />
            </div>
          </label>
        </div>
      </section>

      {/* =============================================
          MESSAGES
      ============================================= */}

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm text-green-300"
        >
          {success}
        </p>
      )}

      {/* =============================================
          SAVE
      ============================================= */}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={
            saving
          }
          className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Save
              size={18}
            />
          )}

          {saving
            ? "Saving..."
            : "Save Profile"}
        </button>
      </div>
    </form>
  );
}