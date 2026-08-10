import Link from "next/link";
import {
  ArrowLeft,
  Bell,
} from "lucide-react";
import { redirect } from "next/navigation";

import Container from "../../components/Container";
import NotificationManager from "../../components/account/NotificationManager";
import { createClient } from "../../lib/supabase/server";
import { requireAccountNotBlocked } from "../../lib/accountRestriction";

export default async function NotificationsPage() {
  await requireAccountNotBlocked();

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
      "/auth/sign-in?next=/account/notifications",
    );
  }

  // --------------------------------------------------
  // LOAD NOTIFICATIONS
  // --------------------------------------------------

  const {
    data: notificationRows,
    error:
      notificationsError,
  } = await supabase
    .from("notifications")
    .select(`
      id,
      type,
      message,
      read_at,
      created_at,
      post_id,
      comment_id,
      actor_id
    `)
    .eq(
      "recipient_id",
      user.id,
    )
    .order(
      "created_at",
      {
        ascending:
          false,
      },
    );

  if (
    notificationsError
  ) {
    console.error(
      "Notifications could not be loaded:",
      notificationsError,
    );
  }

  const notifications =
    notificationRows ??
    [];

  // --------------------------------------------------
  // LOAD ACTORS
  // --------------------------------------------------

  const actorIds = [
    ...new Set(
      notifications
        .map(
          (
            item,
          ) =>
            item.actor_id,
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
    data: actorRows,
    error:
      actorsError,
  } =
    actorIds.length >
    0
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
            actorIds,
          )
      : {
          data: [],
          error: null,
        };

  if (
    actorsError
  ) {
    console.error(
      "Notification actors could not be loaded:",
      actorsError,
    );
  }

  // --------------------------------------------------
  // LOAD RELATED POSTS
  // --------------------------------------------------

  const postIds = [
    ...new Set(
      notifications
        .map(
          (
            item,
          ) =>
            item.post_id,
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
    data: postRows,
    error:
      postsError,
  } =
    postIds.length >
    0
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
      "Notification posts could not be loaded:",
      postsError,
    );
  }

  // --------------------------------------------------
  // MAP RELATED DATA
  // --------------------------------------------------

  const actorMap =
    new Map(
      (
        actorRows ??
        []
      ).map(
        (
          actor,
        ) => [
          actor.id,
          actor,
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

  const initialNotifications =
    notifications.map(
      (
        notification,
      ) => ({
        ...notification,

        actor:
          notification.actor_id
            ? actorMap.get(
                notification.actor_id,
              ) ??
              null
            : null,

        post:
          notification.post_id
            ? postMap.get(
                notification.post_id,
              ) ??
              null
            : null,
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

      <section className="px-6 pb-12 pt-16 md:pt-24">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-green-400"
          >
            <ArrowLeft
              size={16}
            />

            Back to Account
          </Link>

          <div className="mt-8 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
            <Bell
              size={24}
            />
          </div>

          <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Notifications
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
            Your Notifications
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-gray-400">
            Replies, reactions, verification updates, role changes, and other
            account activity appear here.
          </p>
        </div>
      </section>

      {/* =================================================
          NOTIFICATIONS
      ================================================= */}

      <section className="border-t border-white/5 py-16">
        <Container>
          <div className="mx-auto max-w-5xl">
            {notificationsError ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-300">
                <p className="font-medium">
                  Notifications could not be loaded.
                </p>

                <p className="mt-2 text-sm">
                  {
                    notificationsError.message
                  }
                </p>
              </div>
            ) : (
              <NotificationManager
                key={
                  initialNotifications
                    .map(
                      (
                        notification,
                      ) =>
                        `${notification.id}:${notification.read_at ?? "unread"}`,
                    )
                    .join("|")
                }
                initialNotifications={
                  initialNotifications
                }
              />
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}