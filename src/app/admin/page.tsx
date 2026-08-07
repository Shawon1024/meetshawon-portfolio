import Link from "next/link";
import {
  BadgeCheck,
  Eye,
  FileText,
  MessageSquareText,
  Plus,
  ShieldCheck,
  ThumbsUp,
  TrendingUp,
  Users,
} from "lucide-react";
import { redirect } from "next/navigation";

import Container from "../components/Container";
import VerifiedBadge from "../components/ui/VerifiedBadge";
import { createClient } from "../lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  // --------------------------------------------------
  // AUTH
  // --------------------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  // --------------------------------------------------
  // ADMIN CHECK
  // --------------------------------------------------

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select(`
      display_name,
      role,
      verified
    `)
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    profile?.role !== "admin"
  ) {
    redirect("/account");
  }

  // --------------------------------------------------
  // DASHBOARD COUNTS + VIEWS
  // --------------------------------------------------

  const [
    totalPostsResult,
    publishedPostsResult,
    draftPostsResult,
    commentsResult,
    reactionsResult,
    usersResult,
    verifiedUsersResult,
    viewsResult,
  ] = await Promise.all([
    // Total posts
    supabase
      .from("posts")
      .select("id", {
        count: "exact",
        head: true,
      }),

    // Published posts
    supabase
      .from("posts")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("status", "published"),

    // Draft posts
    supabase
      .from("posts")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("status", "draft"),

    // Comments
    supabase
      .from("comments")
      .select("id", {
        count: "exact",
        head: true,
      }),

    // Post reactions
    supabase
      .from("reactions")
      .select("id", {
        count: "exact",
        head: true,
      }),

    // Users
    supabase
      .from("profiles")
      .select("id", {
        count: "exact",
        head: true,
      }),

    // Verified users
    supabase
      .from("profiles")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("verified", true),

    // Article views
    supabase
      .from("posts")
      .select("view_count")
      .eq("status", "published"),
  ]);

  // --------------------------------------------------
  // STAT VALUES
  // --------------------------------------------------

  const totalPosts =
    totalPostsResult.count ?? 0;

  const publishedPosts =
    publishedPostsResult.count ?? 0;

  const draftPosts =
    draftPostsResult.count ?? 0;

  const totalComments =
    commentsResult.count ?? 0;

  const totalReactions =
    reactionsResult.count ?? 0;

  const totalUsers =
    usersResult.count ?? 0;

  const verifiedUsers =
    verifiedUsersResult.count ?? 0;

  const totalViews =
    viewsResult.data?.reduce(
      (sum, post) =>
        sum +
        Number(
          post.view_count ?? 0,
        ),
      0,
    ) ?? 0;

  // --------------------------------------------------
  // RECENT POSTS
  // --------------------------------------------------

  const {
    data: recentPosts,
    error: recentPostsError,
  } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      slug,
      status,
      published_at
    `)
    .order("created_at", {
      ascending: false,
    })
    .limit(5);

  if (recentPostsError) {
    console.error(
      "Recent posts could not be loaded:",
      recentPostsError,
    );
  }

  // --------------------------------------------------
  // RECENT COMMENTS
  // --------------------------------------------------

  const {
    data: recentComments,
    error: recentCommentsError,
  } = await supabase
    .from("comments")
    .select(`
      id,
      content,
      created_at,
      profile:profiles (
        display_name,
        verified
      ),
      post:posts (
        title,
        slug
      )
    `)
    .order("created_at", {
      ascending: false,
    })
    .limit(5);

  if (recentCommentsError) {
    console.error(
      "Recent comments could not be loaded:",
      recentCommentsError,
    );
  }

  // --------------------------------------------------
  // TOP PERFORMING POSTS
  // --------------------------------------------------

  const {
    data: topPosts,
    error: topPostsError,
  } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      slug,
      view_count
    `)
    .eq("status", "published")
    .lte(
      "published_at",
      new Date().toISOString(),
    )
    .order("view_count", {
      ascending: false,
    })
    .order("published_at", {
      ascending: false,
    })
    .limit(5);

  if (topPostsError) {
    console.error(
      "Top posts could not be loaded:",
      topPostsError,
    );
  }

  // --------------------------------------------------
  // RELATIONSHIP HELPERS
  // --------------------------------------------------

  const getProfile = (
    profile:
      | {
          display_name: string | null;
          verified: boolean;
        }
      | {
          display_name: string | null;
          verified: boolean;
        }[]
      | null,
  ) => {
    return Array.isArray(profile)
      ? profile[0]
      : profile;
  };

  const getPost = (
    post:
      | {
          title: string;
          slug: string;
        }
      | {
          title: string;
          slug: string;
        }[]
      | null,
  ) => {
    return Array.isArray(post)
      ? post[0]
      : post;
  };

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main>
      {/* =================================================
          HEADER
      ================================================= */}

      <section className="px-6 pb-12 pt-16 md:pt-24">
        <div className="mx-auto max-w-6xl">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
            <ShieldCheck size={24} />
          </div>

          <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Administration
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <h1 className="text-4xl font-bold text-white md:text-5xl">
              Admin Dashboard
            </h1>

            {profile?.verified && (
              <VerifiedBadge
                size={22}
              />
            )}
          </div>

          <p className="mt-4 max-w-2xl leading-7 text-gray-400">
            Welcome back
            {profile?.display_name
              ? `, ${profile.display_name}`
              : ""}
            . Manage your blog, users, comments, reactions, analytics, and
            publishing activity from one place.
          </p>
        </div>
      </section>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <section className="border-t border-white/5 py-12">
        <Container>
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Posts */}

            <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                <FileText size={21} />
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Total posts
              </p>

              <p className="mt-1 text-3xl font-semibold text-white">
                {totalPosts}
              </p>
            </div>

            {/* Published */}

            <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
                <FileText size={21} />
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Published
              </p>

              <p className="mt-1 text-3xl font-semibold text-white">
                {publishedPosts}
              </p>
            </div>

            {/* Drafts */}

            <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                <FileText size={21} />
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Drafts
              </p>

              <p className="mt-1 text-3xl font-semibold text-white">
                {draftPosts}
              </p>
            </div>

            {/* Views */}

            <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <Eye size={21} />
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Total views
              </p>

              <p className="mt-1 text-3xl font-semibold text-white">
                {totalViews.toLocaleString(
                  "en-GB",
                )}
              </p>
            </div>

            {/* Comments */}

            <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-purple-400/10 text-purple-300">
                <MessageSquareText
                  size={21}
                />
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Comments
              </p>

              <p className="mt-1 text-3xl font-semibold text-white">
                {totalComments}
              </p>
            </div>

            {/* Reactions */}

            <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-pink-400/10 text-pink-300">
                <ThumbsUp
                  size={21}
                />
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Post reactions
              </p>

              <p className="mt-1 text-3xl font-semibold text-white">
                {totalReactions}
              </p>
            </div>

            {/* Users */}

            <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <Users
                  size={21}
                />
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Users
              </p>

              <p className="mt-1 text-3xl font-semibold text-white">
                {totalUsers}
              </p>
            </div>

            {/* Verified Users */}

            <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
                <BadgeCheck
                  size={21}
                />
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Verified users
              </p>

              <p className="mt-1 text-3xl font-semibold text-white">
                {verifiedUsers}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* =================================================
          ADMIN TOOLS
      ================================================= */}

      <section className="border-t border-white/5 py-16">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
                Management
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                Admin Tools
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Manage Posts */}

              <Link
                href="/admin/posts"
                className="group rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6 transition hover:-translate-y-1 hover:border-green-400/40"
              >
                <FileText
                  size={22}
                  className="text-green-300"
                />

                <h3 className="mt-5 text-xl font-semibold text-white transition group-hover:text-green-300">
                  Manage Posts
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  Edit, publish, archive, and manage all blog articles.
                </p>
              </Link>

              {/* Create Post */}

              <Link
                href="/admin/posts/new"
                className="group rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6 transition hover:-translate-y-1 hover:border-green-400/40"
              >
                <Plus
                  size={22}
                  className="text-green-300"
                />

                <h3 className="mt-5 text-xl font-semibold text-white transition group-hover:text-green-300">
                  Create New Post
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  Publish a new Markdown article with categories, tags, and a
                  cover image.
                </p>
              </Link>

              {/* Comments */}

              <Link
                href="/admin/comments"
                className="group rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6 transition hover:-translate-y-1 hover:border-green-400/40"
              >
                <MessageSquareText
                  size={22}
                  className="text-blue-300"
                />

                <h3 className="mt-5 text-xl font-semibold text-white transition group-hover:text-green-300">
                  Manage Comments
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  Search discussions, review replies, and remove unwanted
                  comments.
                </p>
              </Link>

              {/* Users */}

              <Link
                href="/admin/users"
                className="group rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6 transition hover:-translate-y-1 hover:border-green-400/40"
              >
                <Users
                  size={22}
                  className="text-amber-300"
                />

                <h3 className="mt-5 text-xl font-semibold text-white transition group-hover:text-green-300">
                  Manage Users
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  Search community accounts and manage verified badges.
                </p>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* =================================================
          RECENT ACTIVITY
      ================================================= */}

      <section className="border-t border-white/5 py-16">
        <Container>
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
            {/* Recent Posts */}

            <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
                    Publishing
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Recent Posts
                  </h2>
                </div>

                <Link
                  href="/admin/posts"
                  className="text-sm font-medium text-green-400 transition hover:text-green-300"
                >
                  View all
                </Link>
              </div>

              <div className="mt-6 space-y-3">
                {!recentPosts ||
                recentPosts.length ===
                  0 ? (
                  <p className="text-sm text-gray-500">
                    No posts yet.
                  </p>
                ) : (
                  recentPosts.map(
                    (post) => (
                      <div
                        key={
                          post.id
                        }
                        className="rounded-xl border border-white/10 bg-black/10 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-white">
                              {
                                post.title
                              }
                            </p>

                            <p className="mt-2 text-xs text-gray-500">
                              /blog/
                              {
                                post.slug
                              }
                            </p>
                          </div>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                              post.status ===
                              "published"
                                ? "border-green-400/20 bg-green-400/10 text-green-300"
                                : "border-amber-400/20 bg-amber-400/10 text-amber-300"
                            }`}
                          >
                            {
                              post.status
                            }
                          </span>
                        </div>
                      </div>
                    ),
                  )
                )}
              </div>
            </div>

            {/* Recent Comments */}

            <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
                    Community
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Recent Comments
                  </h2>
                </div>

                <Link
                  href="/admin/comments"
                  className="text-sm font-medium text-green-400 transition hover:text-green-300"
                >
                  View all
                </Link>
              </div>

              <div className="mt-6 space-y-3">
                {!recentComments ||
                recentComments.length ===
                  0 ? (
                  <p className="text-sm text-gray-500">
                    No comments yet.
                  </p>
                ) : (
                  recentComments.map(
                    (comment) => {
                      const commentProfile =
                        getProfile(
                          comment.profile,
                        );

                      const commentPost =
                        getPost(
                          comment.post,
                        );

                      return (
                        <div
                          key={
                            comment.id
                          }
                          className="rounded-xl border border-white/10 bg-black/10 p-4"
                        >
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="text-sm font-medium text-white">
                              {commentProfile
                                ?.display_name ??
                                "User"}
                            </p>

                            {commentProfile
                              ?.verified && (
                              <VerifiedBadge
                                size={
                                  15
                                }
                              />
                            )}
                          </div>

                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-300">
                            {
                              comment.content
                            }
                          </p>

                          {commentPost && (
                            <Link
                              href={`/blog/${commentPost.slug}`}
                              className="mt-3 inline-flex text-xs font-medium text-green-400 transition hover:text-green-300"
                            >
                              On:{" "}
                              {
                                commentPost.title
                              }
                            </Link>
                          )}
                        </div>
                      );
                    },
                  )
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =================================================
          TOP PERFORMING POSTS
      ================================================= */}

      <section className="border-t border-white/5 py-16">
        <Container>
          <div className="mx-auto max-w-6xl">
            {/* Header */}

            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
                  Analytics
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white">
                  Top Performing Posts
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-gray-400">
                  Your most-read published articles based on recorded views.
                </p>
              </div>

              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                <TrendingUp
                  size={24}
                />
              </div>
            </div>

            {/* Posts */}

            {!topPosts ||
            topPosts.length ===
              0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/10 p-8 text-center">
                <Eye
                  size={28}
                  className="mx-auto text-gray-600"
                />

                <p className="mt-4 text-gray-500">
                  No view data yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {topPosts.map(
                  (
                    post,
                    index,
                  ) => {
                    const views =
                      Number(
                        post.view_count ??
                          0,
                      );

                    return (
                      <div
                        key={
                          post.id
                        }
                        className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-start gap-4">
                          {/* Rank */}

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-400/10 font-semibold text-green-300">
                            {index +
                              1}
                          </div>

                          {/* Post */}

                          <div>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="font-medium text-white transition hover:text-green-300"
                            >
                              {
                                post.title
                              }
                            </Link>

                            <p className="mt-2 text-xs text-gray-500">
                              /blog/
                              {
                                post.slug
                              }
                            </p>
                          </div>
                        </div>

                        {/* Views */}

                        <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                          <Eye
                            size={
                              16
                            }
                          />

                          {views.toLocaleString(
                            "en-GB",
                          )}{" "}
                          {views ===
                          1
                            ? "view"
                            : "views"}
                        </div>
                      </div>
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