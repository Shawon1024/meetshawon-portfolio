"use client";

interface ProfileCompletionCardProps {
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string | null;
  bio: string;
  jobTitle: string;
  gender: string;
  location: string;
  phoneNumber: string;
  websiteUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  rewarded: boolean;
}

export default function ProfileCompletionCard({
  firstName,
  lastName,
  username,
  avatarUrl,
  bio,
  jobTitle,
  gender,
  location,
  phoneNumber,
  websiteUrl,
  githubUrl,
  linkedinUrl,
  rewarded,
}: ProfileCompletionCardProps) {
  // Once the reward has been granted,
  // remove this card permanently.
  if (rewarded) {
    return null;
  }

  const items = [
    firstName.trim(),
    lastName.trim(),
    username.trim(),
    avatarUrl ?? "",
    bio.trim(),
    jobTitle.trim(),
    gender.trim(),
    location.trim(),
    phoneNumber.trim(),
    websiteUrl.trim(),
    githubUrl.trim(),
    linkedinUrl.trim(),
  ];

  const completedItems =
    items.filter(Boolean).length;

  const percentage =
    Math.round(
      (completedItems /
        items.length) *
        100,
    );

  return (
    <section className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-8">
      <div className="flex items-center justify-between gap-5">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
            Profile Completion
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Complete your profile to reach 100%.
          </p>
        </div>

        <span className="shrink-0 text-2xl font-bold text-white">
          {percentage}%
        </span>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-green-400 transition-all duration-500"
          style={{
            width:
              `${percentage}%`,
          }}
        />
      </div>
    </section>
  );
}