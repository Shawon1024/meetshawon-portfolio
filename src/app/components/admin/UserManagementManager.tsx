"use client";

import {
  AlertTriangle,
  BadgeCheck,
  BadgeX,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  UserRound,
  Users,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import VerifiedBadge from "../ui/VerifiedBadge";
import LabAccessControl, {
  type LabAccessMembership,
} from "./LabAccessControl";
import { createClient } from "../../lib/supabase/client";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: string | null;
  verified: boolean;
  lab_access: LabAccessMembership | null;
}

interface UserManagementManagerProps {
  initialUsers: UserProfile[];
  currentUserId: string;
}

type UserFilter =
  | "all"
  | "verified"
  | "unverified"
  | "admins"
  | "authors"
  | "moderators"
  | "partners";


const roles = [
  "user",
  "author",
  "moderator",
  "partner",
  "admin",
] as const;

type UserRole =
  (typeof roles)[number];


interface PendingRoleChange {
  user: UserProfile;
  nextRole: UserRole;
}


interface PendingVerificationChange {
  user: UserProfile;
  nextVerified: boolean;
}

interface PendingUserDeletion {
  user: UserProfile;
}

function getFullName(
  user: UserProfile,
) {
  return (
    [
      user.first_name?.trim(),
      user.last_name?.trim(),
    ]
      .filter(Boolean)
      .join(" ") ||
    "Name unavailable"
  );
}

function getUsernameLabel(
  user: UserProfile,
) {
  return user.username
    ? `@${user.username}`
    : "Username unavailable";
}

function getUserIdentity(
  user: UserProfile,
) {
  const fullName =
    getFullName(user);

  const username =
    getUsernameLabel(user);

  return `${fullName} (${username})`;
}

