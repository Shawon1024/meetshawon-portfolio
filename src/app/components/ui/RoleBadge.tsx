import {
  Handshake,
  PenTool,
  ShieldCheck,
  ShieldHalf,
  UserRound,
} from "lucide-react";

export type UserRole =
  | "user"
  | "admin"
  | "moderator"
  | "author"
  | "partner";

interface RoleBadgeProps {
  role: string | null | undefined;

  /**
   * Blog identities should hide ordinary users.
   * Profile pages can leave this as true.
   */
  showUser?: boolean;

  size?: "sm" | "md";
}

export default function RoleBadge({
  role,
  showUser = true,
  size = "sm",
}: RoleBadgeProps) {
  const normalizedRole =
    (role ?? "user").toLowerCase();

  // --------------------------------------------------
  // NORMAL USER
  // --------------------------------------------------

  if (
    normalizedRole === "user" &&
    !showUser
  ) {
    return null;
  }

  const sizeClasses =
    size === "md"
      ? "px-3 py-1.5 text-xs"
      : "px-2.5 py-1 text-[11px]";

  const iconSize =
    size === "md" ? 14 : 12;

  // --------------------------------------------------
  // ADMIN
  // --------------------------------------------------

  if (normalizedRole === "admin") {
    return (
      <span
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border border-red-400/20 bg-red-400/10 font-medium text-red-300 ${sizeClasses}`}
      >
        <ShieldCheck
          size={iconSize}
        />

        Admin
      </span>
    );
  }

  // --------------------------------------------------
  // MODERATOR
  // --------------------------------------------------

  if (
    normalizedRole ===
    "moderator"
  ) {
    return (
      <span
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-400/10 font-medium text-blue-300 ${sizeClasses}`}
      >
        <ShieldHalf
          size={iconSize}
        />

        Moderator
      </span>
    );
  }

  // --------------------------------------------------
  // AUTHOR
  // --------------------------------------------------

  if (
    normalizedRole === "author"
  ) {
    return (
      <span
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border border-green-400/20 bg-green-400/10 font-medium text-green-300 ${sizeClasses}`}
      >
        <PenTool
          size={iconSize}
        />

        Author
      </span>
    );
  }

  // --------------------------------------------------
  // PARTNER
  // --------------------------------------------------

  if (
    normalizedRole === "partner"
  ) {
    return (
      <span
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border border-purple-400/20 bg-purple-400/10 font-medium text-purple-300 ${sizeClasses}`}
      >
        <Handshake
          size={iconSize}
        />

        Partner
      </span>
    );
  }

  // --------------------------------------------------
  // USER
  // --------------------------------------------------

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 font-medium text-gray-400 ${sizeClasses}`}
    >
      <UserRound
        size={iconSize}
      />

      User
    </span>
  );
}