import Link from "next/link";
import {
  ArrowLeft,
  History,
} from "lucide-react";
import { redirect } from "next/navigation";

import Container from "../../components/Container";
import ModerationHistoryManager from "../../components/moderation/ModerationHistoryManager";
import { createClient } from "../../lib/supabase/server";

function extractAuditUuid(
  value: string | null,
  key: "comment_id" | "post_id",
) {
  if (!value) {
    return null;
  }

  const match = value.match(
    new RegExp(
      `${key}=([0-9a-fA-F-]{36})`,
    ),
  );

  return match?.[1] ?? null;
}

export default async function ModerationHistoryPage() {
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
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select(`
      role
    `)
    .eq(
      "id",
      user.id,
    )
    .maybeSingle();

  if (
    profileError ||
    !profile ||
    (
      profile.role !==
        "admin" &&
      profile.role !==
        "moderator"
    )
  ) {
    redirect(
      "/account",
    );
  }

  // --------------------------------------------------
  // LOAD AUDIT LOG
  // --------------------------------------------------

  const {
    data: auditRows,
    error: auditError,
  } = await supabase
    .from(
      "moderation_audit_log",
    )
    .select(`
      id,
      target_user_id,
      actor_id,
      action,
      previous_status,
      new_status,
      public_reason,
      internal_notes,
      expires_at,
      created_at
    `)
    .order(
      "created_at",
      {
        ascending: false,
      },
    );

  if (
    auditError
  ) {
    console.error(
      "Moderation history could not be loaded:",
      auditError,
    );
  }

  const auditLog =
    auditRows ?? [];

  // --------------------------------------------------
  // LOAD USERS
  // --------------------------------------------------

  const profileIds = [
    ...new Set(
      auditLog
        .flatMap(
          (
            item,
          ) => [
            item.target_user_id,
            item.actor_id,
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
          .from(
            "profiles",
          )
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
      "Moderation history profiles could not be loaded:",
      profilesError,
    );
  }

  // --------------------------------------------------
  // EXTRACT CONTENT REFERENCES
  // --------------------------------------------------

  const contentReferences =
    auditLog.map(
      (
        item,
      ) => ({
        auditId:
          item.id,

        commentId:
          extractAuditUuid(
            item.internal_notes,
            "comment_id",
          ),

        postId:
          extractAuditUuid(
            item.internal_notes,
            "post_id",
          ),
      }),
    );

  const commentIds = [
    ...new Set(
      contentReferences
        .map(
          (
            item,
          ) =>
            item.commentId,
        )
        .filter(
          (
            id,
          ): id is string =>
            Boolean(id),
        ),
    ),
  ];

  const postIds = [
    ...new Set(
      contentReferences
        .map(
          (
            item,
          ) =>
            item.postId,
        )
        .filter(
          (
            id,
          ): id is string =>
            Boolean(id),
        ),
    ),
  ];

  // --------------------------------------------------
  // LOAD RELATED COMMENTS
  // --------------------------------------------------

  const {
    data: commentRows,
    error: commentsError,
  } =
    commentIds.length > 0
      ? await supabase
          .from("comments")
          .select(`
            id,
            content,
            status
          `)
          .in(
            "id",
            commentIds,
          )
      : {
          data: [],
          error: null,
        };

  if (
    commentsError
  ) {
    console.error(
      "Moderation history comments could not be loaded:",
      commentsError,
    );
  }

  // --------------------------------------------------
  // LOAD RELATED POSTS
  // --------------------------------------------------

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
      "Moderation history posts could not be loaded:",
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
          item,
        ) => [
          item.id,
          item,
        ],
      ),
    );

  const commentMap =
    new Map(
      (
        commentRows ??
        []
      ).map(
        (
          item,
        ) => [
          item.id,
          item,
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
          item,
        ) => [
          item.id,
          item,
        ],
      ),
    );

  const referenceMap =
    new Map(
      contentReferences.map(
        (
          item,
        ) => [
          item.auditId,
          item,
        ],
      ),
    );

  const initialHistory =
    auditLog.map(
      (
        item,
      ) => {
        const reference =
          referenceMap.get(
            item.id,
          );

        return {
          ...item,

          actor:
            item.actor_id
              ? profileMap.get(
                  item.actor_id,
                ) ??
                null
              : null,

          target:
            profileMap.get(
              item.target_user_id,
            ) ??
            null,

          comment:
            reference?.commentId
              ? commentMap.get(
                  reference.commentId,
                ) ??
                null
              : null,

          post:
            reference?.postId
              ? postMap.get(
                  reference.postId,
                ) ??
                null
              : null,
        };
      },
    );

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main>
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

            <div className="mt-8 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
              <History
                size={24}
              />
            </div>

            <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-amber-300">
              Moderation
            </p>

            <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
              Moderation History
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-gray-400">
              Review account restrictions, blocks, comment moderation, and
              other staff moderation activity.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-16">
        <Container>
          <div className="mx-auto max-w-6xl">
            {auditError ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-300">
                Moderation history could not be loaded.
              </div>
            ) : (
              <ModerationHistoryManager
                initialHistory={
                  initialHistory
                }
              />
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}