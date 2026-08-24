"use client";

import {
  BadgeCheck,
  BriefcaseBusiness,
  Globe2,
  Loader2,
  Phone,
  Save,
  UserRound,
  UsersRound,
} from "lucide-react";
import {
  FormEvent,
  useRef,
  useState,
} from "react";
import LocationSearch from "./LocationSearch";
import RoleBadge from "../ui/RoleBadge";
import AvatarUploader from "./AvatarUploader";
import VerifiedBadge from "../ui/VerifiedBadge";
import { createClient } from "../../lib/supabase/client";
import ProfileCompletionCard from "./ProfileCompletionCard";

interface ProfileEditorProps {
  userId: string;
  email: string | null;

  initialProfile: {
    username: string | null;
    username_set: boolean;

    first_name: string | null;
    last_name: string | null;

    bio: string | null;
    avatar_url: string | null;
    location: string | null;

    job_title: string | null;
    gender: string | null;

    website_url: string | null;
    github_url: string | null;
    linkedin_url: string | null;

    phone_country_code: string | null;
    phone_number: string | null;

    profile_completion_rewarded: boolean;

    role: string | null;
    verified: boolean;
  };
}


const COUNTRY_CODES = [
  { country: "Australia", code: "+61", flag: "🇦🇺" },
  { country: "Bangladesh", code: "+880", flag: "🇧🇩" },
  { country: "Canada", code: "+1", flag: "🇨🇦" },
  { country: "China", code: "+86", flag: "🇨🇳" },
  { country: "Denmark", code: "+45", flag: "🇩🇰" },
  { country: "France", code: "+33", flag: "🇫🇷" },
  { country: "Germany", code: "+49", flag: "🇩🇪" },
  { country: "India", code: "+91", flag: "🇮🇳" },
  { country: "Ireland", code: "+353", flag: "🇮🇪" },
  { country: "Italy", code: "+39", flag: "🇮🇹" },
  { country: "Japan", code: "+81", flag: "🇯🇵" },
  { country: "Malaysia", code: "+60", flag: "🇲🇾" },
  { country: "Netherlands", code: "+31", flag: "🇳🇱" },
  { country: "Norway", code: "+47", flag: "🇳🇴" },
  { country: "Pakistan", code: "+92", flag: "🇵🇰" },
  { country: "Qatar", code: "+974", flag: "🇶🇦" },
  { country: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { country: "Singapore", code: "+65", flag: "🇸🇬" },
  { country: "South Korea", code: "+82", flag: "🇰🇷" },
  { country: "Spain", code: "+34", flag: "🇪🇸" },
  { country: "Sweden", code: "+46", flag: "🇸🇪" },
  { country: "Switzerland", code: "+41", flag: "🇨🇭" },
  { country: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { country: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { country: "United States", code: "+1", flag: "🇺🇸" },
];

export default function ProfileEditor({
  userId,
  email,
  initialProfile,
}: ProfileEditorProps) {
  const supabase =
    createClient();

  const [
  profileCompletionRewarded,
  setProfileCompletionRewarded,
] =
  useState(
    initialProfile
      .profile_completion_rewarded,
  );

    const [
    firstName,
    setFirstName,
  ] =
    useState(
      initialProfile.first_name ??
        "",
    );

  const [
    lastName,
    setLastName,
  ] =
    useState(
      initialProfile.last_name ??
        "",
    );

  const [
    username,
    setUsername,
  ] =
    useState(
      initialProfile.username ??
        "",
    );

  const [
    bio,
    setBio,
  ] =
    useState(
      initialProfile.bio ??
        "",
    );

  const [
    location,
    setLocation,
  ] =
    useState(
      initialProfile.location ??
        "",
    );

  const [
    jobTitle,
    setJobTitle,
  ] =
    useState(
      initialProfile.job_title ??
        "",
    );

  const [
    gender,
    setGender,
  ] =
    useState(
      initialProfile.gender ??
        "",
    );

  const [
    websiteUrl,
    setWebsiteUrl,
  ] =
    useState(
      initialProfile.website_url ??
        "",
    );

  const [
    githubUrl,
    setGithubUrl,
  ] =
    useState(
      initialProfile.github_url ??
        "",
    );

  const [
    linkedinUrl,
    setLinkedinUrl,
  ] =
    useState(
      initialProfile.linkedin_url ??
        "",
    );

  const [
    phoneCountryCode,
    setPhoneCountryCode,
  ] =
    useState(
      initialProfile.phone_country_code ??
        "+44",
    );

  const [
    phoneNumber,
    setPhoneNumber,
  ] =
    useState(
      initialProfile.phone_number ??
        "",
    );

  const [
    avatarUrl,
    setAvatarUrl,
  ] =
    useState<string | null>(
      initialProfile.avatar_url,
    );

  const [
    usernameLocked,
    setUsernameLocked,
  ] =
    useState(
      initialProfile.username_set ||
        Boolean(
          initialProfile.username,
        ),
    );

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const savedProfileRef =
    useRef({
      first_name:
        initialProfile.first_name ??
        "",

      last_name:
        initialProfile.last_name ??
        "",

      username:
        initialProfile.username ??
        "",

      bio:
        initialProfile.bio ??
        "",

      location:
        initialProfile.location ??
        "",

      job_title:
        initialProfile.job_title ??
        "",

      gender:
        initialProfile.gender ??
        "",

      website_url:
        initialProfile.website_url ??
        "",

      github_url:
        initialProfile.github_url ??
        "",

      linkedin_url:
        initialProfile.linkedin_url ??
        "",

      phone_country_code:
        initialProfile.phone_country_code ??
        "",

      phone_number:
        initialProfile.phone_number ??
        "",

    });

  const fullName =
    [
      firstName.trim(),
      lastName.trim(),
    ]
      .filter(Boolean)
      .join(" ");

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
  // URL NORMALISATION
  // --------------------------------------------------

  const normaliseUrl = (
    value: string,
  ) => {
    const clean =
      value.trim();

    if (!clean) {
      return "";
    }

    if (
      clean.startsWith(
        "https://",
      )
    ) {
      return clean;
    }

    if (
      clean.startsWith(
        "http://",
      )
    ) {
      return `https://${clean.slice(
        7,
      )}`;
    }

    return `https://${clean}`;
  };

  const urlIsValid = (
    value: string,
  ) => {
    if (!value) {
      return true;
    }

    try {
      const url =
        new URL(value);

      return (
        url.protocol ===
          "https:" &&
        Boolean(url.hostname)
      );
    } catch {
      return false;
    }
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

    const cleanFirstName =
      firstName.trim();

    const cleanLastName =
      lastName.trim();

    const cleanBio =
      bio.trim();

    const cleanLocation =
      location.trim();

    const cleanJobTitle =
      jobTitle.trim();

    const cleanWebsite =
      normaliseUrl(
        websiteUrl,
      );

    const cleanGithub =
      normaliseUrl(
        githubUrl,
      );

    const cleanLinkedin =
      normaliseUrl(
        linkedinUrl,
      );

    const cleanPhone =
      phoneNumber.trim();

    const cleanUser =
      cleanUsername(
        username,
      );

    if (
      !cleanFirstName ||
      !cleanLastName
    ) {
      setError(
        "First name and last name are required.",
      );

      return;
    }

    if (
      cleanFirstName.length >
      60
    ) {
      setError(
        "First name must be 60 characters or fewer.",
      );

      return;
    }

    if (
      cleanLastName.length >
      60
    ) {
      setError(
        "Last name must be 60 characters or fewer.",
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

    if (
      cleanJobTitle.length >
      100
    ) {
      setError(
        "Profession must be 100 characters or fewer.",
      );

      return;
    }

    if (
      cleanPhone &&
      !/^[0-9 ()-]{5,25}$/.test(
        cleanPhone,
      )
    ) {
      setError(
        "Please enter a valid contact number.",
      );

      return;
    }

    if (
      !urlIsValid(
        cleanWebsite,
      )
    ) {
      setError(
        "Please enter a valid website URL.",
      );

      return;
    }

    if (
      !urlIsValid(
        cleanGithub,
      )
    ) {
      setError(
        "Please enter a valid GitHub URL.",
      );

      return;
    }

    if (
      !urlIsValid(
        cleanLinkedin,
      )
    ) {
      setError(
        "Please enter a valid LinkedIn URL.",
      );

      return;
    }

    try {
      setSaving(
        true,
      );

      const previous =
        savedProfileRef.current;

      const updateData: {
        first_name?: string;
        last_name?: string;
        bio?: string | null;
        location?: string | null;
        job_title?: string | null;
        gender?: string | null;
        website_url?: string | null;
        github_url?: string | null;
        linkedin_url?: string | null;
        phone_country_code?: string | null;
        phone_number?: string | null;
        username?: string;
        username_set?: boolean;
      } = {};

      // --------------------------------------------------
      // ONLY SAVE FIELDS CHANGED IN THIS TAB
      // --------------------------------------------------

      if (
        cleanFirstName !==
        previous.first_name
      ) {
        updateData.first_name =
          cleanFirstName;
      }

      if (
        cleanLastName !==
        previous.last_name
      ) {
        updateData.last_name =
          cleanLastName;
      }

      if (
        cleanBio !==
        previous.bio
      ) {
        updateData.bio =
          cleanBio ||
          null;
      }

      if (
        cleanLocation !==
        previous.location
      ) {
        updateData.location =
          cleanLocation ||
          null;
      }

      if (
        cleanJobTitle !==
        previous.job_title
      ) {
        updateData.job_title =
          cleanJobTitle ||
          null;
      }

      if (
        gender !==
        previous.gender
      ) {
        updateData.gender =
          gender ||
          null;
      }

      if (
        cleanWebsite !==
        previous.website_url
      ) {
        updateData.website_url =
          cleanWebsite ||
          null;
      }

      if (
        cleanGithub !==
        previous.github_url
      ) {
        updateData.github_url =
          cleanGithub ||
          null;
      }

      if (
        cleanLinkedin !==
        previous.linkedin_url
      ) {
        updateData.linkedin_url =
          cleanLinkedin ||
          null;
      }

      if (
        cleanPhone !==
        previous.phone_number
      ) {
        updateData.phone_number =
          cleanPhone ||
          null;

        updateData.phone_country_code =
          cleanPhone
            ? phoneCountryCode
            : null;
      } else if (
        cleanPhone &&
        phoneCountryCode !==
          previous.phone_country_code
      ) {
        updateData.phone_country_code =
          phoneCountryCode;
      }

      if (
        !usernameLocked &&
        cleanUser &&
        cleanUser !==
          previous.username
      ) {
        updateData.username =
          cleanUser;

        updateData.username_set =
          true;
      }

      if (
        Object.keys(
          updateData,
        ).length === 0
      ) {
        setSuccess(
          "No profile changes to save.",
        );

        return;
      }

const {
  data:
    updatedProfile,
  error:
    updateError,
} = await supabase
  .from("profiles")
  .update(
    updateData,
  )
  .eq(
    "id",
    userId,
  )
  .select(`
    profile_completion_rewarded
  `)
  .single();

      if (
        updateError
      ) {
        if (
          updateError.code ===
          "23505"
        ) {
          throw new Error(
            "That username is already taken.",
          );
        }

        if (
          updateError.message
            .toLowerCase()
            .includes(
              "username cannot be changed",
            )
        ) {
          throw new Error(
            "Your username cannot be changed once it has been set.",
          );
        }

        const errorDetails = [
          updateError.code
            ? `Code: ${updateError.code}`
            : null,

          updateError.message
            ? `Message: ${updateError.message}`
            : null,

          updateError.details
            ? `Details: ${updateError.details}`
            : null,

          updateError.hint
            ? `Hint: ${updateError.hint}`
            : null,
        ]
          .filter(Boolean)
          .join(" | ");

        throw new Error(
          errorDetails ||
            "Your profile could not be updated.",
        );
      }

      if (
        updatedProfile
          ?.profile_completion_rewarded
      ) {
        setProfileCompletionRewarded(
          true,
        );
      }

      if (
        updateData.username !==
        undefined
      ) {
        setUsernameLocked(
          true,
        );

        setUsername(
          cleanUser,
        );
      }

      if (
        updateData.first_name !==
        undefined
      ) {
        setFirstName(
          cleanFirstName,
        );
      }

      if (
        updateData.last_name !==
        undefined
      ) {
        setLastName(
          cleanLastName,
        );
      }

      if (
        updateData.website_url !==
        undefined
      ) {
        setWebsiteUrl(
          cleanWebsite,
        );
      }

      if (
        updateData.github_url !==
        undefined
      ) {
        setGithubUrl(
          cleanGithub,
        );
      }

      if (
        updateData.linkedin_url !==
        undefined
      ) {
        setLinkedinUrl(
          cleanLinkedin,
        );
      }

      if (
        updateData.phone_number !==
        undefined
      ) {
        setPhoneNumber(
          cleanPhone,
        );
      }

      savedProfileRef.current = {
        ...savedProfileRef.current,

        ...(updateData.first_name !==
        undefined
          ? {
              first_name:
                cleanFirstName,
            }
          : {}),

        ...(updateData.last_name !==
        undefined
          ? {
              last_name:
                cleanLastName,
            }
          : {}),

        ...(updateData.username !==
        undefined
          ? {
              username:
                cleanUser,
            }
          : {}),

        ...(updateData.bio !==
        undefined
          ? {
              bio:
                cleanBio,
            }
          : {}),

        ...(updateData.location !==
        undefined
          ? {
              location:
                cleanLocation,
            }
          : {}),

        ...(updateData.job_title !==
        undefined
          ? {
              job_title:
                cleanJobTitle,
            }
          : {}),

        ...(updateData.gender !==
        undefined
          ? {
              gender,
            }
          : {}),

        ...(updateData.website_url !==
        undefined
          ? {
              website_url:
                cleanWebsite,
            }
          : {}),

        ...(updateData.github_url !==
        undefined
          ? {
              github_url:
                cleanGithub,
            }
          : {}),

        ...(updateData.linkedin_url !==
        undefined
          ? {
              linkedin_url:
                cleanLinkedin,
            }
          : {}),

        ...(updateData.phone_country_code !==
        undefined
          ? {
              phone_country_code:
                cleanPhone
                  ? phoneCountryCode
                  : "",
            }
          : {}),

        ...(updateData.phone_number !==
        undefined
          ? {
              phone_number:
                cleanPhone,
            }
          : {}),

      };

      setSuccess(
        "Profile updated successfully.",
      );
    } catch (
      error
    ) {
      console.error(
        "Profile update failed:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Your profile could not be updated.",
      );
    } finally {
      setSaving(
        false,
      );
    }
  };

  const inputStyles =
    "mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-8"
    >

            {/* PROFILE COMPLETION */}

      <ProfileCompletionCard
        firstName={
          firstName
        }
        lastName={
          lastName
        }
        username={
          username
        }
        avatarUrl={
          avatarUrl
        }
        bio={
          bio
        }
        jobTitle={
          jobTitle
        }
        gender={
          gender
        }
        location={
          location
        }
        phoneNumber={
          phoneNumber
        }
        websiteUrl={
          websiteUrl
        }
        githubUrl={
          githubUrl
        }
        linkedinUrl={
          linkedinUrl
        }
        rewarded={
          profileCompletionRewarded
        }
      />

      {/* PROFILE HEADER */}

      <section className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
              Profile
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <h2 className="text-3xl font-bold text-white">
                {fullName ||
                  "Your profile"}
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

              <RoleBadge
                role={
                  initialProfile.role
                }
                showUser
              />

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
    fullName ||
    "User"
  }
  gender={
    gender ||
    null
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

      {/* IDENTITY */}

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
          <div className="grid gap-6 md:grid-cols-2">
            <label className="block text-sm font-medium text-gray-300">
              First name
              <span className="ml-1 text-red-400">
                *
              </span>

              <input
                type="text"
                value={
                  firstName
                }
                onChange={(
                  event,
                ) =>
                  setFirstName(
                    event.target
                      .value,
                  )
                }
                maxLength={60}
                className={
                  inputStyles
                }
                autoComplete="given-name"
                placeholder="First name"
                required
              />
            </label>

            <label className="block text-sm font-medium text-gray-300">
              Last name
              <span className="ml-1 text-red-400">
                *
              </span>

              <input
                type="text"
                value={
                  lastName
                }
                onChange={(
                  event,
                ) =>
                  setLastName(
                    event.target
                      .value,
                  )
                }
                maxLength={60}
                className={
                  inputStyles
                }
                autoComplete="family-name"
                placeholder="Last name"
                required
              />
            </label>
          </div>

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

          <label className="block text-sm font-medium text-gray-300">
            Bio

            <textarea
              value={
                bio
              }
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

      {/* PROFESSIONAL */}

      <section className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-8">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
            <BriefcaseBusiness
              size={19}
            />
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-300">
              Professional
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Professional Information
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <label className="block text-sm font-medium text-gray-300">
            Profession

            <div className="relative mt-2">
              <BriefcaseBusiness
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={
                  jobTitle
                }
                onChange={(
                  event,
                ) =>
                  setJobTitle(
                    event.target
                      .value,
                  )
                }
                maxLength={100}
                placeholder="e.g. Security Analyst"
                className="w-full rounded-xl border border-white/10 bg-black/10 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400"
              />
            </div>
          </label>

          <label className="block text-sm font-medium text-gray-300">
            Gender

            <div className="relative mt-2">
              <UsersRound
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <select
                value={
                  gender
                }
                onChange={(
                  event,
                ) =>
                  setGender(
                    event.target
                      .value,
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-black/10 py-3 pl-11 pr-4 text-white outline-none transition focus:border-green-400"
              >
                <option value="" className="bg-[#102A2A]">
                  Not specified
                </option>
                <option value="male" className="bg-[#102A2A]">
                  Male
                </option>
                <option value="female" className="bg-[#102A2A]">
                  Female
                </option>
                <option value="non_binary" className="bg-[#102A2A]">
                  Non-binary
                </option>
                <option value="other" className="bg-[#102A2A]">
                  Other
                </option>
                <option value="prefer_not_to_say" className="bg-[#102A2A]">
                  Prefer not to say
                </option>
              </select>
            </div>
          </label>

<LocationSearch
  value={
    location
  }
  onChange={
    setLocation
  }
/>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-300">
                Contact number
              </p>

              <span className="text-xs text-gray-500">
                Optional
              </span>
            </div>

            <div className="mt-2 grid gap-3 sm:grid-cols-[165px_1fr]">
              <label className="block">
                <span className="sr-only">
                  Country calling code
                </span>

                <select
                  value={
                    phoneCountryCode
                  }
                  onChange={(
                    event,
                  ) =>
                    setPhoneCountryCode(
                      event.target
                        .value,
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/10 px-3 py-3 text-sm text-white outline-none transition focus:border-green-400"
                  aria-label="Country calling code"
                >
                  {COUNTRY_CODES.map(
                    (
                      item,
                    ) => (
                      <option
                        key={`${item.country}-${item.code}`}
                        value={
                          item.code
                        }
                        className="bg-[#102A2A] text-white"
                      >
                        {item.flag}{" "}
                        {item.country}{" "}
                        ({item.code})
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label className="block">
                <span className="sr-only">
                  Contact number
                </span>

                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    type="tel"
                    value={
                      phoneNumber
                    }
                    onChange={(
                      event,
                    ) =>
                      setPhoneNumber(
                        event.target
                          .value,
                      )
                    }
                    maxLength={25}
                    placeholder="Contact number"
                    autoComplete="tel-national"
                    className="w-full rounded-xl border border-white/10 bg-black/10 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* LINKS */}

      <section className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
            Links
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Websites & Social Profiles
          </h2>
        </div>

        <div className="mt-8 grid gap-6">
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

          <label className="block text-sm font-medium text-gray-300">
            GitHub

            <div className="relative mt-2">
              <Globe2
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={
                  githubUrl
                }
                onChange={(
                  event,
                ) =>
                  setGithubUrl(
                    event.target
                      .value,
                  )
                }
                maxLength={300}
                placeholder="https://github.com/username"
                className="w-full rounded-xl border border-white/10 bg-black/10 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400"
              />
            </div>
          </label>

          <label className="block text-sm font-medium text-gray-300">
            LinkedIn

            <div className="relative mt-2">
              <Globe2
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={
                  linkedinUrl
                }
                onChange={(
                  event,
                ) =>
                  setLinkedinUrl(
                    event.target
                      .value,
                  )
                }
                maxLength={300}
                placeholder="https://www.linkedin.com/in/username"
                className="w-full rounded-xl border border-white/10 bg-black/10 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400"
              />
            </div>
          </label>
        </div>
      </section>

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

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={
            saving
          }
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
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