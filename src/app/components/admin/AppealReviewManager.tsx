"use client";

import {
  Ban,
  CheckCircle2,
  Clock3,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import { createClient } from "../../lib/supabase/client";
import RoleBadge from "../ui/RoleBadge";
import VerifiedBadge from "../ui/VerifiedBadge";

type AppealStatus =
  | "pending"
  | "approved"
  | "rejected";

interface AppealUser {
  id: string;
  first_name:
    string | null;
  last_name:
    string | null;
  username:
    string | null;
  avatar_url:
    string | null;
  verified:
    boolean;
  role:
    string | null;
}

interface AppealReviewer {
  id: string;
  first_name:
    string | null;
  last_name:
    string | null;
  username:
    string | null;
}

interface AppealItem {
  id: string;
  user_id: string;
  message: string;
  status:
    AppealStatus;
  reviewed_by:
    string | null;
  admin_response:
    string | null;
  created_at: string;
  reviewed_at:
    string | null;
  updated_at: string;
  user:
    AppealUser | null;
  reviewer:
    AppealReviewer | null;
}

interface AppealReviewManagerProps {
  initialAppeals:
    AppealItem[];
}

interface PendingReview {
  type:
    | "approve"
    | "reject";
  appeal:
    AppealItem;
}

function formatDate(
  value:
    string | null,
) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle:
        "medium",
      timeStyle:
        "short",
    },
  ).format(
    new Date(value),
  );
}

