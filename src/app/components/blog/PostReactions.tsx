"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ChevronDown,
  Heart,
} from "lucide-react";

import { createClient } from "../../lib/supabase/client";

type ReactionType =
  | "like"
  | "love"
  | "haha"
  | "wow"
  | "sad"
  | "angry";

interface ReactionProfile {
  display_name: string | null;
}

interface ReactionRow {
  id: string;
  reaction: ReactionType;
  user_id: string;
  profile:
    | ReactionProfile
    | ReactionProfile[]
    | null;
}

interface PostReactionsProps {
  postId: string;
}

interface ReactionOption {
  type: ReactionType;
  label: string;
  emoji: string;
}

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

export default function PostReactions({
  postId,
}: PostReactionsProps) {
  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const [userId, setUserId] =
    useState<string | null>(null);

  const [reactions, setReactions] =
    useState<ReactionRow[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [working, setWorking] =
    useState(false);

  const [pickerOpen, setPickerOpen] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadReactions = async () => {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      setUserId(
        user?.id ?? null,
      );

      const {
        data,
        error,
      } = await supabase
        .from("reactions")
        .select(`
          id,
          reaction,
          user_id,
          profile:profiles (
            display_name
          )
        `)
        .eq(
          "post_id",
          postId,
        );

      if (error) {
        setError(
          "Reactions could not be loaded.",
        );
      } else {
        setReactions(
          (data ?? []) as ReactionRow[],
        );
      }

      setLoading(false);
    };

    void loadReactions();
  }, [
    postId,
    supabase,
  ]);

  const getProfileName = (
    reaction: ReactionRow,
  ) => {
    const profile =
      Array.isArray(
        reaction.profile,
      )
        ? reaction.profile[0]
        : reaction.profile;

    return (
      profile?.display_name ??
      "Someone"
    );
  };

  const selectedReaction =
    userId
      ? reactions.find(
          (reaction) =>
            reaction.user_id ===
            userId,
        )
      : undefined;

  const selectedOption =
    selectedReaction
      ? reactionOptions.find(
          (option) =>
            option.type ===
            selectedReaction.reaction,
        )
      : undefined;

  const totalCount =
    reactions.length;

  const getCount = (
    type: ReactionType,
  ) => {
    return reactions.filter(
      (reaction) =>
        reaction.reaction === type,
    ).length;
  };

  const buildReactionSummary = () => {
    if (totalCount === 0) {
      return "";
    }

    const currentUserReaction =
      userId
        ? reactions.find(
            (reaction) =>
              reaction.user_id ===
              userId,
          )
        : undefined;

    const otherReactions =
      reactions.filter(
        (reaction) =>
          reaction.user_id !==
          userId,
      );

    const getReactionVerb = (
      reaction: ReactionRow,
    ) => {
      switch (
        reaction.reaction
      ) {
        case "like":
          return "liked this";

        case "love":
          return "loved this";

        case "haha":
          return "reacted with Haha";

        case "wow":
          return "reacted with Wow";

        case "sad":
          return "reacted with Sad";

        case "angry":
          return "reacted with Angry";

        default:
          return "reacted to this";
      }
    };

    /*
     * ONE REACTION
     */
    if (totalCount === 1) {
      const onlyReaction =
        reactions[0];

      if (
        onlyReaction.user_id ===
        userId
      ) {
        return `You ${getReactionVerb(
          onlyReaction,
        )}.`;
      }

      return `${getProfileName(
        onlyReaction,
      )} ${getReactionVerb(
        onlyReaction,
      )}.`;
    }

    /*
     * TWO REACTIONS
     */
    if (totalCount === 2) {
      if (
        currentUserReaction &&
        otherReactions.length ===
          1
      ) {
        return `You and ${getProfileName(
          otherReactions[0],
        )} reacted to this post.`;
      }

      return `${getProfileName(
        reactions[0],
      )} and ${getProfileName(
        reactions[1],
      )} reacted to this post.`;
    }

    /*
     * THREE OR MORE
     */
    if (
      currentUserReaction
    ) {
      return `You and ${
        totalCount - 1
      } ${
        totalCount - 1 === 1
          ? "other"
          : "others"
      } reacted to this post.`;
    }

    const firstName =
      getProfileName(
        reactions[0],
      );

    const others =
      totalCount - 1;

    return `${firstName} and ${others} ${
      others === 1
        ? "other"
        : "others"
    } reacted to this post.`;
  };

  const updateReaction = async (
    type: ReactionType,
  ) => {
    if (!userId) {
      return;
    }

    setWorking(true);
    setError("");

    try {
      const existing =
        reactions.find(
          (reaction) =>
            reaction.user_id ===
            userId,
        );

      /*
       * Same reaction clicked:
       * remove reaction.
       */
      if (
        existing &&
        existing.reaction === type
      ) {
        const { error } =
          await supabase
            .from("reactions")
            .delete()
            .eq(
              "id",
              existing.id,
            );

        if (error) {
          throw error;
        }

        setReactions(
          (current) =>
            current.filter(
              (reaction) =>
                reaction.id !==
                existing.id,
            ),
        );

        setPickerOpen(false);
        return;
      }

      /*
       * Existing reaction:
       * update it.
       */
      if (existing) {
        const {
          data,
          error,
        } = await supabase
          .from("reactions")
          .update({
            reaction: type,
          })
          .eq(
            "id",
            existing.id,
          )
          .select(`
            id,
            reaction,
            user_id,
            profile:profiles (
              display_name
            )
          `)
          .single();

        if (error) {
          throw error;
        }

        setReactions(
          (current) =>
            current.map(
              (reaction) =>
                reaction.id ===
                existing.id
                  ? (data as ReactionRow)
                  : reaction,
            ),
        );

        setPickerOpen(false);
        return;
      }

      /*
       * New reaction.
       */
      const {
        data,
        error,
      } = await supabase
        .from("reactions")
        .insert({
          post_id: postId,
          user_id: userId,
          reaction: type,
        })
        .select(`
          id,
          reaction,
          user_id,
          profile:profiles (
            display_name
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      setReactions(
        (current) => [
          ...current,
          data as ReactionRow,
        ],
      );

      setPickerOpen(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Your reaction could not be updated.",
      );
    } finally {
      setWorking(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
        <p className="text-sm text-gray-500">
          Loading reactions...
        </p>
      </div>
    );
  }

  const reactionSummary =
    buildReactionSummary();

  return (
    <section className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
            Reactions
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            What did you think?
          </h2>
        </div>

        {!userId && (
          <Link
            href="/auth/sign-in"
            className="text-sm font-medium text-green-400 transition hover:text-green-300"
          >
            Sign in to react
          </Link>
        )}
      </div>

      {/* Facebook-style summary */}
      {totalCount > 0 && (
        <div className="mt-6 flex items-center gap-3">
          <div className="flex -space-x-1">
            {reactionOptions
              .filter(
                (option) =>
                  getCount(
                    option.type,
                  ) > 0,
              )
              .slice(0, 3)
              .map(
                (option) => (
                  <span
                    key={
                      option.type
                    }
                    title={
                      option.label
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#102A2A] bg-black/30 text-lg"
                  >
                    {
                      option.emoji
                    }
                  </span>
                ),
              )}
          </div>

          <p className="text-sm text-gray-400">
            {reactionSummary}
          </p>
        </div>
      )}

      {/* Main reaction button */}
      <div className="relative mt-6">
        {userId ? (
          <div className="inline-flex">
            <button
              type="button"
              disabled={working}
              onClick={() => {
                if (
                  selectedReaction
                ) {
                  void updateReaction(
                    selectedReaction.reaction,
                  );
                } else {
                  void updateReaction(
                    "like",
                  );
                }
              }}
              className={`inline-flex items-center gap-2 rounded-l-xl border px-5 py-3 font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                selectedOption
                  ? "border-green-400/30 bg-green-400/10 text-green-300"
                  : "border-white/10 bg-black/10 text-gray-300 hover:border-green-400/30 hover:text-white"
              }`}
            >
              {selectedOption ? (
                <>
                  <span className="text-xl">
                    {
                      selectedOption.emoji
                    }
                  </span>

                  {
                    selectedOption.label
                  }
                </>
              ) : (
                <>
                  <Heart
                    size={18}
                  />
                  Like
                </>
              )}
            </button>

            <button
              type="button"
              disabled={working}
              onClick={() =>
                setPickerOpen(
                  (current) =>
                    !current,
                )
              }
              className="inline-flex items-center justify-center rounded-r-xl border border-l-0 border-white/10 bg-black/10 px-3 text-gray-400 transition hover:border-green-400/30 hover:text-white disabled:opacity-50"
              aria-label="Choose reaction"
            >
              <ChevronDown
                size={17}
              />
            </button>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-5 py-3 text-gray-500">
            <Heart
              size={18}
            />
            Like
          </div>
        )}

        {/* Picker */}
        {pickerOpen &&
          userId && (
            <div className="absolute bottom-full left-0 z-20 mb-3 flex items-end gap-1 rounded-full border border-white/10 bg-[#102A2A] p-2 shadow-2xl">
              {reactionOptions.map(
                (option) => {
                  const active =
                    selectedReaction
                      ?.reaction ===
                    option.type;

                  return (
                    <button
                      key={
                        option.type
                      }
                      type="button"
                      disabled={
                        working
                      }
                      onClick={() => {
                        void updateReaction(
                          option.type,
                        );
                      }}
                      title={
                        option.label
                      }
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl transition hover:-translate-y-2 hover:scale-125 ${
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

      {/* Reaction breakdown */}
      {totalCount > 0 && (
        <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">
          {reactionOptions.map(
            (option) => {
              const count =
                getCount(
                  option.type,
                );

              if (
                count === 0
              ) {
                return null;
              }

              return (
                <div
                  key={
                    option.type
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/10 px-3 py-1.5 text-sm text-gray-400"
                >
                  <span>
                    {
                      option.emoji
                    }
                  </span>

                  <span>
                    {
                      option.label
                    }
                  </span>

                  <span className="text-gray-500">
                    {count}
                  </span>
                </div>
              );
            },
          )}
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}
    </section>
  );
}