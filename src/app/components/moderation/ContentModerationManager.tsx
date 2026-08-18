"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  EyeOff,
  MessageSquare,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import { createClient } from "../../lib/supabase/client";
import RoleBadge from "../ui/RoleBadge";
import VerifiedBadge from "../ui/VerifiedBadge";

type CommentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "spam";

interface CommentProfile {
  id: string;
  display_name:
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

interface CommentPost {
  id: string;
  title:
    string | null;
  slug:
    string | null;
}

interface ModerationComment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id:
    string | null;
  content: string;
  status:
    CommentStatus;
  edited:
    boolean;
  moderation_reason:
    string | null;
  moderated_by:
    string | null;
  moderated_at:
    string | null;
  created_at: string;
  updated_at: string;

  author:
    CommentProfile | null;

  moderator:
    CommentProfile | null;

  post:
    CommentPost | null;
}

interface ContentModerationManagerProps {
  initialComments:
    ModerationComment[];
}

type Filter =
  | "all"
  | CommentStatus;

type ModerationAction =
  | "hide"
  | "spam"
  | "restore";

interface PendingAction {
  type:
    ModerationAction;
  comment:
    ModerationComment;
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

function statusLabel(
  status:
    CommentStatus,
) {
  switch (
    status
  ) {
    case "approved":
      return "Approved";

    case "pending":
      return "Pending";

    case "rejected":
      return "Hidden";

    case "spam":
      return "Spam";
  }
}

function statusClasses(
  status:
    CommentStatus,
) {
  switch (
    status
  ) {
    case "approved":
      return "border-green-400/20 bg-green-400/10 text-green-300";

    case "pending":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";

    case "rejected":
      return "border-red-400/20 bg-red-400/10 text-red-300";

    case "spam":
      return "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-300";
  }
}

export default function ContentModerationManager({
  initialComments,
}: ContentModerationManagerProps) {
  const supabase =
    useMemo(
      () =>
        createClient(),
      [],
    );

  const [
    comments,
    setComments,
  ] =
    useState(
      initialComments,
    );

  const [
    filter,
    setFilter,
  ] =
    useState<Filter>(
      "all",
    );

  const [
    search,
    setSearch,
  ] =
    useState("");

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

  const approvedCount =
    comments.filter(
      (
        comment,
      ) =>
        comment.status ===
        "approved",
    ).length;

  const pendingCount =
    comments.filter(
      (
        comment,
      ) =>
        comment.status ===
        "pending",
    ).length;

  const hiddenCount =
    comments.filter(
      (
        comment,
      ) =>
        comment.status ===
        "rejected",
    ).length;

  const spamCount =
    comments.filter(
      (
        comment,
      ) =>
        comment.status ===
        "spam",
    ).length;

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const filteredComments =
    useMemo(
      () => {
        const query =
          search
            .trim()
            .toLowerCase();

        return comments.filter(
          (
            comment,
          ) => {
            const authorName =
              comment.author
                ?.display_name
                ?.toLowerCase() ??
              "";

            const username =
              comment.author
                ?.username
                ?.toLowerCase() ??
              "";

            const postTitle =
              comment.post
                ?.title
                ?.toLowerCase() ??
              "";

            const content =
              comment.content
                .toLowerCase();

            const reasonText =
              comment.moderation_reason
                ?.toLowerCase() ??
              "";

            const matchesSearch =
              !query ||
              authorName.includes(
                query,
              ) ||
              username.includes(
                query,
              ) ||
              postTitle.includes(
                query,
              ) ||
              content.includes(
                query,
              ) ||
              reasonText.includes(
                query,
              );

            const matchesFilter =
              filter ===
                "all"
                ? true
                : comment.status ===
                  filter;

            return (
              matchesSearch &&
              matchesFilter
            );
          },
        );
      },
      [
        comments,
        filter,
        search,
      ],
    );

  // --------------------------------------------------
  // ACTION MODAL
  // --------------------------------------------------

  const openAction =
    (
      type:
        ModerationAction,
      comment:
        ModerationComment,
    ) => {
      setPendingAction({
        type,
        comment,
      });

      setReason("");
      setError("");
    };

  const closeAction =
    () => {
      if (
        working
      ) {
        return;
      }

      setPendingAction(
        null,
      );

      setReason("");
      setError("");
    };

  // --------------------------------------------------
  // SUBMIT ACTION
  // --------------------------------------------------

  const submitAction =
    async () => {
      if (
        !pendingAction
      ) {
        return;
      }

      if (
        pendingAction.type !==
          "restore" &&
        reason
          .trim()
          .length <
          3
      ) {
        setError(
          "Please provide a moderation reason.",
        );

        return;
      }

      setWorking(
        true,
      );

      setError("");

      try {
        const rpcName =
          pendingAction.type ===
            "hide"
            ? "moderate_comment_hide"
            : pendingAction.type ===
                "spam"
              ? "moderate_comment_spam"
              : "moderate_comment_restore";

        const {
          error:
            rpcError,
        } =
          await supabase.rpc(
            rpcName,
            {
              target_comment_id:
                pendingAction
                  .comment.id,

              moderation_reason_text:
                reason
                  .trim() ||
                null,
            },
          );

        if (rpcError) {
  const errorDetails = [
    rpcError.code
      ? `Code: ${rpcError.code}`
      : null,

    rpcError.message
      ? `Message: ${rpcError.message}`
      : null,

    rpcError.details
      ? `Details: ${rpcError.details}`
      : null,

    rpcError.hint
      ? `Hint: ${rpcError.hint}`
      : null,
  ]
    .filter(Boolean)
    .join(" | ");

  console.error(
    `Comment moderation failed: ${
      errorDetails ||
      "Unknown Supabase error"
    }`,
  );

  throw new Error(
    errorDetails ||
      "The moderation action could not be completed.",
  );
}

        const nextStatus:
          CommentStatus =
            pendingAction.type ===
              "hide"
              ? "rejected"
              : pendingAction.type ===
                  "spam"
                ? "spam"
                : "approved";

        const moderatedAt =
          new Date().toISOString();

        const {
          data: {
            user,
          },
        } =
          await supabase.auth.getUser();

        setComments(
          (
            current,
          ) =>
            current.map(
              (
                comment,
              ) =>
                comment.id ===
                pendingAction
                  .comment.id
                  ? {
                      ...comment,
                      status:
                        nextStatus,
                      moderation_reason:
                        pendingAction.type ===
                          "restore"
                          ? reason
                              .trim() ||
                            null
                          : reason.trim(),
                      moderated_by:
                        user?.id ??
                        comment.moderated_by,
                      moderated_at:
                        moderatedAt,
                      updated_at:
                        moderatedAt,
                    }
                  : comment,
            ),
        );

        setPendingAction(
          null,
        );

        setReason("");
      } catch (
        actionError
      ) {
        console.error(
          "Comment moderation action failed:",
          actionError,
        );

        setError(
          actionError instanceof Error
            ? actionError.message
            : "The moderation action could not be completed.",
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
          <MessageSquare
            size={20}
            className="text-gray-300"
          />

          <p className="mt-4 text-sm text-gray-500">
            Total
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {
              comments.length
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
          <EyeOff
            size={20}
            className="text-red-300"
          />

          <p className="mt-4 text-sm text-gray-500">
            Hidden
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {
              hiddenCount
            }
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
          <ShieldAlert
            size={20}
            className="text-fuchsia-300"
          />

          <p className="mt-4 text-sm text-gray-500">
            Spam
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {
              spamCount
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
            placeholder="Search comments..."
            className="w-full rounded-xl border border-white/10 bg-black/10 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-400/40"
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
                "approved",
                "Approved",
              ],
              [
                "pending",
                "Pending",
              ],
              [
                "rejected",
                "Hidden",
              ],
              [
                "spam",
                "Spam",
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
                    ? "border-blue-400/30 bg-blue-400/10 text-blue-300"
                    : "border-white/10 bg-black/10 text-gray-400 hover:border-blue-400/30 hover:text-white"
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
          COMMENT LIST
      ================================================= */}

      {filteredComments.length ===
      0 ? (
        <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-10 text-center">
          <ShieldCheck
            size={28}
            className="mx-auto text-blue-300"
          />

          <h2 className="mt-4 text-xl font-semibold text-white">
            No comments found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            There are no comments matching the current search and filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.map(
            (
              comment,
            ) => {
              const authorName =
                comment.author
                  ?.display_name ??
                comment.author
                  ?.username ??
                "User";

              return (
                <article
                  key={
                    comment.id
                  }
                  className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5 md:p-6"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      {/* Author */}

                      <div className="flex gap-4">
                        {comment.author
                          ?.avatar_url ? (
                            <Image
                              src={
                                comment.author
                                  .avatar_url
                              }
                              alt=""
                              width={48}
                              height={48}
                              sizes="48px"
                              className="h-12 w-12 shrink-0 rounded-full border border-white/10 object-cover"
                            />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-400/10 font-semibold text-blue-300">
                            {authorName
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
                                authorName
                              }
                            </p>

                            {comment.author
                              ?.verified && (
                              <VerifiedBadge
                                size={15}
                              />
                            )}

                            {comment.author && (
                              <RoleBadge
                                role={
                                  comment.author
                                    .role
                                }
                                showUser
                              />
                            )}

                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses(
                                comment.status,
                              )}`}
                            >
                              {
                                statusLabel(
                                  comment.status,
                                )
                              }
                            </span>

                            {comment.parent_id && (
                              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-400">
                                Reply
                              </span>
                            )}

                            {comment.edited && (
                              <span className="text-xs text-gray-600">
                                Edited
                              </span>
                            )}
                          </div>

                          {comment.author
                            ?.username && (
                            <p className="mt-1 text-sm text-gray-500">
                              @
                              {
                                comment.author
                                  .username
                              }
                            </p>
                          )}

                          <p className="mt-2 text-xs text-gray-600">
                            {
                              formatDate(
                                comment.created_at,
                              )
                            }
                          </p>
                        </div>
                      </div>

                      {/* Post */}

                      {comment.post && (
                        <div className="mt-5">
                          {comment.post
                            .slug ? (
                            <Link
                              href={`/blog/${comment.post.slug}#comment-${comment.id}`}
                              className="text-sm font-medium text-blue-300 transition hover:text-blue-200"
                            >
                              {
                                comment.post
                                  .title ??
                                "View post"
                              }
                            </Link>
                          ) : (
                            <p className="text-sm font-medium text-gray-400">
                              {
                                comment.post
                                  .title ??
                                "Blog post"
                              }
                            </p>
                          )}
                        </div>
                      )}

                      {/* Comment */}

                      <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-600">
                          Comment
                        </p>

                        <p className="mt-3 whitespace-pre-wrap leading-7 text-gray-300">
                          {
                            comment.content
                          }
                        </p>
                      </div>

                      {/* Existing moderation info */}

                      {comment.moderation_reason && (
                        <div className="mt-4 rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] p-4">
                          <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-300/70">
                            Moderation Reason
                          </p>

                          <p className="mt-2 text-sm leading-6 text-gray-400">
                            {
                              comment.moderation_reason
                            }
                          </p>

                          {comment.moderated_at && (
                            <p className="mt-3 text-xs text-gray-600">
                              Moderated{" "}
                              {
                                formatDate(
                                  comment.moderated_at,
                                )
                              }
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}

                    <div className="flex shrink-0 flex-wrap gap-2">
                      {(comment.status ===
                        "approved" ||
                        comment.status ===
                          "pending") && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              openAction(
                                "hide",
                                comment,
                              )
                            }
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.04] px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/10"
                          >
                            <EyeOff
                              size={16}
                            />

                            Hide
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openAction(
                                "spam",
                                comment,
                              )
                            }
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-fuchsia-400/20 bg-fuchsia-400/[0.04] px-4 py-2.5 text-sm font-medium text-fuchsia-300 transition hover:bg-fuchsia-400/10"
                          >
                            <Trash2
                              size={16}
                            />

                            Mark Spam
                          </button>
                        </>
                      )}

                      {(comment.status ===
                        "rejected" ||
                        comment.status ===
                          "spam" ||
                        comment.status ===
                          "pending") && (
                        <button
                          type="button"
                          onClick={() =>
                            openAction(
                              "restore",
                              comment,
                            )
                          }
                          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-green-400/20 bg-green-400/[0.04] px-4 py-2.5 text-sm font-medium text-green-300 transition hover:bg-green-400/10"
                        >
                          <CheckCircle2
                            size={16}
                          />

                          Approve / Restore
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            },
          )}
        </div>
      )}

      {/* =================================================
          ACTION MODAL
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
              closeAction();
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
                  pendingAction.type ===
                    "restore"
                    ? "border-green-400/20 bg-green-400/10 text-green-300"
                    : pendingAction.type ===
                        "spam"
                      ? "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-300"
                      : "border-red-400/20 bg-red-400/10 text-red-300"
                }`}
              >
                {pendingAction.type ===
                  "restore" ? (
                  <CheckCircle2
                    size={22}
                  />
                ) : pendingAction.type ===
                    "spam" ? (
                  <ShieldAlert
                    size={22}
                  />
                ) : (
                  <EyeOff
                    size={22}
                  />
                )}
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-white">
                {pendingAction.type ===
                  "hide"
                  ? "Hide this comment?"
                  : pendingAction.type ===
                      "spam"
                    ? "Mark this comment as spam?"
                    : "Restore this comment?"}
              </h2>

              <p className="mt-3 leading-7 text-gray-400">
                {pendingAction.type ===
                  "hide"
                  ? "The comment will no longer be publicly visible."
                  : pendingAction.type ===
                      "spam"
                    ? "The comment will be hidden and classified as spam."
                    : "The comment will become publicly visible again."}
              </p>

              <div className="mt-6 rounded-xl border border-white/10 bg-black/10 p-4">
                <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-gray-300">
                  {
                    pendingAction
                      .comment.content
                  }
                </p>
              </div>

              <div className="mt-6">
                <label className="text-sm font-medium text-gray-300">
                  {pendingAction.type ===
                    "restore"
                    ? "Staff note"
                    : "Moderation reason"}

                  {pendingAction.type ===
                    "restore" && (
                    <span className="ml-1 text-gray-600">
                      (optional)
                    </span>
                  )}
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
                  rows={4}
                  placeholder={
                    pendingAction.type ===
                      "restore"
                      ? "Optional reason for restoring the comment..."
                      : "Explain why this moderation action is being taken..."
                  }
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-400/40"
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
                  closeAction
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
                  void submitAction();
                }}
                className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  pendingAction.type ===
                    "restore"
                    ? "bg-green-500 text-black hover:bg-green-400"
                    : pendingAction.type ===
                        "spam"
                      ? "bg-fuchsia-500 text-white hover:bg-fuchsia-400"
                      : "bg-red-500 text-white hover:bg-red-400"
                }`}
              >
                {working
                  ? "Processing..."
                  : pendingAction.type ===
                      "hide"
                    ? "Hide Comment"
                    : pendingAction.type ===
                        "spam"
                      ? "Mark as Spam"
                      : "Approve / Restore"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}