import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Flame,
  Heart,
  MessageCircle,
} from "lucide-react";

interface PopularPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  view_count: number | null;
  reaction_count: number;
  comment_count: number;
  cover_image_url: string | null;
  cover_image_alt: string | null;
}

interface PopularArticlesProps {
  posts: PopularPost[];
}

export default function PopularArticles({
  posts,
}: PopularArticlesProps) {
  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
          <Flame
            size={20}
            aria-hidden="true"
          />
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-green-400">
            Most Read
          </p>

          <h2 className="mt-1 text-2xl font-semibold text-white">
            Popular Articles
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Popular technical writing ranked by reader views, with reactions
            and discussion activity.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map(
          (
            post,
            index,
          ) => {
            const views =
              post.view_count ??
              0;

            const reactions =
              post.reaction_count ??
              0;

            const comments =
              post.comment_count ??
              0;

            return (
              <article
                key={
                  post.id
                }
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface)]/70 transition duration-200 hover:-translate-y-1 hover:border-green-400/40"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="block overflow-hidden"
                  aria-label={`Read ${post.title}`}
                >
                  <Image
                    src={
                      post.cover_image_url ||
                      "/default-blog-cover.png"
                    }
                    alt={
                      post.cover_image_url
                        ? post.cover_image_alt ??
                          post.title
                        : "Default article cover"
                    }
                    width={1200}
                    height={675}
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                </Link>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                      #{index + 1}
                    </span>

                    <span className="text-xs font-medium uppercase tracking-wider text-gray-600">
                      Most read
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold leading-snug text-white transition group-hover:text-green-300">
                    <Link
                      href={`/blog/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </h3>

                  {post.excerpt && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                      {
                        post.excerpt
                      }
                    </p>
                  )}

                  <div className="mt-auto">
                    <div className="mt-6 grid grid-cols-3 divide-x divide-white/10 rounded-xl border border-white/10 bg-black/10 py-3">
                      <div
                        className="flex items-center justify-center gap-1.5 px-2 text-sm text-gray-400"
                        title={`${views.toLocaleString("en-GB")} views`}
                      >
                        <Eye
                          size={15}
                          aria-hidden="true"
                        />

                        <span>
                          {views.toLocaleString(
                            "en-GB",
                          )}
                        </span>

                        <span className="sr-only">
                          views
                        </span>
                      </div>

                      <div
                        className="flex items-center justify-center gap-1.5 px-2 text-sm text-gray-400"
                        title={`${reactions.toLocaleString("en-GB")} reactions`}
                      >
                        <Heart
                          size={15}
                          aria-hidden="true"
                        />

                        <span>
                          {reactions.toLocaleString(
                            "en-GB",
                          )}
                        </span>

                        <span className="sr-only">
                          reactions
                        </span>
                      </div>

                      <div
                        className="flex items-center justify-center gap-1.5 px-2 text-sm text-gray-400"
                        title={`${comments.toLocaleString("en-GB")} comments`}
                      >
                        <MessageCircle
                          size={15}
                          aria-hidden="true"
                        />

                        <span>
                          {comments.toLocaleString(
                            "en-GB",
                          )}
                        </span>

                        <span className="sr-only">
                          comments
                        </span>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-green-400 transition hover:text-green-300"
                      >
                        Read Article

                        <ArrowRight
                          size={16}
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          },
        )}
      </div>
    </div>
  );
}