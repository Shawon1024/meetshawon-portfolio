import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FilePlus2,
  FileText,
  Pencil,
} from "lucide-react";

import Container from "../../components/Container";
import { createClient } from "../../lib/supabase/server";

export default async function AdminPostsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const canWriteBlog =
    profile?.role === "admin" ||
    profile?.role === "author" ||
    profile?.role === "moderator";

  if (!canWriteBlog) {
    redirect("/account");
  }

  let postsQuery = supabase
    .from("posts")
    .select(`
      id,
      title,
      slug,
      status,
      featured,
      published_at,
      created_at,
      updated_at,
      author_id
    `);

  if (
    profile?.role ===
    "author"
  ) {
    postsQuery =
      postsQuery.eq(
        "author_id",
        user.id,
      );
  }

  const {
    data: posts,
    error,
  } = await postsQuery.order(
    "created_at",
    {
      ascending: false,
    },
  );

  return (
    <main>
      <section className="px-6 pb-12 pt-16 md:pt-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Blog Studio
              </p>

              <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
                {profile?.role === "admin"
                  ? "Manage Posts"
                  : "My Posts"}
              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                Create, edit, publish and manage articles for the blog.
              </p>
            </div>

            <Link
              href="/admin/posts/new"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-medium text-black transition hover:bg-green-400"
            >
              <FilePlus2 size={18} />
              New Post
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 py-16">
        <Container>
          {error ? (
            <p className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-red-300">
              Posts could not be loaded.
            </p>
          ) : !posts || posts.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-10 text-center">
              <FileText
                size={40}
                className="mx-auto text-green-300"
              />

              <h2 className="mt-5 text-2xl font-semibold text-white">
                No posts yet
              </h2>

              <p className="mt-3 text-gray-400">
                Create your first article to start building the blog.
              </p>

              <Link
                href="/admin/posts/new"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-medium text-black"
              >
                <FilePlus2 size={18} />
                Create First Post
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                          post.status === "published"
                            ? "border-green-400/20 bg-green-400/10 text-green-300"
                            : post.status === "draft"
                              ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                              : "border-white/10 bg-white/5 text-gray-300"
                        }`}
                      >
                        {post.status}
                      </span>

                      {post.featured && (
                        <span className="text-xs uppercase tracking-wider text-gray-500">
                          Featured
                        </span>
                      )}
                    </div>

                    <h2 className="mt-3 text-xl font-semibold text-white">
                      {post.title}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      /blog/{post.slug}
                    </p>
                  </div>

                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white transition hover:border-green-400 hover:text-green-300"
                  >
                    <Pencil size={16} />
                    Edit
                  </Link>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}