"use client";

import {
  BadgeCheck,
  BadgeX,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import VerifiedBadge from "../ui/VerifiedBadge";
import { createClient } from "../../lib/supabase/client";

interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: string | null;
  verified: boolean;
}

interface UserManagementManagerProps {
  initialUsers: UserProfile[];
  currentUserId: string;
}

type UserFilter =
  | "all"
  | "verified"
  | "unverified"
  | "admins";

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
          const name =
            user.display_name
              ?.toLowerCase() ??
            "";

          const role =
            user.role
              ?.toLowerCase() ??
            "";

          const matchesSearch =
            !query ||
            name.includes(query) ||
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
                  : user.role ===
                    "admin";

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

  const toggleVerification =
    async (
      user: UserProfile,
    ) => {
      try {
        setWorkingUserId(
          user.id,
        );

        setError("");

        const supabase =
          createClient();

        const nextVerified =
          !user.verified;

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
  // STATS
  // --------------------------------------------------

  const totalUsers =
    users.length;

  const verifiedUsers =
    users.filter(
      (user) =>
        user.verified,
    ).length;

  const adminUsers =
    users.filter(
      (user) =>
        user.role ===
        "admin",
    ).length;

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="space-y-8">
      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            {
              verifiedUsers
            }
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
            placeholder="Search users..."
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
              const name =
                user.display_name ??
                "Unnamed User";

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
                        <img
                          src={
                            user.avatar_url
                          }
                          alt=""
                          className="h-12 w-12 shrink-0 rounded-full border border-white/10 object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-400/10 font-semibold text-green-300">
                          {name
                            .charAt(
                              0,
                            )
                            .toUpperCase()}
                        </div>
                      )}

                      <div>
                        {/* Name */}

                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-white">
                            {
                              name
                            }
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

                    {/* Verification button */}

                    <button
                      type="button"
                      disabled={
                        working
                      }
                      onClick={() => {
                        void toggleVerification(
                          user,
                        );
                      }}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
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
                  </div>
                </article>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}