"use client";

import RoleBadge from "../ui/RoleBadge";
import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ChevronDown,
  CornerDownRight,
  MessageCircle,
  Pencil,
  Reply,
  Send,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";

import { createClient } from "../../lib/supabase/client";
import VerifiedBadge from "../ui/VerifiedBadge";

// ==========================================================
// TYPES
// ==========================================================

type ReactionType =
  | "like"
  | "love"
  | "haha"
  | "wow"
  | "sad"
  | "angry";

interface CommentProfile {
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  avatar_url: string | null;
  verified: boolean;
  role: string | null;
}

interface CommentReaction {
  id: string;
  comment_id: string;
  user_id: string;
  reaction: ReactionType;
}

interface CommentRow {
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

  comment_reactions:
    CommentReaction[];
}

interface CommentNode extends CommentRow {
  replies: CommentNode[];
}

interface ModerationSkeleton {
  id: string;
  parent_id: string | null;
  status:
    | "rejected"
    | "spam";
  created_at: string;
}

interface PostCommentsProps {
  postId: string;
}

interface ReactionOption {
  type: ReactionType;
  label: string;
  emoji: string;
}

// ==========================================================
// REACTIONS
// ==========================================================

const reactionOptions: ReactionOption[] = [
  {
    type: "like",
    label: "Like",
    emoji: "👍",
  },
  {
    type: "love",
    label: "Love",
    emoji: "❤️",
  },
  {
    type: "haha",
    label: "Haha",
    emoji: "😂",
  },
  {
    type: "wow",
    label: "Wow",
    emoji: "😮",
  },
  {
    type: "sad",
    label: "Sad",
    emoji: "😢",
  },
  {
    type: "angry",
    label: "Angry",
    emoji: "😡",
  },
];

