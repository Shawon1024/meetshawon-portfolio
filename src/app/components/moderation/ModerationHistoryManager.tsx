"use client";

import Link from "next/link";
import {
  Ban,
  CheckCircle2,
  Clock3,
  EyeOff,
  History,
  MessageSquareWarning,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import RoleBadge from "../ui/RoleBadge";
import VerifiedBadge from "../ui/VerifiedBadge";

interface HistoryProfile {
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

interface HistoryComment {
  id: string;
  content:
    string;
  status:
    string;
}

interface HistoryPost {
  id: string;
  title:
    string | null;
  slug:
    string | null;
}

interface HistoryItem {
  id: string;
  target_user_id:
    string;
  actor_id:
    string | null;
  action:
    string;
  previous_status:
    string | null;
  new_status:
    string | null;
  public_reason:
    string | null;
  internal_notes:
    string | null;
  expires_at:
    string | null;
  created_at:
    string;

  actor:
    HistoryProfile | null;

  target:
    HistoryProfile | null;

  comment:
    HistoryComment | null;

  post:
    HistoryPost | null;
}

interface ModerationHistoryManagerProps {
  initialHistory:
    HistoryItem[];
}

type HistoryFilter =
  | "all"
  | "account"
  | "comment_hidden"
  | "comment_marked_spam"
  | "comment_restored";

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

function isCommentAction(
  action:
    string,
) {
  return (
    action ===
      "comment_hidden" ||
    action ===
      "comment_marked_spam" ||
    action ===
      "comment_restored"
  );
}

function actionLabel(
  action:
    string,
) {
  switch (
    action
  ) {
    case "restrict":
      return "Restricted";

    case "extend_restriction":
      return "Changed Restriction";

    case "remove_restriction":
      return "Removed Restriction";

    case "block":
      return "Blocked";

    case "unblock":
      return "Unblocked";

    case "restriction_expired":
      return "Restriction Expired";

    case "comment_hidden":
      return "Comment Hidden";

    case "comment_marked_spam":
      return "Comment Marked as Spam";

    case "comment_restored":
      return "Comment Restored";

    default:
      return action
        .replaceAll(
          "_",
          " ",
        )
        .replace(
          /\b\w/g,
          (
            character,
          ) =>
            character.toUpperCase(),
        );
  }
}

function actionIcon(
  action:
    string,
) {
  switch (
    action
  ) {
    case "block":
      return (
        <Ban
          size={18}
        />
      );

    case "unblock":
    case "remove_restriction":
      return (
        <ShieldCheck
          size={18}
        />
      );

    case "restrict":
    case "extend_restriction":
      return (
        <Clock3
          size={18}
        />
      );

    case "comment_hidden":
      return (
        <EyeOff
          size={18}
        />
      );

    case "comment_marked_spam":
      return (
        <ShieldAlert
          size={18}
        />
      );

    case "comment_restored":
      return (
        <CheckCircle2
          size={18}
        />
      );

    default:
      return (
        <ShieldOff
          size={18}
        />
      );
  }
}

function actionTone(
  action:
    string,
) {
  switch (
    action
  ) {
    case "comment_hidden":
      return "border-red-400/15 bg-red-400/[0.06] text-red-300";

    case "comment_marked_spam":
      return "border-fuchsia-400/15 bg-fuchsia-400/[0.06] text-fuchsia-300";

    case "comment_restored":
      return "border-green-400/15 bg-green-400/[0.06] text-green-300";

    default:
      return "border-amber-400/15 bg-amber-400/[0.06] text-amber-300";
  }
}

export default function ModerationHistoryManager({
  initialHistory,
}: ModerationHistoryManagerProps) {
  const [
    history,
  ] =
    useState(
      initialHistory,
    );

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    filter,
    setFilter,
  ] =
    useState<HistoryFilter>(
      "all",
    );

  const filteredHistory =
    useMemo(
      () => {
        const query =
          search
            .trim()
            .toLowerCase();

        return history.filter(
          (
            item,
          ) => {
            const actorName =
              item.actor
                ?.display_name
                ?.toLowerCase() ??
              "";

            const actorUsername =
              item.actor
                ?.username
                ?.toLowerCase() ??
              "";

            const targetName =
              item.target
                ?.display_name
                ?.toLowerCase() ??
              "";

            const targetUsername =
              item.target
                ?.username
                ?.toLowerCase() ??
              "";

            const reason =
              item.public_reason
                ?.toLowerCase() ??
              "";

            const comment =
              item.comment
                ?.content
                ?.toLowerCase() ??
              "";

            const postTitle =
              item.post
                ?.title
                ?.toLowerCase() ??
              "";

            const action =
              actionLabel(
                item.action,
              ).toLowerCase();

            const matchesSearch =
              !query ||
              actorName.includes(
                query,
              ) ||
              actorUsername.includes(
                query,
              ) ||
              targetName.includes(
                query,
              ) ||
              targetUsername.includes(
                query,
              ) ||
              reason.includes(
                query,
              ) ||
              comment.includes(
                query,
              ) ||
              postTitle.includes(
                query,
              ) ||
              action.includes(
                query,
              );

            const matchesFilter =
              filter ===
                "all"
                ? true
                : filter ===
                    "account"
                  ? !isCommentAction(
                      item.action,
                    )
                  : item.action ===
                    filter;

            return (
              matchesSearch &&
              matchesFilter
            );
          },
        );
      },
      [
        history,
        search,
        filter,
      ],
    );

  return (
    <div className="space-y-6">
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
            placeholder="Search moderation history..."
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
                "account",
                "Account Actions",
              ],
              [
                "comment_hidden",
                "Hidden",
              ],
              [
                "comment_marked_spam",
                "Spam",
              ],
              [
                "comment_restored",
                "Restored",
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
          HISTORY
      ================================================= */}

      {filteredHistory.length ===
      0 ? (
        <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-10 text-center">
          <History
            size={28}
            className="mx-auto text-gray-600"
          />

          <p className="mt-4 text-gray-500">
            No moderation activity found.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map(
            (
              item,
            ) => {
              const actorName =
                item.actor
                  ?.display_name ??
                item.actor
                  ?.username ??
                "System";

              const targetName =
                item.target
                  ?.display_name ??
                item.target
                  ?.username ??
                "User";

              const contentAction =
                isCommentAction(
                  item.action,
                );

              return (
                <article
                  key={
                    item.id
                  }
                  className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5 md:p-6"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${actionTone(
                        item.action,
                      )}`}
                    >
                      {actionIcon(
                        item.action,
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-white">
                          {
                            actionLabel(
                              item.action,
                            )
                          }
                        </p>

                        {contentAction && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/20 bg-blue-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-300">
                            <MessageSquareWarning
                              size={11}
                            />

                            Content
                          </span>
                        )}

                        <span className="text-sm text-gray-600">
                          •
                        </span>

                        <p className="text-sm text-gray-500">
                          {
                            formatDate(
                              item.created_at,
                            )
                          }
                        </p>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {/* Actor */}

                        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-gray-600">
                            Staff
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <p className="font-medium text-white">
                              {
                                actorName
                              }
                            </p>

                            {item.actor
                              ?.verified && (
                              <VerifiedBadge
                                size={14}
                              />
                            )}

                            {item.actor && (
                              <RoleBadge
                                role={
                                  item.actor
                                    .role
                                }
                                showUser
                              />
                            )}
                          </div>

                          {item.actor
                            ?.username && (
                            <p className="mt-1 text-sm text-gray-500">
                              @
                              {
                                item.actor
                                  .username
                              }
                            </p>
                          )}
                        </div>

                        {/* Target */}

                        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-gray-600">
                            {contentAction
                              ? "Comment Owner"
                              : "User"}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <p className="font-medium text-white">
                              {
                                targetName
                              }
                            </p>

                            {item.target
                              ?.verified && (
                              <VerifiedBadge
                                size={14}
                              />
                            )}

                            {item.target && (
                              <RoleBadge
                                role={
                                  item.target
                                    .role
                                }
                                showUser
                              />
                            )}
                          </div>

                          {item.target
                            ?.username && (
                            <p className="mt-1 text-sm text-gray-500">
                              @
                              {
                                item.target
                                  .username
                              }
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Content moderation context */}

                      {contentAction && (
                        <div className="mt-4 rounded-xl border border-blue-400/10 bg-blue-400/[0.03] p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-blue-300/70">
                            Content
                          </p>

                          {item.post && (
                            <div className="mt-3">
                              <p className="text-xs text-gray-600">
                                Blog post
                              </p>

                              {item.post
                                .slug ? (
                                <Link
                                  href={`/blog/${item.post.slug}`}
                                  className="mt-1 inline-flex text-sm font-medium text-blue-300 transition hover:text-blue-200"
                                >
                                  {
                                    item.post
                                      .title ??
                                    "View post"
                                  }
                                </Link>
                              ) : (
                                <p className="mt-1 text-sm font-medium text-gray-300">
                                  {
                                    item.post
                                      .title ??
                                    "Blog post"
                                  }
                                </p>
                              )}
                            </div>
                          )}

                          {item.comment && (
                            <div className="mt-4">
                              <p className="text-xs text-gray-600">
                                Comment
                              </p>

                              <p className="mt-1 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-gray-300">
                                {
                                  item.comment
                                    .content
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Status change */}

                      {(item.previous_status ||
                        item.new_status) && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                          <span className="text-gray-500">
                            Status:
                          </span>

                          <span className="capitalize text-gray-300">
                            {item.previous_status ??
                              "unknown"}
                          </span>

                          <span className="text-gray-600">
                            →
                          </span>

                          <span className="capitalize text-white">
                            {item.new_status ??
                              "unknown"}
                          </span>
                        </div>
                      )}

                      {/* Reason */}

                      {item.public_reason && (
                        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-gray-600">
                            Reason
                          </p>

                          <p className="mt-2 leading-6 text-gray-300">
                            {
                              item.public_reason
                            }
                          </p>
                        </div>
                      )}

                      {/* Internal notes - account actions only */}

                      {item.internal_notes &&
                        !contentAction && (
                        <div className="mt-3 rounded-xl border border-amber-400/10 bg-amber-400/[0.04] p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-amber-300/70">
                            Staff Notes
                          </p>

                          <p className="mt-2 text-sm leading-6 text-gray-400">
                            {
                              item.internal_notes
                            }
                          </p>
                        </div>
                      )}

                      {item.expires_at && (
                        <p className="mt-4 text-sm text-amber-300">
                          Restriction expiry:{" "}
                          {
                            formatDate(
                              item.expires_at,
                            )
                          }
                        </p>
                      )}
                    </div>
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