"use client";

import Link from "next/link";
import {
  ExternalLink,
  MessageCircle,
  Search,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import VerifiedBadge from "../ui/VerifiedBadge";
import { createClient } from "../../lib/supabase/client";

interface CommentProfile {
  display_name: string | null;
  avatar_url: string | null;
  verified: boolean;
}

interface CommentPost {
  id: string;
  title: string;
  slug: string;
}

interface AdminComment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;

  status:
    | "pending"
    | "approved"
    | "rejected"
    | "spam";

  created_at: string;
  updated_at: string;
  edited: boolean;

  profile:
    | CommentProfile
    | CommentProfile[]
    | null;

  post:
    | CommentPost
    | CommentPost[]
    | null;
}

interface AdminCommentsManagerProps {
  initialComments: AdminComment[];
}

type FilterType =
  | "all"
  | "top-level"
  | "replies";

export default function AdminCommentsManager({
  initialComments,
}: AdminCommentsManagerProps) {
  const [comments, setComments] =
    useState<AdminComment[]>(
      initialComments,
    );

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<FilterType>(
      "all",
    );

  const [
    deleteTargetId,
    setDeleteTargetId,
  ] = useState<string | null>(
    null,
  );

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  const getProfile = (
    comment: AdminComment,
  ) => {
    return Array.isArray(
      comment.profile,
    )
      ? comment.profile[0]
      : comment.profile;
  };

  const getPost = (
    comment: AdminComment,
  ) => {
    return Array.isArray(
      comment.post,
    )
      ? comment.post[0]
      : comment.post;
  };

  const formatDate = (
    value: string,
  ) => {
    return new Intl.DateTimeFormat(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    ).format(
      new Date(value),
    );
  };

  const filteredComments =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return comments.filter(
        (comment) => {
          const profile =
            getProfile(
              comment,
            );

          const post =
            getPost(
              comment,
            );

          const matchesSearch =
            !query ||
            comment.content
              .toLowerCase()
              .includes(
                query,
              ) ||
            profile
              ?.display_name
              ?.toLowerCase()
              .includes(
                query,
              ) ||
            post?.title
              .toLowerCase()
              .includes(
                query,
              );

          const matchesFilter =
            filter === "all"
              ? true
              : filter ===
                  "top-level"
                ? comment.parent_id ===
                  null
                : comment.parent_id !==
                  null;

          return (
            matchesSearch &&
            matchesFilter
          );
        },
      );
    }, [
      comments,
      search,
      filter,
    ]);

  const deleteTarget =
    deleteTargetId
      ? comments.find(
          (comment) =>
            comment.id ===
            deleteTargetId,
        )
      : undefined;

  const deleteComment =
    async () => {
      if (!deleteTargetId) {
        return;
      }

      setError("");

      try {
        setDeleting(true);

        const supabase =
          createClient();

        const {
          error,
        } = await supabase
          .from("comments")
          .delete()
          .eq(
            "id",
            deleteTargetId,
          );

        if (error) {
          throw error;
        }

        setComments(
          (current) =>
            current.filter(
              (comment) =>
                comment.id !==
                deleteTargetId,
            ),
        );

        setDeleteTargetId(
          null,
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "The comment could not be deleted.",
        );
      } finally {
        setDeleting(false);
      }
    };

  return (
    <>
      <div className="space-y-6">
        {/* Controls */}

        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5 md:flex-row md:items-center md:justify-between">
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
              placeholder="Search comments, users, or posts..."
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
                  "top-level",
                  "Comments",
                ],
                [
                  "replies",
                  "Replies",
                ],
              ] as [
                FilterType,
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

        {/* Summary */}

        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          <span>
            {
              filteredComments.length
            }{" "}
            shown
          </span>

          <span>
            •
          </span>

          <span>
            {
              comments.length
            }{" "}
            total
          </span>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        {/* Comment list */}

        {filteredComments.length ===
        0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/10 p-10 text-center">
            <MessageCircle
              size={30}
              className="mx-auto text-gray-600"
            />

            <p className="mt-4 text-gray-400">
              No matching comments.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComments.map(
              (comment) => {
                const profile =
                  getProfile(
                    comment,
                  );

                const post =
                  getPost(
                    comment,
                  );

                const name =
                  profile
                    ?.display_name ??
                  "User";

                return (
                  <article
                    key={
                      comment.id
                    }
                    className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5 md:p-6"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0 flex-1">
                        {/* Author */}

                        <div className="flex items-center gap-3">
                          {profile
                            ?.avatar_url ? (
                            <img
                              src={
                                profile.avatar_url
                              }
                              alt=""
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-400/10 text-sm font-semibold text-green-300">
                              {name
                                .charAt(
                                  0,
                                )
                                .toUpperCase()}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium text-white">
                                {
                                  name
                                }
                              </p>

                              {profile
                                ?.verified && (
                                <VerifiedBadge
                                  size={
                                    17
                                  }
                                />
                              )}
                            </div>

                            <p className="mt-1 text-xs text-gray-500">
                              {formatDate(
                                comment.created_at,
                              )}

                              {comment.edited &&
                                " • Edited"}
                            </p>
                          </div>
                        </div>

                        {/* Comment */}

                        <p className="mt-5 whitespace-pre-wrap break-words leading-7 text-gray-300">
                          {
                            comment.content
                          }
                        </p>

                        {/* Post */}

                        {post && (
                          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                            <span>
                              On:
                            </span>

                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 font-medium text-green-400 transition hover:text-green-300"
                            >
                              {
                                post.title
                              }

                              <ExternalLink
                                size={
                                  13
                                }
                              />
                            </Link>
                          </div>
                        )}

                        {comment.parent_id && (
                          <p className="mt-3 text-xs font-medium uppercase tracking-wider text-gray-600">
                            Reply
                          </p>
                        )}
                      </div>

                      {/* Admin actions */}

                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTargetId(
                            comment.id,
                          );

                          setError(
                            "",
                          );
                        }}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-400/20 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/10"
                      >
                        <Trash2
                          size={16}
                        />

                        Delete
                      </button>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        )}
      </div>

      {/* Delete modal */}

      {deleteTargetId && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-delete-comment-title"
          onMouseDown={(
            event,
          ) => {
            if (
              event.target ===
                event.currentTarget &&
              !deleting
            ) {
              setDeleteTargetId(
                null,
              );
            }
          }}
        >
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#102A2A] p-6 shadow-2xl md:p-8">
            <button
              type="button"
              disabled={
                deleting
              }
              onClick={() =>
                setDeleteTargetId(
                  null,
                )
              }
              className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
              aria-label="Close"
            >
              <X
                size={20}
              />
            </button>

            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
              <TriangleAlert
                size={24}
              />
            </div>

            <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-red-300">
              Moderation
            </p>

            <h2
              id="admin-delete-comment-title"
              className="mt-3 text-2xl font-bold text-white"
            >
              Delete this comment?
            </h2>

            <p className="mt-4 leading-7 text-gray-400">
              This will permanently remove the selected comment. If the database relationship uses cascading deletion, its replies may also be removed.
            </p>

            {deleteTarget && (
              <div className="mt-6 rounded-xl border border-white/10 bg-black/10 p-4">
                <p className="line-clamp-4 text-sm leading-6 text-gray-300">
                  {
                    deleteTarget.content
                  }
                </p>
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={
                  deleting
                }
                onClick={() =>
                  setDeleteTargetId(
                    null,
                  )
                }
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  deleting
                }
                onClick={() => {
                  void deleteComment();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-400 disabled:opacity-60"
              >
                <Trash2
                  size={17}
                />

                {deleting
                  ? "Deleting..."
                  : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}