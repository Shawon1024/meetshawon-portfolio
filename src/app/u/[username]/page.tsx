import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ExternalLink,
  Globe2,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  notFound,
  redirect,
} from "next/navigation";

import Container from "../../components/Container";
import VerifiedBadge from "../../components/ui/VerifiedBadge";
import { createClient } from "../../lib/supabase/server";

interface PublicProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

// --------------------------------------------------
// METADATA
// --------------------------------------------------

export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  const { username } =
    await params;

  const cleanUsername =
    username
      .trim()
      .toLowerCase();

  const supabase =
    await createClient();

  // Check auth before trying to read the profile.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      title:
        "User Profile | Shawon",
      description:
        "Sign in to view this user profile.",
    };
  }

  const {
    data: profile,
  } = await supabase
    .from("profiles")
    .select(`
      display_name,
      username,
      bio
    `)
    .eq(
      "username",
      cleanUsername,
    )
    .maybeSingle();

  if (!profile) {
    return {
      title:
        "Profile Not Found | Shawon",
    };
  }

  const name =
    profile.display_name ??
    profile.username ??
    "User";

  const description =
    profile.bio?.trim() ||
    `View ${name}'s profile.`;

  return {
    title:
      `${name} (@${profile.username}) | Shawon`,

    description,

    alternates: {
      canonical:
        `/u/${profile.username}`,
    },

    openGraph: {
      type: "profile",
      title:
        `${name} (@${profile.username})`,
      description,
      url:
        `/u/${profile.username}`,
    },

    twitter: {
      card: "summary",
      title:
        `${name} (@${profile.username})`,
      description,
    },
  };
}

// --------------------------------------------------
// PAGE
// --------------------------------------------------

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { username } =
    await params;

  const cleanUsername =
    username
      .trim()
      .toLowerCase();

  const supabase =
    await createClient();

  // --------------------------------------------------
  // AUTH CHECK
  // --------------------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth/sign-in?next=/u/${cleanUsername}`,
    );
  }

  // --------------------------------------------------
  // LOAD PROFILE
  // --------------------------------------------------

  const {
    data: profile,
    error,
  } = await supabase
    .from("profiles")
    .select(`
      id,
      display_name,
      username,
      bio,
      avatar_url,
      location,
      website_url,
      role,
      verified
    `)
    .eq(
      "username",
      cleanUsername,
    )
    .maybeSingle();

  if (
    error ||
    !profile ||
    !profile.username
  ) {
    notFound();
  }

  const displayName =
    profile.display_name ??
    profile.username;

  const profileUrl =
    `/u/${profile.username}`;

  return (
    <main>
      {/* =================================================
          HEADER
      ================================================= */}

      <section className="px-6 pb-10 pt-16 md:pt-24">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-green-400"
          >
            <ArrowLeft
              size={16}
            />

            Back to Blog
          </Link>
        </div>
      </section>

      {/* =================================================
          PROFILE
      ================================================= */}

      <section className="px-6 pb-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <article className="overflow-hidden rounded-3xl border border-white/10 bg-[var(--surface)]/70">
              {/* Decorative top */}

              <div className="h-28 border-b border-white/5 bg-gradient-to-r from-green-400/10 via-transparent to-blue-400/10 md:h-36" />

              <div className="px-6 pb-8 md:px-10 md:pb-10">
                {/* Avatar + Role */}

                <div className="-mt-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex items-end gap-5">
                    {profile.avatar_url ? (
                      <img
                        src={
                          profile.avatar_url
                        }
                        alt={`${displayName} profile photo`}
                        className="h-28 w-28 shrink-0 rounded-full border-4 border-[#102A2A] bg-[#102A2A] object-cover shadow-xl md:h-32 md:w-32"
                      />
                    ) : (
                      <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-[#102A2A] bg-green-400/10 text-3xl font-bold text-green-300 shadow-xl md:h-32 md:w-32">
                        {displayName
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>

                  {profile.role ===
                    "admin" && (
                    <div className="inline-flex items-center gap-2 self-start rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-300 sm:self-auto">
                      <ShieldCheck
                        size={14}
                      />

                      Admin
                    </div>
                  )}
                </div>

                {/* Identity */}

                <div className="mt-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-bold text-white md:text-4xl">
                      {
                        displayName
                      }
                    </h1>

                    {profile.verified && (
                      <VerifiedBadge
                        size={22}
                      />
                    )}
                  </div>

                  <p className="mt-2 text-lg text-gray-400">
                    @
                    {
                      profile.username
                    }
                  </p>
                </div>

                {/* Bio */}

                {profile.bio && (
                  <p className="mt-6 max-w-2xl whitespace-pre-wrap leading-8 text-gray-300">
                    {
                      profile.bio
                    }
                  </p>
                )}

                {/* Details */}

                {(profile.location ||
                  profile.website_url) && (
                  <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-400">
                    {profile.location && (
                      <span className="inline-flex items-center gap-2">
                        <MapPin
                          size={16}
                        />

                        {
                          profile.location
                        }
                      </span>
                    )}

                    {profile.website_url && (
                      <a
                        href={
                          profile.website_url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-green-400 transition hover:text-green-300"
                      >
                        <Globe2
                          size={16}
                        />

                        {profile.website_url.replace(
                          /^https?:\/\//,
                          "",
                        )}

                        <ExternalLink
                          size={13}
                        />
                      </a>
                    )}
                  </div>
                )}

                {/* Profile URL */}

                <div className="mt-8 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <UserRound
                      size={14}
                    />

                    Profile:
                    <span className="text-gray-500">
                      {
                        profileUrl
                      }
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </Container>
      </section>
    </main>
  );
}