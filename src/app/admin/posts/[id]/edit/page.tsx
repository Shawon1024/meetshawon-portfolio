import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  notFound,
  redirect,
} from "next/navigation";

import PostEditorForm from "../../../../components/admin/PostEditorForm";
import Container from "../../../../components/Container";
import { createClient } from "../../../../lib/supabase/server";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({
  params,
}: EditPostPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  // --------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  // --------------------------------------------------
  // BLOR WRITER ROLE CHECK
  // --------------------------------------------------

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const canWriteBlog =
    profile?.role === "admin" ||
    profile?.role === "author" ||
    profile?.role === "moderator";

  if (
    profileError ||
    !canWriteBlog
  ) {
    redirect("/account");
  }

  // --------------------------------------------------
  // LOAD POST
  // --------------------------------------------------

  const {
    data: post,
    error: postError,
  } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      status,
      featured,
      category_id,
      cover_image_url,
      cover_image_alt,
      author_id
    `)
    .eq("id", id)
    .single();

  if (
    postError ||
    !post
  ) {
    notFound();
  }

  if (
    profile?.role !== "admin" &&
    profile?.role !== "moderator" &&
    post.author_id !== user.id
  ) {
    redirect("/admin/posts");
  }

  // --------------------------------------------------
  // LOAD CATEGORIES
  // --------------------------------------------------

  const {
    data: categories,
    error: categoryError,
  } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      slug
    `)
    .order("name", {
      ascending: true,
    });

  // --------------------------------------------------
  // LOAD TAGS
  // --------------------------------------------------

  const {
    data: tags,
    error: tagError,
  } = await supabase
    .from("tags")
    .select(`
      id,
      name,
      slug
    `)
    .order("name", {
      ascending: true,
    });

  // --------------------------------------------------
  // LOAD TAGS ALREADY ATTACHED TO THIS POST
  // --------------------------------------------------

  const {
    data: postTags,
    error: postTagsError,
  } = await supabase
    .from("post_tags")
    .select("tag_id")
    .eq(
      "post_id",
      post.id,
    );

  // --------------------------------------------------
  // METADATA ERROR
  // --------------------------------------------------

  if (
    categoryError ||
    tagError ||
    postTagsError
  ) {
    return (
      <main className="px-6 py-24">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-300">
          The article metadata could not be loaded.
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // PRESELECT CURRENT TAGS
  // --------------------------------------------------

  const initialTagIds =
    postTags?.map(
      (item) => item.tag_id,
    ) ?? [];

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main>
      {/* Header */}
      <section className="px-6 pb-10 pt-16 md:pt-24">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/admin/posts"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-green-400"
          >
            <ArrowLeft size={16} />
            Back to Posts
          </Link>

          <p className="mt-8 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Edit Article
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white">
            {post.title}
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            Update the content, category, tags, cover image, status, or other
            article settings.
          </p>
        </div>
      </section>

      {/* Editor */}
      <section className="border-t border-white/5 py-16">
        <Container>
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-8">
            <PostEditorForm
              authorId={user.id}
              currentRole={profile.role}
              post={post}
              categories={categories ?? []}
              tags={tags ?? []}
              initialTagIds={initialTagIds}
            />
          </div>
        </Container>
      </section>
    </main>
  );
}