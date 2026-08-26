import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import PostEditorForm from "../../../components/admin/PostEditorForm";
import Container from "../../../components/Container";
import { createClient } from "../../../lib/supabase/server";

export default async function NewPostPage() {
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

  const studioBasePath =
    profile.role === "moderator"
      ? "/moderator/posts"
      : profile.role === "author"
        ? "/author/posts"
        : "/admin/posts";

  const [categoriesResult, tagsResult] = await Promise.all([
    supabase
      .from("categories")
      .select(`
        id,
        name,
        slug
      `)
      .order("name", { ascending: true }),
    supabase
      .from("tags")
      .select(`
        id,
        name,
        slug
      `)
      .order("name", { ascending: true }),
  ]);

  const categories = categoriesResult.data;
  const categoryError = categoriesResult.error;
  const tags = tagsResult.data;
  const tagError = tagsResult.error;

  if (categoryError || tagError) {
    return (
      <main className="px-6 py-24">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-300">
          Categories or tags could not be loaded.
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="px-6 pb-10 pt-16 md:pt-24">
        <div className="mx-auto max-w-5xl">
          <Link
            href={studioBasePath}
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-green-400"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Posts
          </Link>

          <p className="mt-8 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Publishing
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white">
            Create New Post
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            Write your article, assign a category and tags, preview the
            Markdown, then save it as a draft or publish it.
          </p>
        </div>
      </section>

      <section className="border-t border-white/5 py-16">
        <Container>
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-8">
            <PostEditorForm
              authorId={user.id}
              currentRole={profile.role}
              categories={categories ?? []}
              tags={tags ?? []}
            />
          </div>
        </Container>
      </section>
    </main>
  );
}