export default function PostComments({
  postId,
}: PostCommentsProps) {
  const supabase = useMemo(
    () => createClient(),
    [],
  );

  // ========================================================
  // GENERAL STATE
  // ========================================================

  const [userId, setUserId] =
    useState<string | null>(null);

  const [comments, setComments] =
    useState<CommentRow[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ========================================================
  // NEW COMMENT STATE
  // ========================================================

  const [commentText, setCommentText] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  // ========================================================
  // REPLY STATE
  // ========================================================

  const [replyingTo, setReplyingTo] =
    useState<string | null>(null);

  const [replyText, setReplyText] =
    useState("");

  const [
    submittingReply,
    setSubmittingReply,
  ] = useState(false);

  const [replyError, setReplyError] =
    useState("");

  // ========================================================
  // EDIT STATE
  // ========================================================

  const [
    editingCommentId,
    setEditingCommentId,
  ] = useState<string | null>(null);

  const [editText, setEditText] =
    useState("");

  const [editError, setEditError] =
    useState("");

  const [savingEdit, setSavingEdit] =
    useState(false);

  // ========================================================
  // DELETE STATE
  // ========================================================

  const [
    deleteTargetId,
    setDeleteTargetId,
  ] = useState<string | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState("");

  // ========================================================
  // COMMENT REACTION STATE
  // ========================================================

  const [
    reactionPickerCommentId,
    setReactionPickerCommentId,
  ] = useState<string | null>(null);

  const [
    workingReactionCommentId,
    setWorkingReactionCommentId,
  ] = useState<string | null>(null);

  const [reactionError, setReactionError] =
    useState("");

  // ========================================================
  // LOAD COMMENTS
  // ========================================================

  useEffect(() => {
    let cancelled = false;

    const loadComments = async () => {
      setLoading(true);
      setError("");

      try {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        
        if (cancelled) {
            return;
        }
        /*
        * No Supabase session is completely normal for
        * a signed-out visitor.
        */
       setUserId(
        user?.id ?? null,
        );

        const {
          data,
          error: commentsError,
        } = await supabase
          .from("comments")
          .select(`
            id,
            post_id,
            user_id,
            parent_id,
            content,
            status,
            created_at,
            updated_at,
            edited,
            profile:profiles (
              first_name,
              last_name,
              username,
              avatar_url,
              verified,
              role
            ),
            comment_reactions (
              id,
              comment_id,
              user_id,
              reaction
            )
          `)
          .eq(
            "post_id",
            postId,
          )
          .eq(
            "status",
            "approved",
          )
          .order(
            "created_at",
            {
              ascending: true,
            },
          );

        if (commentsError) {
          throw commentsError;
        }

        const {
          data: skeletonRows,
          error: skeletonError,
        } = await supabase.rpc(
          "get_comment_moderation_skeletons",
          {
            target_post_id:
              postId,
          },
        );

        if (skeletonError) {
          throw skeletonError;
        }

        if (cancelled) {
          return;
        }

        const approvedComments =
          (data ?? []) as CommentRow[];

        const moderationSkeletons:
          CommentRow[] =
          (
            skeletonRows ??
            []
          ).map(
            (
              skeleton:
                ModerationSkeleton,
            ) => ({
              id:
                skeleton.id,

              post_id:
                postId,

              user_id:
                "",

              parent_id:
                skeleton.parent_id,

              content:
                "",

              status:
                skeleton.status,

              created_at:
                skeleton.created_at,

              updated_at:
                skeleton.created_at,

              edited:
                false,

              profile:
                null,

              comment_reactions:
                [],
            }),
          );

        const mergedComments = [
          ...approvedComments,
          ...moderationSkeletons,
        ].sort(
          (
            a,
            b,
          ) =>
            new Date(
              a.created_at,
            ).getTime() -
            new Date(
              b.created_at,
            ).getTime(),
        );

        setComments(
          mergedComments,
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load comments:",
          error,
        );

        setError(
          "Comments could not be loaded.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadComments();

    return () => {
      cancelled = true;
    };
  }, [
    postId,
    supabase,
  ]);

  // ========================================================
  // PROFILE
  // ========================================================

  const getProfile = (
    comment: CommentRow,
  ) => {
    return Array.isArray(
      comment.profile,
    )
      ? comment.profile[0]
      : comment.profile;
  };

  // ========================================================
  // DATE
  // ========================================================

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

  // ========================================================
  // FILTERING
  // ========================================================

  const containsLink = (
    value: string,
  ) => {
    const patterns = [
      /https?:\/\//i,
      /www\./i,
      /\b[a-z0-9][a-z0-9.-]*\.(com|net|org|io|co|uk|dev|app|xyz|info|biz|me)\b/i,
    ];

    return patterns.some(
      (pattern) =>
        pattern.test(value),
    );
  };

  const containsSpam = (
    value: string,
  ) => {
    const blockedPhrases = [
      "click here",
      "free money",
      "guaranteed profit",
      "crypto giveaway",
      "buy followers",
      "casino bonus",
      "investment opportunity",
    ];

    const normalised =
      value.toLowerCase();

    return blockedPhrases.some(
      (phrase) =>
        normalised.includes(
          phrase,
        ),
    );
  };

  const validateContent = (
    value: string,
  ) => {
    const clean =
      value.trim();

    if (!clean) {
      return "Please write something first.";
    }

    if (
      clean.length > 2000
    ) {
      return "Comments must be 2000 characters or fewer.";
    }

    if (
      containsLink(clean)
    ) {
      return "Links are not allowed in comments.";
    }

    if (
      containsSpam(clean)
    ) {
      return "Your comment was blocked by the spam filter.";
    }

    return null;
  };

  // ========================================================
  // INSERT COMMENT / REPLY
  // ========================================================

  const insertComment = async (
    content: string,
    parentId: string | null,
  ) => {
    if (!userId) {
      throw new Error(
        "You must be signed in to comment.",
      );
    }

    const {
      data,
      error,
    } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        user_id: userId,
        parent_id: parentId,
        content,
        status: "approved",
        edited: false,
      })
      .select(`
        id,
        post_id,
        user_id,
        parent_id,
        content,
        status,
        created_at,
        updated_at,
        edited,
        profile:profiles (
          first_name,
          last_name,
          username,
          avatar_url,
          verified,
          role
        )
      `)
      .single();

if (error) {
  const errorDetails = [
    error.code
      ? `Code: ${error.code}`
      : null,

    error.message
      ? `Message: ${error.message}`
      : null,

    error.details
      ? `Details: ${error.details}`
      : null,

    error.hint
      ? `Hint: ${error.hint}`
      : null,
  ]
    .filter(Boolean)
    .join(" | ");

  console.error(
    `Comment insert failed: ${
      errorDetails ||
      "Unknown Supabase error"
    }`,
  );

  throw new Error(
    errorDetails ||
      "Your comment could not be posted.",
  );
}

    return {
      ...(data as Omit<
        CommentRow,
        "comment_reactions"
      >),
      comment_reactions: [],
    } as CommentRow;
  };

  // ========================================================
  // POST TOP-LEVEL COMMENT
  // ========================================================

  const submitComment = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!userId) {
      setError(
        "Your session could not be verified. Please sign in again.",
      );

      return;
    }

    setError("");

    const validation =
      validateContent(
        commentText,
      );

    if (validation) {
      setError(validation);
      return;
    }

    try {
      setSubmitting(true);

      const newComment =
        await insertComment(
          commentText.trim(),
          null,
        );

      setComments(
        (current) => [
          ...current,
          newComment,
        ],
      );

      setCommentText("");
    } catch (error) {
      console.error(
        "Comment submission failed:",
        error,
      );

      if (
        error &&
        typeof error ===
          "object" &&
        "message" in error &&
        typeof error.message ===
          "string"
      ) {
        setError(
          error.message,
        );
      } else {
        setError(
          "Your comment could not be posted.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ========================================================
  // POST REPLY
  // ========================================================

  const submitReply = async (
    event: FormEvent<HTMLFormElement>,
    parentId: string,
  ) => {
    event.preventDefault();

    if (!userId) {
      setReplyError(
        "Your session could not be verified. Please sign in again.",
      );

      return;
    }

    setReplyError("");

    const validation =
      validateContent(
        replyText,
      );

    if (validation) {
      setReplyError(
        validation,
      );

      return;
    }

    try {
      setSubmittingReply(
        true,
      );

      const newReply =
        await insertComment(
          replyText.trim(),
          parentId,
        );

      setComments(
        (current) => [
          ...current,
          newReply,
        ],
      );

      setReplyText("");
      setReplyingTo(null);
    } catch (error) {
      console.error(
        "Comment reply submission failed:",
        error,
      );

      if (
        error &&
        typeof error ===
          "object" &&
        "message" in error &&
        typeof error.message ===
          "string"
      ) {
        setReplyError(
          error.message,
        );
      } else {
        setReplyError(
          "Your reply could not be posted.",
        );
      }
    } finally {
      setSubmittingReply(
        false,
      );
    }
  };

  // ========================================================
  // EDIT COMMENT
  // ========================================================

  const startEditing = (
    comment: CommentRow,
  ) => {
    setReplyingTo(null);
    setReplyText("");
    setReplyError("");

    setEditingCommentId(
      comment.id,
    );

    setEditText(
      comment.content,
    );

    setEditError("");
  };

  const cancelEditing = () => {
    if (savingEdit) {
      return;
    }

    setEditingCommentId(null);
    setEditText("");
    setEditError("");
  };

  const saveEditedComment = async (
    commentId: string,
  ) => {
    if (!userId) {
      return;
    }

    setEditError("");

    const validation =
      validateContent(
        editText,
      );

    if (validation) {
      setEditError(
        validation,
      );

      return;
    }

    try {
      setSavingEdit(true);

      const cleanContent =
        editText.trim();

      const {
        data,
        error,
      } = await supabase
        .from("comments")
        .update({
          content:
            cleanContent,

          edited:
            true,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          commentId,
        )
        .eq(
          "user_id",
          userId,
        )
        .select(`
          id,
          content,
          edited,
          updated_at
        `)
        .single();

      if (error) {
        if (
          error.message
            .toLowerCase()
            .includes(
              "row-level security",
            )
        ) {
          throw new Error(
            "Your edited comment was blocked by the content filter.",
          );
        }

        throw error;
      }

      setComments(
        (current) =>
          current.map(
            (comment) =>
              comment.id ===
              commentId
                ? {
                    ...comment,
                    content:
                      data.content,
                    edited:
                      data.edited,
                    updated_at:
                      data.updated_at,
                  }
                : comment,
          ),
      );

      setEditingCommentId(
        null,
      );

      setEditText("");
    } catch (error) {
      setEditError(
        error instanceof Error
          ? error.message
          : "Your comment could not be updated.",
      );
    } finally {
      setSavingEdit(false);
    }
  };

  // ========================================================
  // DELETE COMMENT
  // ========================================================

  const deleteTarget =
    deleteTargetId
      ? comments.find(
          (comment) =>
            comment.id ===
            deleteTargetId,
        )
      : undefined;

  const getDescendantIds = (
    parentId: string,
  ) => {
    const collected =
      new Set<string>();

    const collect = (
      id: string,
    ) => {
      comments
        .filter(
          (comment) =>
            comment.parent_id ===
            id,
        )
        .forEach(
          (child) => {
            collected.add(
              child.id,
            );

            collect(
              child.id,
            );
          },
        );
    };

    collect(parentId);

    return collected;
  };

  const deleteComment =
    async () => {
      if (
        !deleteTargetId ||
        !userId
      ) {
        return;
      }

      setDeleteError("");

      try {
        setDeleting(true);

        const {
          error,
        } = await supabase
          .from("comments")
          .delete()
          .eq(
            "id",
            deleteTargetId,
          )
          .eq(
            "user_id",
            userId,
          );

        if (error) {
          throw error;
        }

        const descendantIds =
          getDescendantIds(
            deleteTargetId,
          );

        setComments(
          (current) =>
            current.filter(
              (comment) =>
                comment.id !==
                  deleteTargetId &&
                !descendantIds.has(
                  comment.id,
                ),
            ),
        );

        setDeleteTargetId(
          null,
        );

        setReplyingTo(
          null,
        );

        setEditingCommentId(
          null,
        );
      } catch (error) {
        setDeleteError(
          error instanceof Error
            ? error.message
            : "The comment could not be deleted.",
        );
      } finally {
        setDeleting(false);
      }
    };

  // ========================================================
  // COMMENT REACTIONS
  // ========================================================

  const getReactionCount = (
    comment: CommentRow,
    type: ReactionType,
  ) => {
    return (
      comment.comment_reactions?.filter(
        (reaction) =>
          reaction.reaction ===
          type,
      ).length ?? 0
    );
  };

  const getUserReaction = (
    comment: CommentRow,
  ) => {
    if (!userId) {
      return undefined;
    }

    return comment.comment_reactions?.find(
      (reaction) =>
        reaction.user_id ===
        userId,
    );
  };

  const getReactionOption = (
    reaction?: ReactionType,
  ) => {
    if (!reaction) {
      return undefined;
    }

    return reactionOptions.find(
      (option) =>
        option.type ===
        reaction,
    );
  };

  const updateCommentReaction =
    async (
      comment: CommentRow,
      type: ReactionType,
    ) => {
      if (!userId) {
        return;
      }

      setWorkingReactionCommentId(
        comment.id,
      );

      setReactionError("");

      try {
        const existing =
          getUserReaction(
            comment,
          );

        // ----------------------------------------------
        // Clicking same reaction removes it
        // ----------------------------------------------

        if (
          existing &&
          existing.reaction ===
            type
        ) {
          const { error } =
            await supabase
              .from(
                "comment_reactions",
              )
              .delete()
              .eq(
                "id",
                existing.id,
              );

          if (error) {
            throw error;
          }

          setComments(
            (current) =>
              current.map(
                (item) =>
                  item.id ===
                  comment.id
                    ? {
                        ...item,

                        comment_reactions:
                          item.comment_reactions.filter(
                            (
                              reaction,
                            ) =>
                              reaction.id !==
                              existing.id,
                          ),
                      }
                    : item,
              ),
          );

          setReactionPickerCommentId(
            null,
          );

          return;
        }

        // ----------------------------------------------
        // Change existing reaction
        // ----------------------------------------------

        if (existing) {
          const {
            data,
            error,
          } = await supabase
            .from(
              "comment_reactions",
            )
            .update({
              reaction: type,
              updated_at:
                new Date().toISOString(),
            })
            .eq(
              "id",
              existing.id,
            )
            .select(`
              id,
              comment_id,
              user_id,
              reaction
            `)
            .single();

          if (error) {
            throw error;
          }

          setComments(
            (current) =>
              current.map(
                (item) =>
                  item.id ===
                  comment.id
                    ? {
                        ...item,

                        comment_reactions:
                          item.comment_reactions.map(
                            (
                              reaction,
                            ) =>
                              reaction.id ===
                              existing.id
                                ? (data as CommentReaction)
                                : reaction,
                          ),
                      }
                    : item,
              ),
          );

          setReactionPickerCommentId(
            null,
          );

          return;
        }

        // ----------------------------------------------
        // New reaction
        // ----------------------------------------------

        const {
          data,
          error,
        } = await supabase
          .from(
            "comment_reactions",
          )
          .insert({
            comment_id:
              comment.id,

            user_id:
              userId,

            reaction:
              type,
          })
          .select(`
            id,
            comment_id,
            user_id,
            reaction
          `)
          .single();

        if (error) {
          throw error;
        }

        setComments(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                comment.id
                  ? {
                      ...item,

                      comment_reactions: [
                        ...item.comment_reactions,
                        data as CommentReaction,
                      ],
                    }
                  : item,
            ),
        );

        setReactionPickerCommentId(
          null,
        );
      } catch (error) {
        setReactionError(
          error instanceof Error
            ? error.message
            : "Your reaction could not be updated.",
        );
      } finally {
        setWorkingReactionCommentId(
          null,
        );
      }
    };

  // ========================================================
  // CREATE COMMENT TREE
  // ========================================================

  const buildCommentTree = (
    rows: CommentRow[],
  ) => {
    const map =
      new Map<
        string,
        CommentNode
      >();

    const roots:
      CommentNode[] = [];

    rows.forEach(
      (comment) => {
        map.set(
          comment.id,
          {
            ...comment,
            replies: [],
          },
        );
      },
    );

    map.forEach(
      (comment) => {
        if (
          comment.parent_id
        ) {
          const parent =
            map.get(
              comment.parent_id,
            );

          if (parent) {
            parent.replies.push(
              comment,
            );

            return;
          }
        }

        roots.push(
          comment,
        );
      },
    );

    return roots;
  };

  const commentTree =
    buildCommentTree(
      comments,
    );

  // ========================================================
  // RENDER COMMENT
  // ========================================================

  const renderComment = (
    comment: CommentNode,
    depth = 0,
  ) => {
    // --------------------------------------------------------
    // SPAM
    // --------------------------------------------------------

    if (
      comment.status ===
      "spam"
    ) {
      return null;
    }

    // --------------------------------------------------------
    // MODERATION PLACEHOLDER
    // --------------------------------------------------------

    if (
      comment.status ===
      "rejected"
    ) {
      if (
        comment.replies.length ===
        0
      ) {
        return null;
      }

      return (
        <div
          key={
            comment.id
          }
          className={
            depth > 0
              ? "ml-4 border-l border-white/10 pl-4 md:ml-8 md:pl-6"
              : ""
          }
        >
          <article className="rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                <TriangleAlert
                  size={18}
                />
              </div>

              <div>
                <p className="font-medium text-amber-200">
                  Comment removed
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  This comment was removed by moderation.
                </p>
              </div>
            </div>
          </article>

          {comment.replies.length >
            0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map(
                (
                  reply,
                ) =>
                  renderComment(
                    reply,
                    depth + 1,
                  ),
              )}
            </div>
          )}
        </div>
      );
    }

    const profile =
      getProfile(comment);

    const fullName = [
      profile?.first_name,
      profile?.last_name,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    const name =
      fullName ||
      profile?.username ||
      "User";

    const isOwner =
      userId ===
      comment.user_id;

    const isReplying =
      replyingTo ===
      comment.id;

    const isEditing =
      editingCommentId ===
      comment.id;

    const userReaction =
      getUserReaction(
        comment,
      );

    const selectedReaction =
      getReactionOption(
        userReaction?.reaction,
      );

    const totalReactions =
      comment
        .comment_reactions
        ?.length ?? 0;

    const pickerOpen =
      reactionPickerCommentId ===
      comment.id;

    const reactionWorking =
      workingReactionCommentId ===
      comment.id;

    return (
      <div
        key={comment.id}
        className={
          depth > 0
            ? "ml-4 border-l border-white/10 pl-4 md:ml-8 md:pl-6"
            : ""
        }
      >
        <article
          id={`comment-${comment.id}`}
          className="scroll-mt-28 rounded-xl border border-white/10 bg-black/10 p-5"
        >
          <div className="flex items-start gap-4">
            {/* ===========================================
                AVATAR
            =========================================== */}

            {profile?.avatar_url ? (
              <img
                src={
                  profile.avatar_url
                }
                alt=""
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-400/10 text-sm font-semibold text-green-300">
                {name
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1">
              {/* =========================================
                  HEADER
              ========================================= */}

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <div className="flex items-center gap-1.5">
  {profile?.username ? (
    <Link
      href={`/u/${profile.username}`}
      className="font-medium text-white transition hover:text-green-300"
    >
      {name}
    </Link>
  ) : (
    <p className="font-medium text-white">
      {name}
    </p>
  )}

  {profile?.verified && (
    <VerifiedBadge
      size={17}
    />
  )}
  <RoleBadge
    role={profile?.role}
    showUser={false}
  />
  {profile?.username && (
  <Link
    href={`/u/${profile.username}`}
    className="mt-0.5 block w-fit text-xs text-gray-500 transition hover:text-green-400"
  >
    @{profile.username}
  </Link>
)}
</div>

                <span className="text-xs text-gray-500">
                  {formatDate(
                    comment.created_at,
                  )}
                </span>

                {comment.edited && (
                  <span className="text-xs text-gray-600">
                    Edited
                  </span>
                )}
              </div>

              {/* =========================================
                  COMMENT OR EDITOR
              ========================================= */}

              {isEditing ? (
                <div className="mt-4">
                  <textarea
                    value={
                      editText
                    }
                    onChange={(
                      event,
                    ) =>
                      setEditText(
                        event.target
                          .value,
                      )
                    }
                    rows={4}
                    maxLength={2000}
                    disabled={
                      savingEdit
                    }
                    autoFocus
                    className="w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400 disabled:opacity-60"
                  />

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-gray-500">
                      {
                        editText.length
                      }
                      /2000
                    </span>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={
                          cancelEditing
                        }
                        disabled={
                          savingEdit
                        }
                        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:text-white disabled:opacity-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          void saveEditedComment(
                            comment.id,
                          );
                        }}
                        disabled={
                          savingEdit
                        }
                        className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-green-400 disabled:opacity-60"
                      >
                        {savingEdit
                          ? "Saving..."
                          : "Save"}
                      </button>
                    </div>
                  </div>

                  {editError && (
                    <p
                      role="alert"
                      className="mt-3 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
                    >
                      {editError}
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-3 whitespace-pre-wrap break-words leading-7 text-gray-300">
                  {comment.content}
                </p>
              )}

              {/* =========================================
                  REACTION SUMMARY
              ========================================= */}

              {totalReactions >
                0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <div className="flex -space-x-1">
                    {reactionOptions
                      .filter(
                        (
                          option,
                        ) =>
                          getReactionCount(
                            comment,
                            option.type,
                          ) > 0,
                      )
                      .slice(
                        0,
                        3,
                      )
                      .map(
                        (
                          option,
                        ) => (
                          <span
                            key={
                              option.type
                            }
                            title={
                              option.label
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#102A2A] bg-black/30 text-sm"
                          >
                            {
                              option.emoji
                            }
                          </span>
                        ),
                      )}
                  </div>

                  <span className="text-xs text-gray-500">
                    {
                      totalReactions
                    }{" "}
                    {totalReactions ===
                    1
                      ? "reaction"
                      : "reactions"}
                  </span>
                </div>
              )}

              {/* =========================================
                  ACTIONS
              ========================================= */}

              {!isEditing && (
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
                  {/* REPLY */}

                  {userId ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          isReplying
                        ) {
                          setReplyingTo(
                            null,
                          );

                          setReplyText(
                            "",
                          );

                          setReplyError(
                            "",
                          );
                        } else {
                          setReplyingTo(
                            comment.id,
                          );

                          setReplyText(
                            "",
                          );

                          setReplyError(
                            "",
                          );

                          setEditingCommentId(
                            null,
                          );
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition hover:text-green-300"
                    >
                      <Reply
                        size={15}
                      />
                      Reply
                    </button>
                  ) : (
                    <Link
                      href="/auth/sign-in"
                      className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-green-300"
                    >
                      <Reply
                        size={15}
                      />

                      Sign in to reply
                    </Link>
                  )}

                  {/* REACTION */}

                  {userId ? (
                    <div className="relative">
                      <button
                        type="button"
                        disabled={
                          reactionWorking
                        }
                        onClick={() =>
                          setReactionPickerCommentId(
                            pickerOpen
                              ? null
                              : comment.id,
                          )
                        }
                        className={`inline-flex items-center gap-1.5 text-sm font-medium transition disabled:opacity-50 ${
                          selectedReaction
                            ? "text-green-300"
                            : "text-gray-400 hover:text-green-300"
                        }`}
                      >
                        {selectedReaction ? (
                          <>
                            <span>
                              {
                                selectedReaction.emoji
                              }
                            </span>

                            {
                              selectedReaction.label
                            }
                          </>
                        ) : (
                          <>
                            👍 React
                          </>
                        )}

                        <ChevronDown
                          size={13}
                        />
                      </button>

                      {pickerOpen && (
                        <div className="absolute bottom-full left-0 z-30 mb-3 flex items-center gap-1 rounded-full border border-white/10 bg-[#102A2A] p-2 shadow-2xl">
                          {reactionOptions.map(
                            (
                              option,
                            ) => {
                              const active =
                                userReaction
                                  ?.reaction ===
                                option.type;

                              return (
                                <button
                                  key={
                                    option.type
                                  }
                                  type="button"
                                  title={
                                    option.label
                                  }
                                  disabled={
                                    reactionWorking
                                  }
                                  onClick={() => {
                                    void updateCommentReaction(
                                      comment,
                                      option.type,
                                    );
                                  }}
                                  className={`flex h-10 w-10 items-center justify-center rounded-full text-xl transition hover:-translate-y-1 hover:scale-125 ${
                                    active
                                      ? "bg-white/10"
                                      : "hover:bg-white/5"
                                  }`}
                                >
                                  {
                                    option.emoji
                                  }
                                </button>
                              );
                            },
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href="/auth/sign-in"
                      className="text-sm text-gray-500 transition hover:text-green-300"
                    >
                      👍 React
                    </Link>
                  )}

                  {/* EDIT */}

                  {isOwner && (
                    <button
                      type="button"
                      onClick={() =>
                        startEditing(
                          comment,
                        )
                      }
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition hover:text-green-300"
                    >
                      <Pencil
                        size={14}
                      />
                      Edit
                    </button>
                  )}

                  {/* DELETE */}

                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteTargetId(
                          comment.id,
                        );

                        setDeleteError(
                          "",
                        );
                      }}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition hover:text-red-300"
                    >
                      <Trash2
                        size={14}
                      />
                      Delete
                    </button>
                  )}
                </div>
              )}

              {/* Reaction error */}

              {reactionError &&
                workingReactionCommentId ===
                  null && (
                  <p
                    role="alert"
                    className="mt-3 text-sm text-red-300"
                  >
                    {
                      reactionError
                    }
                  </p>
                )}
            </div>
          </div>

          {/* ===========================================
              REPLY FORM
          =========================================== */}

          {isReplying &&
            userId &&
            !isEditing && (
              <form
                onSubmit={(
                  event,
                ) =>
                  void submitReply(
                    event,
                    comment.id,
                  )
                }
                className="mt-5 border-t border-white/10 pt-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="inline-flex items-center gap-2 text-sm font-medium text-green-300">
                    <CornerDownRight
                      size={15}
                    />

                    Replying to{" "}
                    {name}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo(
                        null,
                      );

                      setReplyText(
                        "",
                      );

                      setReplyError(
                        "",
                      );
                    }}
                    className="text-gray-500 transition hover:text-white"
                    aria-label="Cancel reply"
                  >
                    <X
                      size={17}
                    />
                  </button>
                </div>

                <textarea
                  value={
                    replyText
                  }
                  onChange={(
                    event,
                  ) =>
                    setReplyText(
                      event.target
                        .value,
                    )
                  }
                  rows={3}
                  maxLength={2000}
                  autoFocus
                  disabled={
                    submittingReply
                  }
                  placeholder={`Reply to ${name}...`}
                  className="mt-4 w-full resize-y rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-gray-500">
                    {
                      replyText.length
                    }
                    /2000
                  </span>

                  <button
                    type="submit"
                    disabled={
                      submittingReply
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send
                      size={15}
                    />

                    {submittingReply
                      ? "Replying..."
                      : "Post Reply"}
                  </button>
                </div>

                {replyError && (
                  <p
                    role="alert"
                    className="mt-3 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
                  >
                    {replyError}
                  </p>
                )}
              </form>
            )}
        </article>

        {/* =============================================
            NESTED REPLIES
        ============================================= */}

        {comment.replies.length >
          0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map(
              (reply) =>
                renderComment(
                  reply,
                  depth + 1,
                ),
            )}
          </div>
        )}
      </div>
    );
  };


  // ========================================================
  // SCROLL TO COMMENT FROM NOTIFICATION LINK
  // ========================================================

  useEffect(() => {
    if (
      loading ||
      comments.length ===
        0
    ) {
      return;
    }

    const hash =
      window.location.hash;

    if (
      !hash.startsWith(
        "#comment-",
      )
    ) {
      return;
    }

    const elementId =
      hash.slice(1);

    const timer =
      window.setTimeout(
        () => {
          const element =
            document.getElementById(
              elementId,
            );

          element?.scrollIntoView({
            behavior:
              "smooth",
            block:
              "center",
          });
        },
        100,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    loading,
    comments,
  ]);

  // ========================================================
  // PAGE
  // ========================================================

  return (
    <>
      <section className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-8">
        {/* =============================================
            HEADER
        ============================================= */}

        <div className="flex items-start gap-3">
          <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
            <MessageCircle
              size={22}
            />
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
              Discussion
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Comments
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {
                comments.filter(
                  (
                    comment,
                  ) =>
                    comment.status ===
                    "approved",
                ).length
              }{" "}
              {comments.filter(
                (
                  comment,
                ) =>
                  comment.status ===
                  "approved",
              ).length ===
              1
                ? "comment"
                : "comments"}
            </p>
          </div>
        </div>

        {/* =============================================
            MAIN COMMENT FORM
        ============================================= */}

        <div className="mt-8 border-b border-white/10 pb-8">
          {userId ? (
            <form
              onSubmit={
                submitComment
              }
              className="space-y-4"
            >
              <label className="block text-sm font-medium text-gray-300">
                Join the discussion

                <textarea
                  value={
                    commentText
                  }
                  onChange={(
                    event,
                  ) =>
                    setCommentText(
                      event.target
                        .value,
                    )
                  }
                  rows={5}
                  maxLength={2000}
                  placeholder="Write a thoughtful comment..."
                  disabled={
                    submitting
                  }
                  className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck
                    size={14}
                  />

                  <span>
                    Links and spam are automatically blocked.
                  </span>
                </div>

                <span className="text-xs text-gray-500">
                  {
                    commentText.length
                  }
                  /2000
                </span>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={
                    submitting
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send
                    size={17}
                  />

                  {submitting
                    ? "Posting..."
                    : "Post Comment"}
                </button>
              </div>
            </form>
          ) : (
            <div className="rounded-xl border border-white/10 bg-black/10 p-5">
              <p className="text-gray-400">
                Sign in to join the discussion.
              </p>

              <Link
                href="/auth/sign-in"
                className="mt-3 inline-flex font-medium text-green-400 transition hover:text-green-300"
              >
                Sign in
              </Link>
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}
        </div>

        {/* =============================================
            COMMENTS
        ============================================= */}

        <div className="mt-8">
          {loading ? (
            <p className="text-sm text-gray-500">
              Loading comments...
            </p>
          ) : commentTree.length ===
            0 ? (
            <div className="rounded-xl border border-white/10 bg-black/10 p-6 text-center">
              <MessageCircle
                size={28}
                className="mx-auto text-gray-600"
              />

              <p className="mt-4 text-gray-400">
                No comments yet.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Be the first to join the discussion.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {commentTree.map(
                (comment) =>
                  renderComment(
                    comment,
                  ),
              )}
            </div>
          )}
        </div>
      </section>

      {/* ==================================================
          CUSTOM DELETE CONFIRMATION MODAL
      ================================================== */}

      {deleteTargetId && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-comment-title"
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

              setDeleteError(
                "",
              );
            }
          }}
        >
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#102A2A] p-6 shadow-2xl md:p-8">
            {/* Close */}

            <button
              type="button"
              disabled={
                deleting
              }
              onClick={() => {
                setDeleteTargetId(
                  null,
                );

                setDeleteError(
                  "",
                );
              }}
              className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Warning */}

            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
              <TriangleAlert
                size={24}
              />
            </div>

            <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-red-300">
              Confirm Delete
            </p>

            <h2
              id="delete-comment-title"
              className="mt-3 pr-8 text-2xl font-bold text-white"
            >
              Delete this comment?
            </h2>

            <p className="mt-4 leading-7 text-gray-400">
              This comment will be permanently removed.
              If it has replies, those replies may also be
              removed depending on the discussion structure.
            </p>

            {deleteTarget && (
              <div className="mt-6 rounded-xl border border-white/10 bg-black/10 p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Comment
                </p>

                <p className="mt-2 line-clamp-4 text-sm leading-6 text-gray-300">
                  {
                    deleteTarget.content
                  }
                </p>
              </div>
            )}

            {deleteError && (
              <p
                role="alert"
                className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
              >
                {deleteError}
              </p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={
                  deleting
                }
                onClick={() => {
                  setDeleteTargetId(
                    null,
                  );

                  setDeleteError(
                    "",
                  );
                }}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition hover:border-white/20 hover:text-white disabled:opacity-50"
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
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
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