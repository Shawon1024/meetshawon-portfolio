import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Flame,
} from "lucide-react";

interface PopularPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  view_count: number | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
}

interface PopularArticlesProps {
  posts: PopularPost[];
}

export default function PopularArticles({
  posts,
}: PopularArticlesProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-start gap-3">
        <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300">
          <Flame size={21} />
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
            Most Read
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Popular Articles
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-gray-400">
            The articles readers have viewed the most.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => {
          const views =
            Number(post.view_count ?? 0);

          return (
            <article
              key={post.id}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface)]/70 transition hover:-translate-y-1 hover:border-green-400/40"
            >
              {post.cover_image_url && (
                <Link
                  href={`/blog/${post.slug}`}
                  className="block overflow-hidden"
                >
                  <img
                    src={post.cover_image_url}
                    alt={
                      post.cover_image_alt ??
                      post.title
                    }
                    className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                </Link>
              )}

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs font-medium text-gray-400">
                    #{index + 1}
                  </span>

                  <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                    <Eye size={14} />

                    {views.toLocaleString("en-GB")}{" "}
                    {views === 1
                      ? "view"
                      : "views"}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-semibold leading-7 text-white transition group-hover:text-green-300">
                  <Link
                    href={`/blog/${post.slug}`}
                  >
                    {post.title}
                  </Link>
                </h3>

                {post.excerpt && (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400">
                    {post.excerpt}
                  </p>
                )}

                <div className="mt-auto pt-6">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-green-400 transition hover:text-green-300"
                  >
                    Read Article
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}