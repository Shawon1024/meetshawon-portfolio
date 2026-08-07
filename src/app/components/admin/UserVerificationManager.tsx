"use client";

import { useState } from "react";
import {
  BadgeCheck,
  BadgeX,
  Search,
} from "lucide-react";

import VerifiedBadge from "../ui/VerifiedBadge";
import { createClient } from "../../lib/supabase/client";

interface UserProfile {
  id: string;
  display_name: string | null;
  role: string | null;
  verified: boolean;
}

interface UserVerificationManagerProps {
  initialUsers: UserProfile[];
}

export default function UserVerificationManager({
  initialUsers,
}: UserVerificationManagerProps) {
  const [users, setUsers] =
    useState<UserProfile[]>(initialUsers);

  const [search, setSearch] =
    useState("");

  const [workingUserId, setWorkingUserId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const filteredUsers =
    users.filter((user) => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return true;
      }

      return (
        user.display_name
          ?.toLowerCase()
          .includes(query) ||
        user.role
          ?.toLowerCase()
          .includes(query)
      );
    });

  const toggleVerification = async (
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
              item.id === user.id
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

  return (
    <div className="space-y-6">
      {/* Search */}

      <div className="relative">
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

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      {/* Users */}

      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/10 p-6 text-center text-gray-500">
            No users found.
          </div>
        ) : (
          filteredUsers.map(
            (user) => {
              const name =
                user.display_name ??
                "Unnamed User";

              const working =
                workingUserId ===
                user.id;

              return (
                <div
                  key={user.id}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/10 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">
                        {name}
                      </p>

                      {user.verified && (
                        <VerifiedBadge />
                      )}

                      {user.role ===
                        "admin" && (
                        <span className="rounded-full border border-green-400/20 bg-green-400/10 px-2.5 py-1 text-xs font-medium text-green-300">
                          Admin
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      {user.verified
                        ? "Verified account"
                        : "Standard account"}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={working}
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
              );
            },
          )
        )}
      </div>
    </div>
  );
}