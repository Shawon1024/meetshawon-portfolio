import Link from "next/link";
import {
  ArrowLeft,
  History,
  MessageSquareWarning,
  ShieldCheck,
} from "lucide-react";
import { redirect } from "next/navigation";

import Container from "../components/Container";
import ModerationUserManager from "../components/moderation/ModerationUserManager";
import { createClient } from "../lib/supabase/server";

export default async function ModerationPage() {
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
  // ROLE CHECK
  // --------------------------------------------------

  const {
    data: profile,
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
  // LOAD USERS
  // --------------------------------------------------

  const {
    data: users,
    error: usersError,
  } = await supabase
    .from("profiles")
    .select(`
      id,
      display_name,
      username,
      avatar_url,
      role,
      verified
    `)
    .order(
      "display_name",
      {
        ascending: true,
      },
    );

  if (
    usersError
  ) {
    console.error(
      "Moderation users query failed:",
      usersError,
    );
  }

  // --------------------------------------------------
  // LOAD RESTRICTIONS
  // --------------------------------------------------

  const {
    data: restrictions,
    error:
      restrictionsError,
  } = await supabase
    .from(
      "account_restrictions",
    )
    .select(`
      user_id,
      status,
      public_reason,
      internal_notes,
      expires_at,
      actioned_by,
      updated_at
    `);

  if (
    restrictionsError
  ) {
    console.error(
      "Moderation restrictions query failed:",
      restrictionsError,
    );
  }

  // --------------------------------------------------
  // MAP RESTRICTIONS TO USERS
  // --------------------------------------------------

  const restrictionMap =
    new Map(
      (
        restrictions ??
        []
      ).map(
        (
          restriction,
        ) => [
          restriction.user_id,
          restriction,
        ],
      ),
    );

  const initialUsers =
    (
      users ??
      []
    ).map(
      (
        item,
      ) => ({
        ...item,

        restriction:
          restrictionMap.get(
            item.id,
          ) ?? {
            user_id:
              item.id,
            status:
              "active",
            public_reason:
              null,
            internal_notes:
              null,
            expires_at:
              null,
            actioned_by:
              null,
            updated_at:
              null,
          },
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
            {/* BACK */}

            <Link
              href={
                profile.role ===
                  "admin"
                  ? "/admin"
                  : "/account"
              }
              className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-green-400"
            >
              <ArrowLeft
                size={16}
              />

              Back
            </Link>

            {/* =================================================
                HEADER CONTENT
            ================================================= */}

            <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              {/* LEFT SIDE */}

              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                  <ShieldCheck
                    size={24}
                  />
                </div>

                <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-amber-300">
                  Moderation
                </p>

                <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
                  Moderation Dashboard
                </h1>

                <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                  Review account status, apply temporary restrictions, manage
                  blocked accounts, and moderate community content according to
                  your staff permissions.
                </p>
              </div>

              {/* =================================================
                  MODERATION ACTIONS
              ================================================= */}

              <div className="flex w-fit flex-wrap items-center gap-1">
                {/* Content Moderation */}

                <Link
                  href="/moderation/content"
                  className="group relative inline-flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-400/10 px-4 py-2.5 text-sm font-medium text-blue-300 transition duration-200 hover:border-blue-400/40 hover:bg-blue-400/15 hover:text-blue-200"
                >
                  <MessageSquareWarning
                    size={17}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />

                  <span>
                    Content Moderation
                  </span>
                </Link>

                {/* Moderation History */}

                <Link
                  href="/moderation/history"
                  className="group relative inline-flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-2.5 text-sm font-medium text-amber-300 transition duration-200 hover:border-amber-400/40 hover:bg-amber-400/15 hover:text-amber-200"
                >
                  <History
                    size={17}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />

                  <span>
                    Moderation History
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =================================================
          USER MANAGEMENT
      ================================================= */}

      <section className="border-t border-white/5 py-16">
        <Container>
          <div className="mx-auto max-w-6xl">
            {usersError ||
            restrictionsError ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-300">
                Moderation data could not be loaded.
              </div>
            ) : (
              <ModerationUserManager
                currentUserId={
                  user.id
                }
                currentRole={
                  profile.role
                }
                initialUsers={
                  initialUsers
                }
              />
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}