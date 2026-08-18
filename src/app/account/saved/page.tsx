import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CalendarDays,
  Eye,
} from "lucide-react";
import { redirect } from "next/navigation";
import { requireAccountNotBlocked } from "../../lib/accountRestriction";
import Container from "../../components/Container";
import { createClient } from "../../lib/supabase/server";

function formatDate(
  date: string | null,
) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(
    new Date(date),
  );
}

export default async function SavedArticlesPage() {
    await requireAccountNotBlocked();

  const supabase =
    await createClient();

  // --------------------------------------------------
  // AUTH
  // --------------------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/auth/sign-in?next=/account/saved",
    );
  }

  // --------------------------------------------------
  // LOAD BOOKMARKS
  // --------------------------------------------------

  const {
    data: bookmarks,
    error,
  } = await supabase
    .from("bookmarks")
    .select(`
      id,
      created_at,
      post:posts (
        id,
        title,
        slug,
        excerpt,
        published_at,
        cover_image_url,
        cover_image_alt,
        view_count,
        status
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
  // ONLY SHOW CURRENTLY PUBLISHED POSTS
  // --------------------------------------------------

  const publishedBookmarks =
    bookmarks?.filter(
      (bookmark) => {
        const post =
          Array.isArray(
            bookmark.post,
          )
            ? bookmark.post[0]
            : bookmark.post;

        if (!post) {
          return false;
        }

        if (
          post.status !==
          "published"
        ) {
          return false;
        }

        if (
        !post.published_at
      ) {
        return false;
      }

        if (
          post.published_at &&
          new Date(
            post.published_at,
          ) > new Date()
        ) {
          return false;
        }

        return true;
      },
    ) ?? [];

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
            <Bookmark
              size={23}
            />
          </div>

          <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Your Library
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
            Saved Articles
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-gray-400">
            Articles you have bookmarked so you can easily return to them later.
          </p>
        </div>
      </section>

      {/* =================================================
          SAVED COUNT
      ================================================= */}

      <section className="border-t border-white/5 py-10">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-[var(--surface)]/70 px-5 py-4">
              <Bookmark
                size={18}
                className="text-green-300"
              />

              <span className="text-sm text-gray-400">
                Saved articles
              </span>

              <span className="text-lg font-semibold text-white">
                {
                  publishedBookmarks.length
                }
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* =================================================
          ARTICLES
      ================================================= */}

      <section className="border-t border-white/5 py-16">
        <Container>
          <div className="mx-auto max-w-6xl">
            {error ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-300">
                <p className="font-medium">
                  Saved articles could not be loaded.
                </p>

                <p className="mt-2 text-sm">
                  {error.message}
                </p>
              </div>
            ) : publishedBookmarks.length ===
              0 ? (
              <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-10 text-center md:p-14">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-400/10 text-green-300">
                  <Bookmark
                    size={27}
                  />
                </div>

                <h2 className="mt-6 text-2xl font-semibold text-white">
                  Nothing saved yet
                </h2>

                <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-400">
                  When you save an article, it will appear here so you can
                  quickly return to it later.
                </p>

                <Link
                  href="/blog"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-medium text-black transition hover:bg-green-400"
                >
                  Browse Articles

                  <ArrowRight
                    size={16}
                  />
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {publishedBookmarks.map(
                  (bookmark) => {
                    const post =
                      Array.isArray(
                        bookmark.post,
                      )
                        ? bookmark.post[0]
                        : bookmark.post;

                    if (!post) {
                      return null;
                    }

                    const views =
                      Number(
                        post.view_count ??
                          0,
                      );

                    return (
                      <article
                        key={
                          bookmark.id
                        }
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface)]/70 transition hover:-translate-y-1 hover:border-green-400/40"
                      >
                        {/* Cover */}

                        {post.cover_image_url ? (
                          <Link
                            href={`/blog/${post.slug}`}
                            className="block overflow-hidden"
                          >
                            <Image
                              src={
                                post.cover_image_url
                              }
                              alt={
                                post.cover_image_alt ??
                                post.title
                              }
                              width={1200}
                              height={675}
                              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                              className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                            />
                          </Link>
                        ) : (
                          <div className="flex aspect-[16/9] items-center justify-center border-b border-white/5 bg-black/10">
                            <Bookmark
                              size={28}
                              className="text-gray-700"
                            />
                          </div>
                        )}

                        <div className="flex flex-1 flex-col p-5">
                          {/* Meta */}

                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                            {post.published_at && (
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarDays
                                  size={14}
                                />

                                {formatDate(
                                  post.published_at,
                                )}
                              </span>
                            )}

                            <span className="inline-flex items-center gap-1.5">
                              <Eye
                                size={14}
                              />

                              {views.toLocaleString(
                                "en-GB",
                              )}

                              {views === 1
                                ? " view"
                                : " views"}
                            </span>
                          </div>

                          {/* Title */}

                          <h2 className="mt-4 text-xl font-semibold leading-7 text-white transition group-hover:text-green-300">
                            <Link
                              href={`/blog/${post.slug}`}
                            >
                              {
                                post.title
                              }
                            </Link>
                          </h2>

                          {/* Excerpt */}

                          {post.excerpt && (
                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400">
                              {
                                post.excerpt
                              }
                            </p>
                          )}

                          {/* Saved date */}

                          <p className="mt-5 text-xs text-gray-600">
                            Saved{" "}
                            {formatDate(
                              bookmark.created_at,
                            )}
                          </p>

                          {/* Read */}

                          <div className="mt-auto pt-6">
                            <Link
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center gap-2 text-sm font-medium text-green-400 transition hover:text-green-300"
                            >
                              Read Article

                              <ArrowRight
                                size={15}
                              />
                            </Link>
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