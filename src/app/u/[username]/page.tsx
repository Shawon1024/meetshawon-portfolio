import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Ban,
  BriefcaseBusiness,
  Clock3,
  ExternalLink,
  Globe2,
  HardDrive,
  MapPin,
  Mars,
  Phone,
  Pencil,
  ShieldQuestion,
  Sparkles,
  Transgender,
  UserRound,
  Venus,
} from "lucide-react";
import {
  notFound,
  redirect,
} from "next/navigation";

import Container from "../../components/Container";
import ProfileAvatar from "../../components/ui/ProfileAvatar";
import RoleBadge from "../../components/ui/RoleBadge";
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
  const {
    username,
  } = await params;

  const cleanUsername =
    username
      .trim()
      .toLowerCase();

  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    return {
      title:
        "User Profile",
      description:
        "Sign in to view this user profile.",
    };
  }

  const {
    data: profile,
  } = await supabase
    .from("profiles")
    .select(`
      first_name,
      last_name,
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
        "Profile Not Found",
    };
  }

  const name =
    [
      profile.first_name?.trim(),
      profile.last_name?.trim(),
    ]
      .filter(Boolean)
      .join(" ") ||
    profile.username ||
    "User";

  const description =
    profile.bio?.trim() ||
    `View ${name}'s profile.`;

  return {
    title:
      `${name} (@${profile.username})`,

    description,

    alternates: {
      canonical:
        `/u/${profile.username}`,
    },

    openGraph: {
      type:
        "profile",

      title:
        `${name} (@${profile.username})`,

      description,

      url:
        `/u/${profile.username}`,
    },

    twitter: {
      card:
        "summary",

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
  const {
    username,
  } = await params;

  const cleanUsername =
    username
      .trim()
      .toLowerCase();

  const supabase =
    await createClient();

  // --------------------------------------------------
  // AUTH
  // --------------------------------------------------

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth/sign-in?next=/u/${cleanUsername}`,
    );
  }

  // --------------------------------------------------
  // PROFILE
  // --------------------------------------------------

  const {
    data: profile,
    error,
  } = await supabase
    .from("profiles")
    .select(`
      id,
      first_name,
      last_name,
      username,
      bio,
      avatar_url,
      cover_theme,
      location,
      job_title,
      gender,
      website_url,
      github_url,
      linkedin_url,
      phone_country_code,
      phone_number,
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

  // --------------------------------------------------
  // VIEWER ROLE
  // --------------------------------------------------

  const {
    data: viewerProfile,
  } = await supabase
    .from("profiles")
    .select(`
      role
    `)
    .eq(
      "id",
      user.id,
    )
    .maybeSingle();

  // --------------------------------------------------
  // ACCOUNT RESTRICTION
  // --------------------------------------------------

  const {
    data: restriction,
    error: restrictionError,
  } = await supabase
    .from("account_restrictions")
    .select(`
      status,
      public_reason,
      expires_at
    `)
    .eq(
      "user_id",
      profile.id,
    )
    .maybeSingle();

  if (restrictionError) {
    console.error(
      "Profile restriction could not be loaded:",
      restrictionError,
    );
  }

  const fullName =
    [
      profile.first_name?.trim(),
      profile.last_name?.trim(),
    ]
      .filter(Boolean)
      .join(" ") ||
    profile.username ||
    "User";

  const getGenderLabel = (
    value: string | null,
  ) => {
    switch (value) {
      case "male":
        return "Male";

      case "female":
        return "Female";

      case "non_binary":
        return "Non-binary";

      case "other":
        return "Other";

      case "prefer_not_to_say":
        return "Prefer not to say";

      default:
        return null;
    }
  };

  const GenderIcon = (() => {
    switch (profile.gender) {
      case "male":
        return Mars;

      case "female":
        return Venus;

      case "non_binary":
        return Transgender;

      case "other":
        return Sparkles;

      case "prefer_not_to_say":
        return ShieldQuestion;

      default:
        return null;
    }
  })();

  const genderLabel =
    getGenderLabel(
      profile.gender,
    );

  const contactNumber =
    profile.phone_number
      ? [
          profile.phone_country_code,
          profile.phone_number,
        ]
          .filter(Boolean)
          .join(" ")
      : null;

  const hasDetails =
    Boolean(
      profile.job_title ||
        profile.gender ||
        profile.location ||
        contactNumber,
    );

  const hasSocialLinks =
    Boolean(
      profile.website_url ||
        profile.github_url ||
        profile.linkedin_url,
    );

  const profileUrl =
    `/u/${profile.username}`;

  const isOwnProfile =
    user.id ===
    profile.id;

  const canUseDrive =
    isOwnProfile &&
    (
      profile.role ===
        "admin" ||
      profile.role ===
        "partner"
    );

  const viewerIsStaff =
    viewerProfile?.role ===
      "admin" ||
    viewerProfile?.role ===
      "moderator";

  const canSeeRestriction =
    isOwnProfile ||
    viewerIsStaff;

  const effectiveRestrictionStatus =
    restriction?.status ??
    "active";

  const coverThemeImages: Record<
    string,
    string
  > = {
    emerald:
      "/images/profile-covers/cyber-green.png",

    ocean:
      "/images/profile-covers/deep-ocean.png",

    violet:
      "/images/profile-covers/purple-nebula.png",

    amber:
      "/images/profile-covers/crimson-flow.png",

    midnight:
      "/images/profile-covers/midnight-smoke.png",
  };

  const coverThemeImage =
    coverThemeImages[
      profile.cover_theme ??
        "emerald"
    ] ??
    coverThemeImages.emerald;

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

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
              {/* Profile cover */}

              <div
                className="relative h-36 overflow-hidden border-b border-white/5 md:h-44"
                style={{
                  backgroundImage:
                    `url("${coverThemeImage}")`,
                  backgroundSize:
                    "cover",
                  backgroundPosition:
                    "center",
                }}
              >
                <div className="absolute inset-0 bg-black/5" />

                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <div className="px-6 pb-8 md:px-10 md:pb-10">
                {/* =================================================
                    AVATAR + PROFILE ACTIONS
                ================================================= */}

                <div className="relative z-20 -mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  {/* Avatar */}

                  <div>
                    <ProfileAvatar
                      avatarUrl={
                        profile.avatar_url
                      }
                      gender={
                        profile.gender
                      }
                      name={
                        fullName
                      }
                      className="h-28 w-28 border-4 border-[#102A2A] shadow-xl md:h-32 md:w-32"
                      iconSize={
                        44
                      }
                    />
                  </div>

                  {/* Own-profile actions */}

                  {isOwnProfile && (
                    <div className="flex flex-wrap items-center gap-3 sm:pb-1">
                      <Link
                        href="/account"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-100 transition hover:border-green-400/30 hover:bg-white/[0.08] hover:text-white"
                      >
                        <Pencil
                          size={16}
                        />

                        Edit Profile
                      </Link>

                      {canUseDrive && (
                        <a
                          href="https://drive.meetshawon.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/10 px-4 py-2.5 text-sm font-medium text-sky-300 transition hover:border-sky-400/40 hover:bg-sky-400/15"
                        >
                          <HardDrive
                            size={16}
                          />

                          Drive

                          <ExternalLink
                            size={13}
                          />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* =================================================
                    IDENTITY
                ================================================= */}

                <div className="mt-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-bold text-white md:text-4xl">
                      {
                        fullName
                      }
                    </h1>

                    {profile.verified && (
                      <VerifiedBadge
                        size={22}
                      />
                    )}

                    <RoleBadge
                      role={
                        profile.role
                      }
                      showUser
                      size="md"
                    />
                  </div>

                  <p className="mt-2 text-lg text-gray-400">
                    @
                    {
                      profile.username
                    }
                  </p>

                  {canSeeRestriction &&
                    effectiveRestrictionStatus ===
                      "restricted" && (
                      <div className="mt-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-sm font-medium text-amber-300">
                          <Clock3
                            size={15}
                          />

                          Restricted

                          {restriction?.expires_at && (
                            <span>
                              {" until "}
                              {new Intl.DateTimeFormat(
                                "en-GB",
                                {
                                  day:
                                    "numeric",
                                  month:
                                    "short",
                                  year:
                                    "numeric",
                                  hour:
                                    "2-digit",
                                  minute:
                                    "2-digit",
                                },
                              ).format(
                                new Date(
                                  restriction.expires_at,
                                ),
                              )}
                            </span>
                          )}
                        </div>

                        {restriction?.public_reason && (
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-amber-200/70">
                            Reason:{" "}
                            {
                              restriction.public_reason
                            }
                          </p>
                        )}
                      </div>
                    )}

                  {canSeeRestriction &&
                    effectiveRestrictionStatus ===
                      "blocked" && (
                      <div className="mt-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-sm font-medium text-red-300">
                          <Ban
                            size={15}
                          />

                          Blocked
                        </div>

                        {restriction?.public_reason && (
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-red-200/70">
                            Reason:{" "}
                            {
                              restriction.public_reason
                            }
                          </p>
                        )}
                      </div>
                    )}
                </div>

                {/* =================================================
                    BIO
                ================================================= */}

                {profile.bio && (
                  <p className="mt-6 max-w-2xl whitespace-pre-wrap leading-8 text-gray-300">
                    {
                      profile.bio
                    }
                  </p>
                )}

                {/* =================================================
                    DETAILS
                ================================================= */}

                {hasDetails && (
                  <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-400">
                    {profile.job_title && (
                      <span className="inline-flex items-center gap-2">
                        <BriefcaseBusiness
                          size={16}
                        />

                        {
                          profile.job_title
                        }
                      </span>
                    )}

{profile.gender &&
  genderLabel &&
  GenderIcon && (
    <span
      className={`inline-flex items-center gap-2 ${
        profile.gender === "male"
          ? "text-blue-300"
          : profile.gender === "female"
            ? "text-pink-300"
            : profile.gender === "non_binary"
              ? "text-purple-300"
              : profile.gender === "other"
                ? "text-amber-300"
                : profile.gender === "prefer_not_to_say"
                  ? "text-slate-300"
                  : "text-gray-300"
      }`}
    >
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full border ${
          profile.gender === "male"
            ? "border-blue-400/20 bg-blue-400/10"
            : profile.gender === "female"
              ? "border-pink-400/20 bg-pink-400/10"
              : profile.gender === "non_binary"
                ? "border-purple-400/20 bg-purple-400/10"
                : profile.gender === "other"
                  ? "border-amber-400/20 bg-amber-400/10"
                  : profile.gender === "prefer_not_to_say"
                    ? "border-slate-400/20 bg-slate-400/10"
                    : "border-white/10 bg-white/5"
        }`}
      >
        <GenderIcon
          size={15}
        />
      </span>

      <span>
        {genderLabel}
      </span>
    </span>
  )}

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

                    {contactNumber && (
                      <span className="inline-flex items-center gap-2">
                        <Phone
                          size={16}
                        />

                        {
                          contactNumber
                        }
                      </span>
                    )}
                  </div>
                )}

                {hasSocialLinks && (
                  <div className="mt-6 flex items-center gap-3">
                    {profile.website_url && (
                      <a
                        href={
                          profile.website_url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        title={
                          profile.website_url
                        }
                        aria-label="Open website in a new tab"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gray-500 transition hover:border-green-400/30 hover:bg-green-400/10 hover:text-green-300"
                      >
                        <Globe2
                          size={19}
                        />
                      </a>
                    )}

                    {profile.github_url && (
                      <a
                        href={
                          profile.github_url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        title={
                          profile.github_url
                        }
                        aria-label="Open GitHub profile in a new tab"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gray-500 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                      >
                        <Globe2
                          size={19}
                        />
                      </a>
                    )}

                    {profile.linkedin_url && (
                      <a
                        href={
                          profile.linkedin_url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        title={
                          profile.linkedin_url
                        }
                        aria-label="Open LinkedIn profile in a new tab"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gray-500 transition hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-sky-300"
                      >
                        <Globe2
                          size={19}
                        />
                      </a>
                    )}
                  </div>
                )}

                {/* =================================================
                    PROFILE URL
                ================================================= */}

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