export default function AppealReviewManager({
  initialAppeals,
}: AppealReviewManagerProps) {
  const supabase =
    useMemo(
      () =>
        createClient(),
      [],
    );

  const [
    appeals,
    setAppeals,
  ] =
    useState(
      initialAppeals,
    );

  const [
    filter,
    setFilter,
  ] =
    useState<
      "all" |
      AppealStatus
    >("pending");

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    pendingReview,
    setPendingReview,
  ] =
    useState<PendingReview | null>(
      null,
    );

  const [
    response,
    setResponse,
  ] =
    useState("");

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
  // COUNTS
  // --------------------------------------------------

  const pendingCount =
    appeals.filter(
      (
        appeal,
      ) =>
        appeal.status ===
        "pending",
    ).length;

  const approvedCount =
    appeals.filter(
      (
        appeal,
      ) =>
        appeal.status ===
        "approved",
    ).length;

  const rejectedCount =
    appeals.filter(
      (
        appeal,
      ) =>
        appeal.status ===
        "rejected",
    ).length;

  // --------------------------------------------------
  // FILTERED LIST
  // --------------------------------------------------

  const filteredAppeals =
    useMemo(
      () => {
        const query =
          search
            .trim()
            .toLowerCase();

        return appeals.filter(
          (
            appeal,
          ) => {
            const firstName =
              appeal.user
                ?.first_name
                ?.toLowerCase() ??
              "";

            const lastName =
              appeal.user
                ?.last_name
                ?.toLowerCase() ??
              "";

            const fullName =
              `${firstName} ${lastName}`.trim();

            const username =
              appeal.user
                ?.username
                ?.toLowerCase() ??
              "";

            const message =
              appeal.message
                .toLowerCase();

            const matchesSearch =
              !query ||
              firstName.includes(query) ||
              lastName.includes(query) ||
              fullName.includes(query) ||
              username.includes(query) ||
              message.includes(query);

            const matchesFilter =
              filter ===
                "all"
                ? true
                : appeal.status ===
                  filter;

            return (
              matchesSearch &&
              matchesFilter
            );
          },
        );
      },
      [
        appeals,
        search,
        filter,
      ],
    );

  // --------------------------------------------------
  // OPEN / CLOSE
  // --------------------------------------------------

  const openReview =
    (
      type:
        PendingReview["type"],
      appeal:
        AppealItem,
    ) => {
      setError("");
      setResponse("");
      setPendingReview({
        type,
        appeal,
      });
    };

  const closeReview =
    () => {
      if (
        working
      ) {
        return;
      }

      setPendingReview(
        null,
      );

      setResponse("");
      setError("");
    };

  // --------------------------------------------------
  // REVIEW
  // --------------------------------------------------

  const submitReview =
    async () => {
      if (
        !pendingReview
      ) {
        return;
      }

      if (
        pendingReview.type ===
          "reject" &&
        response
          .trim()
          .length <
          3
      ) {
        setError(
          "Please explain why the appeal is being rejected.",
        );

        return;
      }

      setWorking(
        true,
      );

      setError("");

      try {
        const {
          data: {
            user,
          },
        } =
          await supabase.auth.getUser();

        if (!user) {
          throw new Error(
            "You are no longer signed in.",
          );
        }

        if (
          pendingReview.type ===
          "approve"
        ) {
          const {
            error:
              approveError,
          } =
            await supabase.rpc(
              "approve_block_appeal",
              {
                appeal_id:
                  pendingReview
                    .appeal.id,

                admin_response_text:
                  response
                    .trim() ||
                  null,
              },
            );

          if (
            approveError
          ) {
            throw approveError;
          }

          setAppeals(
            (
              current,
            ) =>
              current.map(
                (
                  appeal,
                ) =>
                  appeal.id ===
                  pendingReview
                    .appeal.id
                    ? {
                        ...appeal,
                        status:
                          "approved",
                        reviewed_by:
                          user.id,
                        admin_response:
                          response
                            .trim() ||
                          null,
                        reviewed_at:
                          new Date().toISOString(),
                      }
                    : appeal,
              ),
          );
        } else {
          const {
            error:
              rejectError,
          } =
            await supabase.rpc(
              "reject_block_appeal",
              {
                appeal_id:
                  pendingReview
                    .appeal.id,

                admin_response_text:
                  response.trim(),
              },
            );

          if (
            rejectError
          ) {
            throw rejectError;
          }

          setAppeals(
            (
              current,
            ) =>
              current.map(
                (
                  appeal,
                ) =>
                  appeal.id ===
                  pendingReview
                    .appeal.id
                    ? {
                        ...appeal,
                        status:
                          "rejected",
                        reviewed_by:
                          user.id,
                        admin_response:
                          response.trim(),
                        reviewed_at:
                          new Date().toISOString(),
                      }
                    : appeal,
              ),
          );
        }

        closeReview();
      } catch (
        reviewError
      ) {
        console.error(
          "Appeal review failed:",
          reviewError,
        );

        setError(
          reviewError instanceof Error
            ? reviewError.message
            : "The appeal could not be reviewed.",
        );
      } finally {
        setWorking(
          false,
        );
      }
    };

  return (
    <div className="space-y-8">
      {/* =================================================
          STATS
      ================================================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
          <Ban
            size={20}
            className="text-gray-300"
          />

          <p className="mt-4 text-sm text-gray-500">
            Total appeals
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {
              appeals.length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
          <Clock3
            size={20}
            className="text-amber-300"
          />

          <p className="mt-4 text-sm text-gray-500">
            Pending
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {
              pendingCount
            }
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
          <CheckCircle2
            size={20}
            className="text-green-300"
          />

          <p className="mt-4 text-sm text-gray-500">
            Approved
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {
              approvedCount
            }
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
          <XCircle
            size={20}
            className="text-red-300"
          />

          <p className="mt-4 text-sm text-gray-500">
            Rejected
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {
              rejectedCount
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
            placeholder="Search appeals..."
            className="w-full rounded-xl border border-white/10 bg-black/10 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              [
                "pending",
                "Pending",
              ],
              [
                "approved",
                "Approved",
              ],
              [
                "rejected",
                "Rejected",
              ],
              [
                "all",
                "All",
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
                  setFilter(
                    value,
                  )
                }
                className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium transition ${
                  filter ===
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
          LIST
      ================================================= */}

      {filteredAppeals.length ===
      0 ? (
        <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-10 text-center">
          <ShieldCheck
            size={28}
            className="mx-auto text-green-300"
          />

          <h2 className="mt-4 text-xl font-semibold text-white">
            No appeals found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            There are no appeals matching the current filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppeals.map(
            (
              appeal,
            ) => {
              const fullName =
                [
                  appeal.user?.first_name?.trim(),
                  appeal.user?.last_name?.trim(),
                ]
                  .filter(Boolean)
                  .join(" ") ||
                "Name unavailable";

              const username =
                appeal.user?.username
                  ? `@${appeal.user.username}`
                  : "Username unavailable";

              const avatarInitial =
                (
                  appeal.user?.first_name?.charAt(0) ||
                  appeal.user?.last_name?.charAt(0) ||
                  appeal.user?.username?.charAt(0) ||
                  "?"
                ).toUpperCase();

              return (
                <article
                  key={
                    appeal.id
                  }
                  className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5 md:p-6"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex gap-4">
                        {appeal.user
                          ?.avatar_url ? (
                            <Image
                              src={
                                appeal.user
                                  .avatar_url
                              }
                              alt=""
                              width={48}
                              height={48}
                              sizes="48px"
                              className="h-12 w-12 shrink-0 rounded-full border border-white/10 object-cover"
                            />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-400/10 font-semibold text-green-300">
                            {avatarInitial}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-white">
                              {fullName}
                            </p>

                            {appeal.user
                              ?.verified && (
                              <VerifiedBadge
                                size={15}
                              />
                            )}

                            {appeal.user && (
                              <RoleBadge
                                role={
                                  appeal.user
                                    .role
                                }
                                showUser
                              />
                            )}

                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                                appeal.status ===
                                  "pending"
                                  ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                                  : appeal.status ===
                                      "approved"
                                    ? "border-green-400/20 bg-green-400/10 text-green-300"
                                    : "border-red-400/20 bg-red-400/10 text-red-300"
                              }`}
                            >
                              {appeal.status
                                .charAt(
                                  0,
                                )
                                .toUpperCase() +
                                appeal.status.slice(
                                  1,
                                )}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-gray-500">
                            {username}
                          </p>

                          <p className="mt-2 text-xs text-gray-600">
                            Submitted{" "}
                            {
                              formatDate(
                                appeal.created_at,
                              )
                            }
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-600">
                          Appeal
                        </p>

                        <p className="mt-3 whitespace-pre-wrap leading-7 text-gray-300">
                          {
                            appeal.message
                          }
                        </p>
                      </div>

                      {appeal.status !==
                        "pending" && (
                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-600">
                            Admin response
                          </p>

                          <p className="mt-3 leading-7 text-gray-400">
                            {appeal.admin_response ??
                              "No additional response was provided."}
                          </p>

                          {appeal.reviewed_at && (
                            <p className="mt-3 text-xs text-gray-600">
                              Reviewed{" "}
                              {
                                formatDate(
                                  appeal.reviewed_at,
                                )
                              }
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {appeal.status ===
                      "pending" && (
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openReview(
                              "reject",
                              appeal,
                            )
                          }
                          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-red-400/20 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/10"
                        >
                          <XCircle
                            size={16}
                          />

                          Reject
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openReview(
                              "approve",
                              appeal,
                            )
                          }
                          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-green-400"
                        >
                          <CheckCircle2
                            size={16}
                          />

                          Approve & Unblock
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            },
          )}
        </div>
      )}

      {/* =================================================
          REVIEW MODAL
      ================================================= */}

      {pendingReview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onMouseDown={(
            event,
          ) => {
            if (
              event.target ===
                event.currentTarget
            ) {
              closeReview();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#102A2A] shadow-2xl"
          >
            <div className="p-6 md:p-7">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                  pendingReview.type ===
                    "approve"
                    ? "border-green-400/20 bg-green-400/10 text-green-300"
                    : "border-red-400/20 bg-red-400/10 text-red-300"
                }`}
              >
                {pendingReview.type ===
                  "approve" ? (
                  <CheckCircle2
                    size={22}
                  />
                ) : (
                  <XCircle
                    size={22}
                  />
                )}
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-white">
                {pendingReview.type ===
                  "approve"
                  ? "Approve appeal?"
                  : "Reject appeal?"}
              </h2>

              <p className="mt-3 leading-7 text-gray-400">
                {pendingReview.type ===
                  "approve"
                  ? "Approving this appeal will immediately restore the user's account."
                  : "The user's account will remain blocked."}
              </p>

              <div className="mt-6">
                <label className="text-sm font-medium text-gray-300">
                  Admin response{" "}
                  {pendingReview.type ===
                    "approve" && (
                    <span className="text-gray-600">
                      (optional)
                    </span>
                  )}
                </label>

                <textarea
                  value={
                    response
                  }
                  onChange={(
                    event,
                  ) =>
                    setResponse(
                      event.target
                        .value,
                    )
                  }
                  rows={5}
                  placeholder={
                    pendingReview.type ===
                    "approve"
                      ? "Optional message to the user..."
                      : "Explain why the appeal was rejected..."
                  }
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
                  closeReview
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
                  void submitReview();
                }}
                className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  pendingReview.type ===
                    "approve"
                    ? "bg-green-500 text-black hover:bg-green-400"
                    : "bg-red-500 text-white hover:bg-red-400"
                }`}
              >
                {working
                  ? "Processing..."
                  : pendingReview.type ===
                      "approve"
                    ? "Approve & Unblock"
                    : "Reject Appeal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}