export default function UserManagementManager({
  initialUsers,
  currentUserId,
}: UserManagementManagerProps) {
  const [users, setUsers] =
    useState<UserProfile[]>(
      initialUsers,
    );

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<UserFilter>("all");

  const [
    workingUserId,
    setWorkingUserId,
  ] = useState<string | null>(
    null,
  );

  const [error, setError] =
    useState("");


  const [
    pendingRoleChange,
    setPendingRoleChange,
  ] =
    useState<PendingRoleChange | null>(
      null,
    );


  const [
    pendingVerificationChange,
    setPendingVerificationChange,
  ] =
    useState<PendingVerificationChange | null>(
      null,
    );

  const [
    pendingUserDeletion,
    setPendingUserDeletion,
  ] = useState<PendingUserDeletion | null>(
    null,
  );

  const [
    deletionConfirmation,
    setDeletionConfirmation,
  ] = useState("");

  // --------------------------------------------------
  // FILTER USERS
  // --------------------------------------------------

  const filteredUsers =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return users.filter(
        (user) => {
          const firstName =
            user.first_name
              ?.toLowerCase() ??
            "";

          const lastName =
            user.last_name
              ?.toLowerCase() ??
            "";

          const fullName =
            `${firstName} ${lastName}`.trim();

          const username =
            user.username
              ?.toLowerCase() ??
            "";

          const role =
            user.role
              ?.toLowerCase() ??
            "";

          const matchesSearch =
            !query ||
            firstName.includes(query) ||
            lastName.includes(query) ||
            fullName.includes(query) ||
            username.includes(query) ||
            role.includes(query);

          const matchesFilter =
            filter === "all"
              ? true
              : filter ===
                  "verified"
                ? user.verified
                : filter ===
                    "unverified"
                  ? !user.verified
                  : filter ===
                      "admins"
                    ? user.role ===
                      "admin"
                    : filter ===
                        "authors"
                      ? user.role ===
                        "author"
                      : filter ===
                          "moderators"
                        ? user.role ===
                          "moderator"
                        : user.role ===
                          "partner";

          return (
            matchesSearch &&
            matchesFilter
          );
        },
      );
    }, [
      users,
      search,
      filter,
    ]);

  // --------------------------------------------------
  // VERIFICATION
  // --------------------------------------------------

  const requestVerificationChange =
    (
      user:
        UserProfile,
    ) => {
      setPendingVerificationChange({
        user,
        nextVerified:
          !user.verified,
      });
    };

  const confirmVerificationChange =
    async () => {
      if (
        !pendingVerificationChange
      ) {
        return;
      }

      const {
        user,
        nextVerified,
      } =
        pendingVerificationChange;

      try {
        setWorkingUserId(
          user.id,
        );

        setError("");

        const supabase =
          createClient();

        const {
          error,
        } = await supabase
          .from("profiles")
          .update({
            verified:
              nextVerified,
          })
          .eq(
            "id",
            user.id,
          );

        if (error) {
          throw error;
        }

        setUsers(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                user.id
                  ? {
                      ...item,
                      verified:
                        nextVerified,
                    }
                  : item,
            ),
        );

        setPendingVerificationChange(
          null,
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Verification could not be updated.",
        );
      } finally {
        setWorkingUserId(
          null,
        );
      }
    };

  // --------------------------------------------------
  // ROLE MANAGEMENT
  // --------------------------------------------------

  const requestRoleChange =
    (
      user:
        UserProfile,
      nextRole:
        UserRole,
    ) => {
      if (
        user.id ===
        currentUserId
      ) {
        return;
      }

      const currentRole =
        (user.role ??
          "user") as UserRole;

      if (
        currentRole ===
        nextRole
      ) {
        return;
      }

      setPendingRoleChange({
        user,
        nextRole,
      });
    };

  const confirmRoleChange =
    async () => {
      if (
        !pendingRoleChange
      ) {
        return;
      }

      const {
        user,
        nextRole,
      } =
        pendingRoleChange;

      try {
        setWorkingUserId(
          user.id,
        );

        setError("");

        const supabase =
          createClient();

        const {
          error:
            roleError,
        } =
          await supabase.rpc(
            "admin_set_user_role",
            {
              target_user_id:
                user.id,
              new_role:
                nextRole,
            },
          );

        if (roleError) {
          throw roleError;
        }

        setUsers(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                user.id
                  ? {
                      ...item,
                      role:
                        nextRole,
                    }
                  : item,
            ),
        );

        setPendingRoleChange(
          null,
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "User role could not be updated.",
        );
      } finally {
        setWorkingUserId(
          null,
        );
      }
    };

  // --------------------------------------------------
  // USER DELETION
  // --------------------------------------------------

  const requestUserDeletion =
    (user: UserProfile) => {
      if (
        user.id === currentUserId ||
        !user.username
      ) {
        return;
      }

      setError("");
      setDeletionConfirmation("");
      setPendingUserDeletion({
        user,
      });
    };

  const confirmUserDeletion =
    async () => {
      if (!pendingUserDeletion) {
        return;
      }

      const targetUser =
        pendingUserDeletion.user;

      const expectedUsername =
        targetUser.username
          ?.trim()
          .toLowerCase() ??
        "";

      if (
        !expectedUsername ||
        deletionConfirmation
          .trim()
          .toLowerCase() !==
          expectedUsername
      ) {
        return;
      }

      try {
        setWorkingUserId(
          targetUser.id,
        );

        setError("");

        const response =
          await fetch(
            "/api/admin/users/delete",
            {
              method:
                "DELETE",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  userId:
                    targetUser.id,

                  confirmationUsername:
                    deletionConfirmation.trim(),
                }),
            },
          );

        const result =
          (await response.json()) as {
            success?: boolean;
            error?: string;
          };

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.error ??
              "The user account could not be deleted.",
          );
        }

        setUsers(
          (current) =>
            current.filter(
              (user) =>
                user.id !==
                targetUser.id,
            ),
        );

        setPendingUserDeletion(
          null,
        );

        setDeletionConfirmation(
          "",
        );
      } catch (unexpectedError) {
        setError(
          unexpectedError instanceof Error
            ? unexpectedError.message
            : "The user account could not be deleted.",
        );
      } finally {
        setWorkingUserId(
          null,
        );
      }
    };

  // --------------------------------------------------
  // STATS
  // --------------------------------------------------

  const totalUsers =
    users.length;

  const verifiedUsers =
    users.filter(
      (user) =>
        user.verified,
    ).length;

  const unverifiedUsers =
    users.filter(
      (user) =>
        !user.verified,
    ).length;

  const adminUsers =
    users.filter(
      (user) =>
        user.role ===
        "admin",
    ).length;

  const authorUsers =
    users.filter(
      (user) =>
        user.role ===
        "author",
    ).length;

  const moderatorUsers =
    users.filter(
      (user) =>
        user.role ===
        "moderator",
    ).length;

  const partnerUsers =
    users.filter(
      (user) =>
        user.role ===
        "partner",
    ).length;

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="space-y-8">
      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total users */}

        <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
            <Users
              size={20}
            />
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Total users
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {totalUsers}
          </p>
        </div>

        {/* Verified */}

        <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
            <BadgeCheck
              size={20}
            />
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Verified
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {verifiedUsers}
          </p>
        </div>

        {/* Unverified */}

        <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
            <BadgeX
              size={20}
            />
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Unverified
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {unverifiedUsers}
          </p>
        </div>

        {/* Admins */}

        <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            <ShieldCheck
              size={20}
            />
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Admins
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {adminUsers}
          </p>
        </div>

        {/* Authors */}

        <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10 text-purple-300">
            <UserRound
              size={20}
            />
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Authors
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {authorUsers}
          </p>
        </div>

        {/* Moderators */}

        <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <UserCog
              size={20}
            />
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Moderators
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {moderatorUsers}
          </p>
        </div>

        {/* Partners */}

        <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
            <Users
              size={20}
            />
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Partners
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {partnerUsers}
          </p>
        </div>
      </div>

      {/* Controls */}

      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5 md:flex-row md:items-center md:justify-between">
        {/* Search */}

        <div className="relative w-full md:max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Search by name, username, or role..."
            className="w-full rounded-xl border border-white/10 bg-black/10 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400"
          />
        </div>

        {/* Filters */}

        <div className="flex flex-wrap gap-2">
          {(
            [
              [
                "all",
                "All",
              ],
              [
                "verified",
                "Verified",
              ],
              [
                "unverified",
                "Unverified",
              ],
              [
                "admins",
                "Admins",
              ],
              [
                "authors",
                "Authors",
              ],
              [
                "moderators",
                "Moderators",
              ],
              [
                "partners",
                "Partners",
              ],
            ] as [
              UserFilter,
              string,
            ][]
          ).map(
            ([
              value,
              label,
            ]) => (
              <button
                key={
                  value
                }
                type="button"
                onClick={() =>
                  setFilter(
                    value,
                  )
                }
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                  filter ===
                  value
                    ? "border-green-400/30 bg-green-400/10 text-green-300"
                    : "border-white/10 bg-black/10 text-gray-400 hover:border-green-400/30 hover:text-white"
                }`}
              >
                {label}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Error */}

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      {/* Results count */}

      <p className="text-sm text-gray-500">
        {
          filteredUsers.length
        }{" "}
        {filteredUsers.length ===
        1
          ? "user"
          : "users"}{" "}
        shown
      </p>

      {/* Users */}

      {filteredUsers.length ===
      0 ? (
        <div className="rounded-2xl border border-white/10 bg-black/10 p-10 text-center">
          <UserRound
            size={30}
            className="mx-auto text-gray-600"
          />

          <p className="mt-4 text-gray-400">
            No matching users.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map(
            (user) => {
              const fullName =
                getFullName(user);

              const username =
                getUsernameLabel(user);

              const working =
                workingUserId ===
                user.id;

              const isYou =
                user.id ===
                currentUserId;

              return (
                <article
                  key={
                    user.id
                  }
                  className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5 md:p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    {/* Identity */}

                    <div className="flex items-center gap-4">
                      {/* Avatar */}

                      {user.avatar_url ? (
                        <Image
                          src={
                            user.avatar_url
                          }
                          alt=""
                          width={48}
                          height={48}
                          sizes="48px"
                          className="h-12 w-12 shrink-0 rounded-full border border-white/10 object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-400/10 font-semibold text-green-300">
                          {(
                            user.first_name?.charAt(0) ||
                            user.last_name?.charAt(0) ||
                            user.username?.charAt(0) ||
                            "?"
                          ).toUpperCase()}
                        </div>
                      )}

                      <div>
                        {/* Name */}

                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-white">
                            {fullName}
                          </p>

                          {user.verified && (
                            <VerifiedBadge
                              size={
                                17
                              }
                            />
                          )}

                          {isYou && (
                            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-400">
                              You
                            </span>
                          )}

                          {user.role ===
                            "admin" && (
                            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs font-medium text-amber-300">
                              Admin
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          {username}
                        </p>

                        {/* Status */}

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span>
                            {user.verified
                              ? "Verified account"
                              : "Standard account"}
                          </span>

                          <span>
                            Role:{" "}
                            {user.role ??
                              "user"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* User actions */}

                    <div className="flex flex-col gap-3 sm:items-end">
                      {/* Role */}

                      <div className="flex items-center gap-2">
                        <UserCog
                          size={17}
                          className="text-gray-500"
                        />

                        <select
                          value={
                            (user.role ??
                              "user") as UserRole
                          }
                          disabled={
                            working ||
                            isYou
                          }
                          onChange={(
                            event,
                          ) => {
                            requestRoleChange(
                              user,
                              event.target
                                .value as UserRole,
                            );
                          }}
                          className="cursor-pointer rounded-xl border border-white/10 bg-[#102A2A] px-4 py-2.5 text-sm text-white outline-none transition focus:border-green-400/40 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label={`Change role for ${getUserIdentity(user)}`}
                          title={
                            isYou
                              ? "You cannot change your own admin role here."
                              : "Change user role"
                          }
                        >
                          {roles.map(
                            (role) => (
                              <option
                                key={
                                  role
                                }
                                value={
                                  role
                                }
                              >
                                {role
                                  .charAt(0)
                                  .toUpperCase() +
                                  role.slice(
                                    1,
                                  )}
                              </option>
                            ),
                          )}
                        </select>
                      </div>

                      {/* Verification */}

                      <button
                        type="button"
                        disabled={
                          working
                        }
                        onClick={() => {
                          requestVerificationChange(
                            user,
                          );
                        }}
                        className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          user.verified
                            ? "border-red-400/20 text-red-300 hover:bg-red-400/10"
                            : "border-blue-400/20 text-blue-300 hover:bg-blue-400/10"
                        }`}
                      >
                        {user.verified ? (
                          <BadgeX
                            size={17}
                          />
                        ) : (
                          <BadgeCheck
                            size={17}
                          />
                        )}

                        {working
                          ? "Updating..."
                          : user.verified
                            ? "Remove Verification"
                            : "Verify User"}
                      </button>

                      {/* Permanent account deletion */}

                      <button
                        type="button"
                        disabled={
                          working ||
                          isYou ||
                          !user.username
                        }
                        onClick={() => {
                          requestUserDeletion(
                            user,
                          );
                        }}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-400/20 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                        title={
                          isYou
                            ? "You cannot delete your own administrator account here."
                            : !user.username
                              ? "A username is required before this account can be deleted."
                              : "Permanently delete user"
                        }
                      >
                        <Trash2
                          size={17}
                          aria-hidden="true"
                        />

                        Delete User
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-5">
                    <LabAccessControl
                      userId={user.id}
                      identity={getUserIdentity(user)}
                      currentUserId={currentUserId}
                      automaticAdminAccess={user.role === "admin"}
                      initialMembership={user.lab_access}
                    />
                  </div>
                </article>
              );
            },
          )}
        </div>
      )}

      {/* =================================================
          VERIFICATION CONFIRMATION
      ================================================= */}

      {pendingVerificationChange && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !workingUserId
            ) {
              setPendingVerificationChange(
                null,
              );
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="verification-change-title"
            className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#102A2A] shadow-2xl"
          >
            <div className="p-6 md:p-7">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                  pendingVerificationChange.nextVerified
                    ? "border-blue-400/20 bg-blue-400/10 text-blue-300"
                    : "border-red-400/20 bg-red-400/10 text-red-300"
                }`}
              >
                {pendingVerificationChange.nextVerified ? (
                  <BadgeCheck
                    size={22}
                  />
                ) : (
                  <BadgeX
                    size={22}
                  />
                )}
              </div>

              <h2
                id="verification-change-title"
                className="mt-5 text-2xl font-semibold text-white"
              >
                {pendingVerificationChange.nextVerified
                  ? "Verify this user?"
                  : "Remove verification?"}
              </h2>

              <p className="mt-3 leading-7 text-gray-400">
                You are about to{" "}
                <span
                  className={
                    pendingVerificationChange.nextVerified
                      ? "font-semibold text-blue-300"
                      : "font-semibold text-red-300"
                  }
                >
                  {pendingVerificationChange.nextVerified
                    ? "verify"
                    : "remove verification from"}
                </span>{" "}
                <span className="font-medium text-white">
                  {getUserIdentity(
                    pendingVerificationChange.user,
                  )}
                </span>
                .
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-sm leading-6 text-gray-400">
                  {pendingVerificationChange.nextVerified
                    ? "This will display the verified badge on the user's account and profile."
                    : "This will remove the verified badge from the user's account and profile."}
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/10 p-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={
                  Boolean(
                    workingUserId,
                  )
                }
                onClick={() => {
                  setPendingVerificationChange(
                    null,
                  );
                }}
                className="cursor-pointer rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  Boolean(
                    workingUserId,
                  )
                }
                onClick={() => {
                  void confirmVerificationChange();
                }}
                className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  pendingVerificationChange.nextVerified
                    ? "bg-blue-500 text-white hover:bg-blue-400"
                    : "bg-red-500 text-white hover:bg-red-400"
                }`}
              >
                {pendingVerificationChange.nextVerified ? (
                  <BadgeCheck
                    size={16}
                  />
                ) : (
                  <BadgeX
                    size={16}
                  />
                )}

                {workingUserId
                  ? "Updating..."
                  : pendingVerificationChange.nextVerified
                    ? "Verify User"
                    : "Remove Verification"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          ROLE CHANGE CONFIRMATION
      ================================================= */}

      {pendingRoleChange && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !workingUserId
            ) {
              setPendingRoleChange(
                null,
              );
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="role-change-title"
            className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#102A2A] shadow-2xl"
          >
            <div className="p-6 md:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
                <AlertTriangle
                  size={22}
                />
              </div>

              <h2
                id="role-change-title"
                className="mt-5 text-2xl font-semibold text-white"
              >
                Change user role?
              </h2>

              <p className="mt-3 leading-7 text-gray-400">
                You are about to change{" "}
                <span className="font-medium text-white">
                  {getUserIdentity(
                    pendingRoleChange.user,
                  )}
                </span>{" "}
                from{" "}
                <span className="font-medium capitalize text-gray-200">
                  {pendingRoleChange.user.role ??
                    "user"}
                </span>{" "}
                to{" "}
                <span className="font-semibold capitalize text-green-300">
                  {
                    pendingRoleChange.nextRole
                  }
                </span>
                .
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-sm leading-6 text-gray-400">
                  Changing a role can alter this user&apos;s access and permissions across the site.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/10 p-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={
                  Boolean(
                    workingUserId,
                  )
                }
                onClick={() => {
                  setPendingRoleChange(
                    null,
                  );
                }}
                className="cursor-pointer rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  Boolean(
                    workingUserId,
                  )
                }
                onClick={() => {
                  void confirmRoleChange();
                }}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <UserCog
                  size={16}
                />

                {workingUserId
                  ? "Changing..."
                  : `Change to ${
                      pendingRoleChange.nextRole
                        .charAt(0)
                        .toUpperCase() +
                      pendingRoleChange.nextRole.slice(
                        1,
                      )
                    }`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          PERMANENT USER DELETION CONFIRMATION
      ================================================= */}

      {pendingUserDeletion && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !workingUserId
            ) {
              setPendingUserDeletion(
                null,
              );

              setDeletionConfirmation(
                "",
              );
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-deletion-title"
            aria-describedby="user-deletion-description"
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-red-400/20 bg-[#102A2A] shadow-2xl"
          >
            <div className="p-6 md:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-red-300">
                <Trash2
                  size={22}
                  aria-hidden="true"
                />
              </div>

              <h2
                id="user-deletion-title"
                className="mt-5 text-2xl font-semibold text-white"
              >
                Permanently delete this user?
              </h2>

              <p
                id="user-deletion-description"
                className="mt-3 leading-7 text-gray-400"
              >
                You are about to permanently delete{" "}
                <span className="font-medium text-white">
                  {getUserIdentity(
                    pendingUserDeletion.user,
                  )}
                </span>
                . This action cannot be undone.
              </p>

              <div className="mt-5 space-y-2 rounded-2xl border border-red-400/15 bg-red-400/[0.06] p-4 text-sm leading-6 text-red-100/80">
                <p>
                  Deletion is blocked if this user owns blog posts or has any
                  Drive account or retained Drive records.
                </p>

                <p>
                  Reassign or remove authored posts first. Drive users must
                  complete the existing retention and cleanup workflow first.
                </p>
              </div>

              <label
                htmlFor="delete-user-confirmation"
                className="mt-6 block text-sm font-medium text-gray-300"
              >
                Type{" "}
                <span className="font-semibold text-red-300">
                  {pendingUserDeletion.user.username}
                </span>{" "}
                to confirm
              </label>

              <input
                id="delete-user-confirmation"
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={
                  deletionConfirmation
                }
                disabled={
                  Boolean(
                    workingUserId,
                  )
                }
                onChange={(event) => {
                  setDeletionConfirmation(
                    event.target.value,
                  );
                }}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-red-400/50 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={
                  pendingUserDeletion.user.username ??
                  "username"
                }
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/10 p-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={
                  Boolean(
                    workingUserId,
                  )
                }
                onClick={() => {
                  setPendingUserDeletion(
                    null,
                  );

                  setDeletionConfirmation(
                    "",
                  );
                }}
                className="cursor-pointer rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  Boolean(
                    workingUserId,
                  ) ||
                  deletionConfirmation
                    .trim()
                    .toLowerCase() !==
                    (pendingUserDeletion.user.username
                      ?.trim()
                      .toLowerCase() ??
                      "")
                }
                onClick={() => {
                  void confirmUserDeletion();
                }}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2
                  size={16}
                  aria-hidden="true"
                />

                {workingUserId
                  ? "Deleting..."
                  : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
