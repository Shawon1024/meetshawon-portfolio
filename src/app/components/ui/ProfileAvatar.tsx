import {
  CircleUserRound,
  Mars,
  ShieldQuestion,
  Sparkles,
  Transgender,
  UserRound,
  Venus,
} from "lucide-react";

interface ProfileAvatarProps {
  avatarUrl?: string | null;
  gender?: string | null;
  name?: string | null;

  className?: string;
  iconSize?: number;
}

export default function ProfileAvatar({
  avatarUrl,
  gender,
  name,
  className = "h-12 w-12",
  iconSize = 22,
}: ProfileAvatarProps) {
  // --------------------------------------------------
  // UPLOADED PROFILE PHOTO
  // --------------------------------------------------

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={
          name
            ? `${name} profile photo`
            : "Profile photo"
        }
        className={`${className} shrink-0 rounded-full border border-white/10 object-cover`}
      />
    );
  }

  // --------------------------------------------------
  // MALE
  // --------------------------------------------------

  if (gender === "male") {
    return (
      <div
        className={`${className} flex shrink-0 items-center justify-center rounded-full border border-blue-400/20 bg-blue-400/10 text-blue-300`}
        title="Default male avatar"
      >
        <Mars
          size={iconSize}
        />
      </div>
    );
  }

  // --------------------------------------------------
  // FEMALE
  // --------------------------------------------------

  if (gender === "female") {
    return (
      <div
        className={`${className} flex shrink-0 items-center justify-center rounded-full border border-pink-400/20 bg-pink-400/10 text-pink-300`}
        title="Default female avatar"
      >
        <Venus
          size={iconSize}
        />
      </div>
    );
  }

  // --------------------------------------------------
  // NON-BINARY
  // --------------------------------------------------

  if (
    gender ===
    "non_binary"
  ) {
    return (
      <div
        className={`${className} flex shrink-0 items-center justify-center rounded-full border border-purple-400/20 bg-purple-400/10 text-purple-300`}
        title="Default non-binary avatar"
      >
        <Transgender
          size={iconSize}
        />
      </div>
    );
  }

  // --------------------------------------------------
  // OTHER
  // --------------------------------------------------

  if (
    gender ===
    "other"
  ) {
    return (
      <div
        className={`${className} flex shrink-0 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/10 text-amber-300`}
        title="Default avatar"
      >
        <Sparkles
          size={iconSize}
        />
      </div>
    );
  }

  // --------------------------------------------------
  // PREFER NOT TO SAY
  // --------------------------------------------------

  if (
    gender ===
    "prefer_not_to_say"
  ) {
    return (
      <div
        className={`${className} flex shrink-0 items-center justify-center rounded-full border border-slate-400/20 bg-slate-400/10 text-slate-300`}
        title="Default private avatar"
      >
        <ShieldQuestion
          size={iconSize}
        />
      </div>
    );
  }

  // --------------------------------------------------
  // NOT SPECIFIED
  // --------------------------------------------------

  if (
    !gender
  ) {
    return (
      <div
        className={`${className} flex shrink-0 items-center justify-center rounded-full border border-green-400/20 bg-green-400/[0.08] text-green-300`}
        title="Default neutral avatar"
      >
        <CircleUserRound
          size={iconSize}
        />
      </div>
    );
  }

  // --------------------------------------------------
  // UNKNOWN/FUTURE VALUE
  // --------------------------------------------------

  return (
    <div
      className={`${className} flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-gray-300`}
      title="Default profile avatar"
    >
      <UserRound
        size={iconSize}
      />
    </div>
  );
}