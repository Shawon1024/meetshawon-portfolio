import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
}

interface NavigationPost {
  title: string;
  slug: string;
}

interface RelatedArticlesProps {
  relatedPosts: RelatedPost[];

  previousPost:
    | NavigationPost
    | null;

  nextPost:
    | NavigationPost
    | null;
}

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

export default function RelatedArticles({
  relatedPosts,
  previousPost,
  nextPost,
}: RelatedArticlesProps) {
  const hasNavigation =
    previousPost ||
    nextPost;

  const hasRelatedPosts =
    relatedPosts.length > 0;

  if (
    !hasNavigation &&
    !hasRelatedPosts
  ) {
    return null;
  }

  return (
    <div className="space-y-16">
      {/* =============================================
          PREVIOUS / NEXT
      ============================================= */}

      {hasNavigation && (
        <section>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Previous */}

            {previousPost ? (
              <Link
                href={`/blog/${previousPost.slug}`}
                className="group rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6 transition hover:-translate-y-1 hover:border-green-400/40"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <ArrowLeft
                    size={16}
                  />

                  Previous Article
                </div>

                <h3 className="mt-4 text-lg font-semibold leading-7 text-white transition group-hover:text-green-300">
                  {
                    previousPost.title
                  }
                </h3>
              </Link>
            ) : (
              <div className="hidden md:block" />
            )}

            {/* Next */}

            {nextPost ? (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6 text-left transition hover:-translate-y-1 hover:border-green-400/40 md:text-right"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 md:justify-end">
                  Next Article

                  <ArrowRight
                    size={16}
                  />
                </div>

                <h3 className="mt-4 text-lg font-semibold leading-7 text-white transition group-hover:text-green-300">
                  {
                    nextPost.title
                  }
                </h3>
              </Link>
            ) : (
              <div className="hidden md:block" />
            )}
          </div>
        </section>
      )}

      {/* =============================================
          RELATED ARTICLES
      ============================================= */}

      {hasRelatedPosts && (
        <section>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
              Keep Reading
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Related Articles
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-gray-400">
              More articles related to this topic.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map(
              (post) => (
                <article
                  key={post.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface)]/70 transition hover:-translate-y-1 hover:border-green-400/40"
                >
                  {/* Image */}

                  {post.cover_image_url && (
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
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    {/* Date */}

                    {post.published_at && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <CalendarDays
                          size={14}
                        />

                        {formatDate(
                          post.published_at,
                        )}
                      </div>
                    )}

                    {/* Title */}

                    <h3 className="mt-4 text-lg font-semibold leading-7 text-white transition group-hover:text-green-300">
                      <Link
                        href={`/blog/${post.slug}`}
                      >
                        {
                          post.title
                        }
                      </Link>
                    </h3>

                    {/* Excerpt */}

                    {post.excerpt && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400">
                        {
                          post.excerpt
                        }
                      </p>
                    )}

                    {/* Read */}

                    <div className="mt-auto pt-5">
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
              ),
            )}
          </div>
        </section>
      )}
    </div>
  );
}