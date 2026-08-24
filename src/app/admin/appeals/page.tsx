import Link from "next/link";
import {
  ArrowLeft,
  Scale,
} from "lucide-react";
import { redirect } from "next/navigation";

import AppealReviewManager from "../../components/admin/AppealReviewManager";
import Container from "../../components/Container";
import { createClient } from "../../lib/supabase/server";

export default async function AdminAppealsPage() {
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
  // ADMIN CHECK
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
    profile.role !==
      "admin"
  ) {
    redirect(
      "/account",
    );
  }

  // --------------------------------------------------
  // LOAD APPEALS
  // --------------------------------------------------

  const {
    data: appealRows,
    error: appealsError,
  } = await supabase
    .from(
      "account_block_appeals",
    )
    .select(`
      id,
      user_id,
      message,
      status,
      reviewed_by,
      admin_response,
      created_at,
      reviewed_at,
      updated_at
    `)
    .order(
      "created_at",
      {
        ascending:
          false,
      },
    );

  if (
    appealsError
  ) {
    console.error(
      "Admin appeals query failed:",
      appealsError,
    );
  }

  const appeals =
    appealRows ?? [];

  // --------------------------------------------------
  // LOAD APPEAL USERS
  // --------------------------------------------------

  const userIds = [
    ...new Set(
      appeals.map(
        (
          appeal,
        ) =>
          appeal.user_id,
      ),
    ),
  ];

  const {
    data: userProfiles,
    error: usersError,
  } =
    userIds.length > 0
      ? await supabase
          .from("profiles")
          .select(`
            id,
            first_name,
            last_name,
            username,
            avatar_url,
            verified,
            role
          `)
          .in(
            "id",
            userIds,
          )
      : {
          data: [],
          error: null,
        };

  if (
    usersError
  ) {
    console.error(
      "Appeal users could not be loaded:",
      usersError,
    );
  }

  // --------------------------------------------------
  // LOAD REVIEWERS
  // --------------------------------------------------

  const reviewerIds = [
    ...new Set(
      appeals
        .map(
          (
            appeal,
          ) =>
            appeal.reviewed_by,
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
    data: reviewerProfiles,
    error: reviewersError,
  } =
    reviewerIds.length > 0
      ? await supabase
          .from("profiles")
          .select(`
            id,
            first_name,
            last_name,
            username
          `)
          .in(
            "id",
            reviewerIds,
          )
      : {
          data: [],
          error: null,
        };

  if (
    reviewersError
  ) {
    console.error(
      "Appeal reviewers could not be loaded:",
      reviewersError,
    );
  }

  // --------------------------------------------------
  // MAP RELATED DATA
  // --------------------------------------------------

  const userMap =
    new Map(
      (
        userProfiles ??
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

  const reviewerMap =
    new Map(
      (
        reviewerProfiles ??
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

  const initialAppeals =
    appeals.map(
      (
        appeal,
      ) => ({
        ...appeal,

        user:
          userMap.get(
            appeal.user_id,
          ) ?? null,

        reviewer:
          appeal.reviewed_by
            ? reviewerMap.get(
                appeal.reviewed_by,
              ) ??
              null
            : null,
      }),
    );

  return (
    <main>
      {/* =================================================
          HEADER
      ================================================= */}

      <section className="px-6 pb-10 pt-16 md:pt-24">
        <Container>
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

            <div className="mt-8 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
              <Scale
                size={24}
              />
            </div>

            <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-amber-300">
              Account Appeals
            </p>

            <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
              Appeal Review
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-gray-400">
              Review blocked-account appeals, restore approved accounts, and
              record clear responses for rejected requests.
            </p>
          </div>
        </Container>
      </section>

      {/* =================================================
          APPEALS
      ================================================= */}

      <section className="border-t border-white/5 py-16">
        <Container>
          <div className="mx-auto max-w-6xl">
            {appealsError ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-300">
                <p className="font-medium">
                  Appeals could not be loaded.
                </p>

                <p className="mt-2 text-sm">
                  {
                    appealsError.message
                  }
                </p>
              </div>
            ) : (
              <AppealReviewManager
                initialAppeals={
                  initialAppeals
                }
              />
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}