import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Heart,
  MessageCircle,
  Reply,
} from "lucide-react";
import { redirect } from "next/navigation";
import { requireAccountNotBlocked } from "../../lib/accountRestriction";
import Container from "../../components/Container";
import { createClient } from "../../lib/supabase/server";

function formatDate(
  value: string,
) {
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
}

function getReactionEmoji(
  reaction: string,
) {
  switch (reaction) {
    case "like":
      return "👍";

    case "love":
      return "❤️";

    case "haha":
      return "😂";

    case "wow":
      return "😮";

    case "sad":
      return "😢";

    case "angry":
      return "😡";

    default:
      return "👍";
  }
}

export default async function AccountActivityPage() {
    await requireAccountNotBlocked();
    
  const supabase =
    await createClient();

  // --------------------------------------------------
  // AUTH
  // --------------------------------------------------

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/auth/sign-in",
    );
  }

  // --------------------------------------------------
  // MY COMMENTS
  // --------------------------------------------------

  const {
    data: comments,
    error: commentsError,
  } = await supabase
    .from("comments")
    .select(`
      id,
      content,
      parent_id,
      created_at,
      edited,
      post:posts (
        id,
        title,
        slug
      )
    `)
    .eq(
      "user_id",
      user.id,
    )
    .order(
      "created_at",
      {
        ascending: false,
      },
    );

  // --------------------------------------------------
  // MY POST REACTIONS
  // --------------------------------------------------

  const {
    data: reactions,
    error: reactionsError,
  } = await supabase
    .from("reactions")
    .select(`
      id,
      reaction,
      created_at,
      post:posts (
        id,
        title,
        slug
      )
    `)
    .eq(
      "user_id",
      user.id,
    )
    .order(
      "created_at",
      {
        ascending: false,
      },
    );

  // --------------------------------------------------
  // RELATIONSHIP HELPERS
  // --------------------------------------------------

  const getPost = (
    post:
      | {
          id: string;
          title: string;
          slug: string;
        }
      | {
          id: string;
          title: string;
          slug: string;
        }[]
      | null,
  ) => {
    return Array.isArray(post)
      ? post[0]
      : post;
  };

  const totalComments =
    comments?.length ?? 0;

  const totalReactions =
    reactions?.length ?? 0;

  const totalActivity =
    totalComments +
    totalReactions;

  return (
    <main>
      {/* =================================================
          HEADER
      ================================================= */}

      <section className="px-6 pb-12 pt-16 md:pt-24">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-green-400"
          >
            <ArrowLeft
              size={16}
            />

            Back to Account
          </Link>

          <div className="mt-8 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
            <MessageCircle
              size={23}
            />
          </div>

          <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Account Activity
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
            My Activity
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-gray-400">
            Review your comments, replies, and reactions across the blog.
          </p>
        </div>
      </section>

      {/* =================================================
          STATS
      ================================================= */}

      <section className="border-t border-white/5 py-10">
        <Container>
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
            {/* Total */}

            <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
              <p className="text-sm text-gray-500">
                Total activity
              </p>

              <p className="mt-2 text-3xl font-semibold text-white">
                {totalActivity}
              </p>
            </div>

            {/* Comments */}

            <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
              <div className="flex items-center gap-2 text-green-300">
                <MessageCircle
                  size={18}
                />

                <span className="text-sm font-medium">
                  Comments & Replies
                </span>
              </div>

              <p className="mt-3 text-3xl font-semibold text-white">
                {totalComments}
              </p>
            </div>

            {/* Reactions */}

            <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
              <div className="flex items-center gap-2 text-pink-300">
                <Heart
                  size={18}
                />

                <span className="text-sm font-medium">
                  Reactions
                </span>
              </div>

              <p className="mt-3 text-3xl font-semibold text-white">
                {totalReactions}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* =================================================
          COMMENTS
      ================================================= */}

      <section className="border-t border-white/5 py-16">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
                Discussion
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                My Comments & Replies
              </h2>
            </div>

            {commentsError ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-300">
                Your comments could not be loaded.
              </div>
            ) : !comments ||
              comments.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-10 text-center">
                <MessageCircle
                  size={30}
                  className="mx-auto text-gray-600"
                />

                <h3 className="mt-5 text-xl font-semibold text-white">
                  No comments yet
                </h3>

                <p className="mt-3 text-gray-400">
                  Join a blog discussion and your comments will appear here.
                </p>

                <Link
                  href="/blog"
                  className="mt-6 inline-flex font-medium text-green-400 transition hover:text-green-300"
                >
                  Browse Articles
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map(
                  (comment) => {
                    const post =
                      getPost(
                        comment.post,
                      );

                    return (
                      <article
                        key={
                          comment.id
                        }
                        className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5 md:p-6"
                      >
                        {/* Type */}

                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-gray-400">
                            {comment.parent_id ? (
                              <>
                                <Reply
                                  size={13}
                                />

                                Reply
                              </>
                            ) : (
                              <>
                                <MessageCircle
                                  size={13}
                                />

                                Comment
                              </>
                            )}
                          </span>

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

                        {/* Content */}

                        <p className="mt-5 whitespace-pre-wrap break-words leading-7 text-gray-300">
                          {
                            comment.content
                          }
                        </p>

                        {/* Article */}

                        {post && (
                          <div className="mt-6 border-t border-white/10 pt-5">
                            <p className="text-xs uppercase tracking-wider text-gray-600">
                              Article
                            </p>

                            <Link
                              href={`/blog/${post.slug}`}
                              className="mt-2 inline-flex items-center gap-2 font-medium text-green-400 transition hover:text-green-300"
                            >
                              {post.title}

                              <ExternalLink
                                size={14}
                              />
                            </Link>
                          </div>
                        )}
                      </article>
                    );
                  },
                )}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* =================================================
          REACTIONS
      ================================================= */}

      <section className="border-t border-white/5 py-16">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
                Engagement
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                My Reactions
              </h2>
            </div>

            {reactionsError ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-300">
                Your reactions could not be loaded.
              </div>
            ) : !reactions ||
              reactions.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-10 text-center">
                <Heart
                  size={30}
                  className="mx-auto text-gray-600"
                />

                <h3 className="mt-5 text-xl font-semibold text-white">
                  No reactions yet
                </h3>

                <p className="mt-3 text-gray-400">
                  React to an article and it will appear here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {reactions.map(
                  (reaction) => {
                    const post =
                      getPost(
                        reaction.post,
                      );

                    if (!post) {
                      return null;
                    }

                    return (
                      <article
                        key={
                          reaction.id
                        }
                        className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black/20 text-2xl">
                            {getReactionEmoji(
                              reaction.reaction,
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs text-gray-500">
                              You reacted{" "}
                              <span className="capitalize text-gray-300">
                                {
                                  reaction.reaction
                                }
                              </span>
                            </p>

                            <Link
                              href={`/blog/${post.slug}`}
                              className="mt-2 block font-medium leading-6 text-white transition hover:text-green-300"
                            >
                              {
                                post.title
                              }
                            </Link>

                            <p className="mt-2 text-xs text-gray-600">
                              {formatDate(
                                reaction.created_at,
                              )}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}