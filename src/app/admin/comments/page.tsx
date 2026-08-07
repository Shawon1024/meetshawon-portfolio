import Link from "next/link";
import {
  ArrowLeft,
  MessageSquareText,
} from "lucide-react";
import { redirect } from "next/navigation";

import AdminCommentsManager from "../../components/admin/AdminCommentsManager";
import Container from "../../components/Container";
import { createClient } from "../../lib/supabase/server";

export default async function AdminCommentsPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/auth/sign-in",
    );
  }

  const {
    data: profile,
  } = await supabase
    .from("profiles")
    .select("role")
    .eq(
      "id",
      user.id,
    )
    .single();

  if (
    profile?.role !==
    "admin"
  ) {
    redirect(
      "/account",
    );
  }

  const {
    data: comments,
    error,
  } = await supabase
    .from("comments")
    .select(`
      id,
      post_id,
      user_id,
      parent_id,
      content,
      status,
      created_at,
      updated_at,
      edited,
      profile:profiles (
        display_name,
        avatar_url,
        verified
      ),
      post:posts (
        id,
        title,
        slug
      )
    `)
    .order(
      "created_at",
      {
        ascending: false,
      },
    );

  return (
    <main>
      <section className="px-6 pb-10 pt-16 md:pt-24">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-green-400"
          >
            <ArrowLeft
              size={16}
            />
            Back to Admin
          </Link>

          <div className="mt-8 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
            <MessageSquareText
              size={24}
            />
          </div>

          <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Moderation
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white">
            Comments
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-gray-400">
            Review, search, filter, and manage comments across all published articles.
          </p>
        </div>
      </section>

      <section className="border-t border-white/5 py-16">
        <Container>
          <div className="mx-auto max-w-6xl">
            {error ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-300">
                Comments could not be loaded.
              </div>
            ) : (
              <AdminCommentsManager
                initialComments={
                  comments ?? []
                }
              />
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}