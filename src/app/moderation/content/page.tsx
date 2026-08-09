import Link from "next/link";
import {
  ArrowLeft,
  MessageSquareWarning,
} from "lucide-react";
import { redirect } from "next/navigation";

import Container from "../../components/Container";
import ContentModerationManager from "../../components/moderation/ContentModerationManager";
import { createClient } from "../../lib/supabase/server";

type CommentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "spam";

export default async function ModerationContentPage() {
  const supabase =
    await createClient();

  // --------------------------------------------------
  // AUTH
  // --------------------------------------------------

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/auth/sign-in",
    );
  }

  // --------------------------------------------------
  // STAFF CHECK
  // --------------------------------------------------

  const {
    data: staffProfile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select(`
      id,
      role
    `)
    .eq(
      "id",
      user.id,
    )
    .maybeSingle();

  if (
    profileError ||
    !staffProfile ||
    (
      staffProfile.role !==
        "admin" &&
      staffProfile.role !==
        "moderator"
    )
  ) {
    redirect(
      "/account",
    );
  }

  // --------------------------------------------------
  // LOAD COMMENTS
  // --------------------------------------------------

  const {
    data: commentRows,
    error: commentsError,
  } = await supabase
    .from("comments")
    .select(`
      id,
      post_id,
      user_id,
      parent_id,
      content,
      status,
      edited,
      moderation_reason,
      moderated_by,
      moderated_at,
      created_at,
      updated_at
    `)
    .order(
      "created_at",
      {
        ascending: false,
      },
    );

  if (
    commentsError
  ) {
    console.error(
      "Content moderation comments could not be loaded:",
      commentsError,
    );
  }

  const comments =
    commentRows ?? [];

  // --------------------------------------------------
  // LOAD AUTHORS / MODERATORS
  // --------------------------------------------------

  const profileIds = [
    ...new Set(
      comments
        .flatMap(
          (
            comment,
          ) => [
            comment.user_id,
            comment.moderated_by,
          ],
        )
        .filter(
          (
            id,
          ): id is string =>
            Boolean(id),
        ),
    ),
  ];

  const {
    data: profileRows,
    error: profilesError,
  } =
    profileIds.length > 0
      ? await supabase
          .from("profiles")
          .select(`
            id,
            display_name,
            username,
            avatar_url,
            verified,
            role
          `)
          .in(
            "id",
            profileIds,
          )
      : {
          data: [],
          error: null,
        };

  if (
    profilesError
  ) {
    console.error(
      "Content moderation profiles could not be loaded:",
      profilesError,
    );
  }

  // --------------------------------------------------
  // LOAD POSTS
  // --------------------------------------------------

  const postIds = [
    ...new Set(
      comments.map(
        (
          comment,
        ) =>
          comment.post_id,
      ),
    ),
  ];

  const {
    data: postRows,
    error: postsError,
  } =
    postIds.length > 0
      ? await supabase
          .from("posts")
          .select(`
            id,
            title,
            slug
          `)
          .in(
            "id",
            postIds,
          )
      : {
          data: [],
          error: null,
        };

  if (
    postsError
  ) {
    console.error(
      "Content moderation posts could not be loaded:",
      postsError,
    );
  }

  // --------------------------------------------------
  // MAP RELATED DATA
  // --------------------------------------------------

  const profileMap =
    new Map(
      (
        profileRows ??
        []
      ).map(
        (
          profile,
        ) => [
          profile.id,
          profile,
        ],
      ),
    );

  const postMap =
    new Map(
      (
        postRows ??
        []
      ).map(
        (
          post,
        ) => [
          post.id,
          post,
        ],
      ),
    );

  const initialComments =
    comments.map(
      (
        comment,
      ) => ({
        ...comment,

        status:
          comment.status as CommentStatus,

        author:
          profileMap.get(
            comment.user_id,
          ) ?? null,

        moderator:
          comment.moderated_by
            ? profileMap.get(
                comment.moderated_by,
              ) ?? null
            : null,

        post:
          postMap.get(
            comment.post_id,
          ) ?? null,
      }),
    );

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main>
      {/* =================================================
          HEADER
      ================================================= */}

      <section className="px-6 pb-10 pt-16 md:pt-24">
        <Container>
          <div className="mx-auto max-w-6xl">
            <Link
              href="/moderation"
              className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-green-400"
            >
              <ArrowLeft
                size={16}
              />

              Back to Moderation
            </Link>

            <div className="mt-8 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
              <MessageSquareWarning
                size={24}
              />
            </div>

            <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-blue-300">
              Content Moderation
            </p>

            <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
              Comment Moderation
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-gray-400">
              Review community comments, hide inappropriate content, mark spam,
              and restore comments when necessary.
            </p>
          </div>
        </Container>
      </section>

      {/* =================================================
          MODERATION QUEUE
      ================================================= */}

      <section className="border-t border-white/5 py-16">
        <Container>
          <div className="mx-auto max-w-6xl">
            {commentsError ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-300">
                <p className="font-medium">
                  Comments could not be loaded.
                </p>

                <p className="mt-2 text-sm">
                  {
                    commentsError.message
                  }
                </p>
              </div>
            ) : (
              <ContentModerationManager
                initialComments={
                  initialComments
                }
              />
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}