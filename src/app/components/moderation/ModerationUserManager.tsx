"use client";

import {
  AlertTriangle,
  Ban,
  Clock3,
  Search,
  ShieldCheck,
  ShieldOff,
  UserRound,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import RoleBadge from "../ui/RoleBadge";
import VerifiedBadge from "../ui/VerifiedBadge";
import { createClient } from "../../lib/supabase/client";

type StaffRole =
  | "admin"
  | "moderator";

type RestrictionStatus =
  | "active"
  | "restricted"
  | "blocked";

interface RestrictionData {
  user_id: string;
  status:
    RestrictionStatus;
  public_reason:
    string | null;
  internal_notes:
    string | null;
  expires_at:
    string | null;
  actioned_by:
    string | null;
  updated_at:
    string | null;
}

interface ModerationUser {
  id: string;
  display_name:
    string | null;
  username:
    string | null;
  avatar_url:
    string | null;
  role:
    string | null;
  verified:
    boolean;
  restriction:
    RestrictionData;
}

interface ModerationUserManagerProps {
  currentUserId:
    string;
  currentRole:
    StaffRole;
  initialUsers:
    ModerationUser[];
}

interface PendingAction {
  type:
    | "restrict"
    | "remove_restriction"
    | "block"
    | "unblock";
  user:
    ModerationUser;
}

const durationOptions = [
  {
    label:
      "1 hour",
    hours:
      1,
  },
  {
    label:
      "24 hours",
    hours:
      24,
  },
  {
    label:
      "3 days",
    hours:
      72,
  },
  {
    label:
      "7 days",
    hours:
      168,
  },
];

export default function ModerationUserManager({
  currentUserId,
  currentRole,
  initialUsers,
}: ModerationUserManagerProps) {
  const supabase =
    useMemo(
      () =>
        createClient(),
      [],
    );

  const [
    users,
    setUsers,
  ] =
    useState(
      initialUsers,
    );

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<
      "all" |
      RestrictionStatus
    >("all");

  const [
    pendingAction,
    setPendingAction,
  ] =
    useState<PendingAction | null>(
      null,
    );

  const [
    reason,
    setReason,
  ] =
    useState("");

  const [
    notes,
    setNotes,
  ] =
    useState("");

  const [
    durationHours,
    setDurationHours,
  ] =
    useState(24);

  const [
    working,
    setWorking,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const filteredUsers =
    useMemo(
      () => {
        const query =
          search
            .trim()
            .toLowerCase();

        return users.filter(
          (
            user,
          ) => {
            const name =
              user.display_name
                ?.toLowerCase() ??
              "";

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
              name.includes(
                query,
              ) ||
              username.includes(
                query,
              ) ||
              role.includes(
                query,
              );

            const matchesStatus =
              statusFilter ===
                "all"
                ? true
                : user.restriction
                    .status ===
                  statusFilter;

            return (
              matchesSearch &&
              matchesStatus
            );
          },
        );
      },
      [
        users,
        search,
        statusFilter,
      ],
    );

  // --------------------------------------------------
  // COUNTS
  // --------------------------------------------------

  const activeCount =
    users.filter(
      (
        user,
      ) =>
        user.restriction
          .status ===
        "active",
    ).length;

  const restrictedCount =
    users.filter(
      (
        user,
      ) =>
        user.restriction
          .status ===
        "restricted",
    ).length;

  const blockedCount =
    users.filter(
      (
        user,
      ) =>
        user.restriction
          .status ===
        "blocked",
    ).length;

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  const displayNameFor =
    (
      user:
        ModerationUser,
    ) =>
      user.display_name ??
      user.username ??
      "User";

  const openAction =
    (
      type:
        PendingAction["type"],
      user:
        ModerationUser,
    ) => {
      setError("");
      setReason("");
      setNotes("");
      setDurationHours(
        24,
      );

      setPendingAction({
        type,
        user,
      });
    };

  const closeModal =
    () => {
      if (
        working
      ) {
        return;
      }

      setPendingAction(
        null,
      );
    };

  const updateLocalRestriction =
    (
      userId:
        string,
      next:
        Partial<RestrictionData>,
    ) => {
      setUsers(
        (
          current,
        ) =>
          current.map(
            (
              user,
            ) =>
              user.id ===
              userId
                ? {
                    ...user,

                    restriction:
                      {
                        ...user.restriction,
                        ...next,
                      },
                  }
                : user,
          ),
      );
    };

  // --------------------------------------------------
  // CONFIRM ACTION
  // --------------------------------------------------

  const confirmAction =
    async () => {
      if (
        !pendingAction
      ) {
        return;
      }

      const {
        type,
        user,
      } =
        pendingAction;

      setError("");
      setWorking(
        true,
      );

      try {
        if (
          type ===
          "restrict"
        ) {
          if (
            reason
              .trim()
              .length <
            3
          ) {
            setError(
              "Please provide a reason.",
            );

            return;
          }

          const expiresAt =
            new Date(
              Date.now() +
                durationHours *
                  60 *
                  60 *
                  1000,
            ).toISOString();

          const {
            error:
              rpcError,
          } =
            await supabase.rpc(
              "restrict_user_account",
              {
                target_user_id:
                  user.id,

                restriction_reason:
                  reason.trim(),

                restriction_expires_at:
                  expiresAt,

                staff_notes:
                  notes
                    .trim() ||
                  null,
              },
            );

          if (
            rpcError
          ) {
            throw rpcError;
          }

          updateLocalRestriction(
            user.id,
            {
              status:
                "restricted",
              public_reason:
                reason.trim(),
              internal_notes:
                notes
                  .trim() ||
                null,
              expires_at:
                expiresAt,
              actioned_by:
                currentUserId,
              updated_at:
                new Date().toISOString(),
            },
          );
        }

        if (
          type ===
          "remove_restriction"
        ) {
          const {
            error:
              rpcError,
          } =
            await supabase.rpc(
              "remove_user_restriction",
              {
                target_user_id:
                  user.id,

                staff_notes:
                  notes
                    .trim() ||
                  null,
              },
            );

          if (
            rpcError
          ) {
            throw rpcError;
          }

          updateLocalRestriction(
            user.id,
            {
              status:
                "active",
              public_reason:
                null,
              internal_notes:
                null,
              expires_at:
                null,
              actioned_by:
                currentUserId,
              updated_at:
                new Date().toISOString(),
            },
          );
        }

        if (
          type ===
          "block"
        ) {
          if (
            reason
              .trim()
              .length <
            3
          ) {
            setError(
              "Please provide a reason.",
            );

            return;
          }

          const {
            error:
              rpcError,
          } =
            await supabase.rpc(
              "block_user_account",
              {
                target_user_id:
                  user.id,

                block_reason:
                  reason.trim(),

                staff_notes:
                  notes
                    .trim() ||
                  null,
              },
            );

          if (
            rpcError
          ) {
            throw rpcError;
          }

          updateLocalRestriction(
            user.id,
            {
              status:
                "blocked",
              public_reason:
                reason.trim(),
              internal_notes:
                notes
                  .trim() ||
                null,
              expires_at:
                null,
              actioned_by:
                currentUserId,
              updated_at:
                new Date().toISOString(),
            },
          );
        }

        if (
          type ===
          "unblock"
        ) {
          const {
            error:
              rpcError,
          } =
            await supabase.rpc(
              "unblock_user_account",
              {
                target_user_id:
                  user.id,

                staff_notes:
                  notes
                    .trim() ||
                  null,
              },
            );

          if (
            rpcError
          ) {
            throw rpcError;
          }

          updateLocalRestriction(
            user.id,
            {
              status:
                "active",
              public_reason:
                null,
              internal_notes:
                null,
              expires_at:
                null,
              actioned_by:
                currentUserId,
              updated_at:
                new Date().toISOString(),
            },
          );
        }

        setPendingAction(
          null,
        );
      } catch (
        actionError
      ) {
        console.error(
          "Moderation action failed:",
          actionError,
        );

        setError(
          actionError instanceof Error
            ? actionError.message
            : "Moderation action failed.",
        );
      } finally {
        setWorking(
          false,
        );
      }
    };

  // --------------------------------------------------
  // MODAL TEXT
  // --------------------------------------------------

  const modalTitle =
    pendingAction?.type ===
      "restrict"
      ? "Restrict user?"
      : pendingAction?.type ===
          "remove_restriction"
        ? "Remove restriction?"
        : pendingAction?.type ===
            "block"
          ? "Block account?"
          : "Unblock account?";

  const modalButton =
    pendingAction?.type ===
      "restrict"
      ? "Restrict User"
      : pendingAction?.type ===
          "remove_restriction"
        ? "Remove Restriction"
        : pendingAction?.type ===
            "block"
          ? "Block Account"
          : "Unblock Account";

  const destructive =
    pendingAction?.type ===
      "block";

  return (
    <div className="space-y-8">
      {/* =================================================
          STATS
      ================================================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
          <UserRound
            size={20}
            className="text-green-300"
          />

          <p className="mt-4 text-sm text-gray-500">
            Total accounts
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {
              users.length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
          <ShieldCheck
            size={20}
            className="text-green-300"
          />

          <p className="mt-4 text-sm text-gray-500">
            Active
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {
              activeCount
            }
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
          <Clock3
            size={20}
            className="text-amber-300"
          />

          <p className="mt-4 text-sm text-gray-500">
            Restricted
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {
              restrictedCount
            }
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
          <Ban
            size={20}
            className="text-red-300"
          />

          <p className="mt-4 text-sm text-gray-500">
            Blocked
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {
              blockedCount
            }
          </p>
        </div>
      </div>

      {/* =================================================
          CONTROLS
      ================================================= */}

      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="search"
            value={
              search
            }
            onChange={(
              event,
            ) =>
              setSearch(
                event.target
                  .value,
              )
            }
            placeholder="Search users..."
            className="w-full rounded-xl border border-white/10 bg-black/10 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              [
                "all",
                "All",
              ],
              [
                "active",
                "Active",
              ],
              [
                "restricted",
                "Restricted",
              ],
              [
                "blocked",
                "Blocked",
              ],
            ] as const
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
                  setStatusFilter(
                    value,
                  )
                }
                className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium transition ${
                  statusFilter ===
                  value
                    ? "border-green-400/30 bg-green-400/10 text-green-300"
                    : "border-white/10 bg-black/10 text-gray-400 hover:border-green-400/30 hover:text-white"
                }`}
              >
                {
                  label
                }
              </button>
            ),
          )}
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {
            error
          }
        </div>
      )}

      {/* =================================================
          USERS
      ================================================= */}

      <div className="space-y-4">
        {filteredUsers.map(
          (
            user,
          ) => {
            const name =
              displayNameFor(
                user,
              );

            const status =
              user.restriction
                .status;

            const isSelf =
              user.id ===
              currentUserId;

            const isAdminTarget =
              user.role ===
              "admin";

            const moderatorCannotTouch =
              currentRole ===
                "moderator" &&
              (
                isAdminTarget ||
                status ===
                  "blocked"
              );

            return (
              <article
                key={
                  user.id
                }
                className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5 md:p-6"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex min-w-0 gap-4">
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

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-white">
                          {
                            name
                          }
                        </p>

                        {user.verified && (
                          <VerifiedBadge
                            size={16}
                          />
                        )}

                        <RoleBadge
                          role={
                            user.role
                          }
                          showUser
                        />

                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                            status ===
                              "active"
                              ? "border-green-400/20 bg-green-400/10 text-green-300"
                              : status ===
                                  "restricted"
                                ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                                : "border-red-400/20 bg-red-400/10 text-red-300"
                          }`}
                        >
                          {status
                            .charAt(
                              0,
                            )
                            .toUpperCase() +
                            status.slice(
                              1,
                            )}
                        </span>

                        {isSelf && (
                          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-400">
                            You
                          </span>
                        )}
                      </div>

                      {user.username && (
                        <p className="mt-1 text-sm text-gray-500">
                          @
                          {
                            user.username
                          }
                        </p>
                      )}

                      {status !==
                        "active" &&
                        user.restriction
                          .public_reason && (
                          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
                            Reason:{" "}
                            <span className="text-gray-300">
                              {
                                user.restriction
                                  .public_reason
                              }
                            </span>
                          </p>
                        )}

                      {status ===
                        "restricted" &&
                        user.restriction
                          .expires_at && (
                          <p className="mt-1 text-xs text-amber-300/80">
                            Until{" "}
                            {new Intl.DateTimeFormat(
                              "en-GB",
                              {
                                dateStyle:
                                  "medium",
                                timeStyle:
                                  "short",
                              },
                            ).format(
                              new Date(
                                user.restriction
                                  .expires_at,
                              ),
                            )}
                          </p>
                        )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {!isSelf &&
                      !moderatorCannotTouch &&
                      status !==
                        "blocked" && (
                        <button
                          type="button"
                          onClick={() =>
                            openAction(
                              "restrict",
                              user,
                            )
                          }
                          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-amber-400/20 px-4 py-2.5 text-sm font-medium text-amber-300 transition hover:bg-amber-400/10"
                        >
                          <Clock3
                            size={16}
                          />

                          {status ===
                            "restricted"
                            ? "Change Restriction"
                            : "Restrict"}
                        </button>
                      )}

                    {currentRole ===
                      "admin" &&
                      !isSelf &&
                      status ===
                        "restricted" && (
                        <button
                          type="button"
                          onClick={() =>
                            openAction(
                              "remove_restriction",
                              user,
                            )
                          }
                          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-green-400/20 px-4 py-2.5 text-sm font-medium text-green-300 transition hover:bg-green-400/10"
                        >
                          <ShieldOff
                            size={16}
                          />

                          Remove Restriction
                        </button>
                      )}

                    {currentRole ===
                      "admin" &&
                      !isSelf &&
                      !isAdminTarget &&
                      status !==
                        "blocked" && (
                        <button
                          type="button"
                          onClick={() =>
                            openAction(
                              "block",
                              user,
                            )
                          }
                          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-red-400/20 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/10"
                        >
                          <Ban
                            size={16}
                          />

                          Block
                        </button>
                      )}

                    {currentRole ===
                      "admin" &&
                      !isSelf &&
                      status ===
                        "blocked" && (
                        <button
                          type="button"
                          onClick={() =>
                            openAction(
                              "unblock",
                              user,
                            )
                          }
                          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-green-400/20 px-4 py-2.5 text-sm font-medium text-green-300 transition hover:bg-green-400/10"
                        >
                          <ShieldCheck
                            size={16}
                          />

                          Unblock
                        </button>
                      )}
                  </div>
                </div>
              </article>
            );
          },
        )}
      </div>

      {/* =================================================
          MODAL
      ================================================= */}

      {pendingAction && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onMouseDown={(
            event,
          ) => {
            if (
              event.target ===
                event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#102A2A] shadow-2xl"
          >
            <div className="p-6 md:p-7">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                  destructive
                    ? "border-red-400/20 bg-red-400/10 text-red-300"
                    : "border-amber-400/20 bg-amber-400/10 text-amber-300"
                }`}
              >
                {destructive ? (
                  <Ban
                    size={22}
                  />
                ) : (
                  <AlertTriangle
                    size={22}
                  />
                )}
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-white">
                {
                  modalTitle
                }
              </h2>

              <p className="mt-3 leading-7 text-gray-400">
                Account:{" "}
                <span className="font-medium text-white">
                  {displayNameFor(
                    pendingAction.user,
                  )}
                </span>
              </p>

              {(
                pendingAction.type ===
                  "restrict" ||
                pendingAction.type ===
                  "block"
              ) && (
                <div className="mt-6 space-y-5">
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Reason
                    </label>

                    <textarea
                      value={
                        reason
                      }
                      onChange={(
                        event,
                      ) =>
                        setReason(
                          event.target
                            .value,
                        )
                      }
                      rows={3}
                      placeholder="Explain why this moderation action is being applied..."
                      className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-green-400/40"
                    />
                  </div>

                  {pendingAction.type ===
                    "restrict" && (
                    <div>
                      <label className="text-sm font-medium text-gray-300">
                        Duration
                      </label>

                      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {durationOptions.map(
                          (
                            option,
                          ) => (
                            <button
                              key={
                                option.hours
                              }
                              type="button"
                              onClick={() =>
                                setDurationHours(
                                  option.hours,
                                )
                              }
                              className={`cursor-pointer rounded-xl border px-3 py-2.5 text-sm transition ${
                                durationHours ===
                                option.hours
                                  ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                                  : "border-white/10 text-gray-400 hover:text-white"
                              }`}
                            >
                              {
                                option.label
                              }
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-5">
                <label className="text-sm font-medium text-gray-300">
                  Staff notes{" "}
                  <span className="text-gray-600">
                    (optional)
                  </span>
                </label>

                <textarea
                  value={
                    notes
                  }
                  onChange={(
                    event,
                  ) =>
                    setNotes(
                      event.target
                        .value,
                    )
                  }
                  rows={3}
                  placeholder="Internal moderation notes..."
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-green-400/40"
                />
              </div>

              {error && (
                <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  {
                    error
                  }
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/10 p-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={
                  working
                }
                onClick={
                  closeModal
                }
                className="cursor-pointer rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  working
                }
                onClick={() => {
                  void confirmAction();
                }}
                className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  destructive
                    ? "bg-red-500 text-white hover:bg-red-400"
                    : "bg-amber-400 text-black hover:bg-amber-300"
                }`}
              >
                {working
                  ? "Processing..."
                  : modalButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}