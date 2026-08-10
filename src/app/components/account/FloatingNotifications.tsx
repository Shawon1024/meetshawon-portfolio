"use client";

import {
  Bell,
  Heart,
  MessageCircle,
  MessageCircleReply,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useRouter,
} from "next/navigation";

import { createClient } from "../../lib/supabase/client";

interface NotificationRow {
  id: string;
  recipient_id: string;
  actor_id: string | null;
  type: string;
  post_id: string | null;
  comment_id: string | null;
  message: string | null;
  read_at: string | null;
  created_at: string;
}

interface FloatingNotification
  extends NotificationRow {
  post_slug: string | null;
}

interface FloatingNotificationCardProps {
  notification: FloatingNotification;
  onDismiss: (
    id: string,
  ) => void;
  onOpen: (
    notification: FloatingNotification,
  ) => void;
}

const DISPLAY_TIME_MS =
  7000;

const FLOATING_TYPES =
  new Set([
    "comment_reply",
    "comment_reaction",
    "post_reaction",
    "post_comment",
    "comment_activity",
    "reply_activity",
  ]);

function NotificationIcon({
  type,
}: {
  type: string;
}) {
  if (
    type ===
    "comment_reaction" ||
    type ===
    "post_reaction"
  ) {
    return (
      <Heart
        size={19}
      />
    );
  }

  if (
    type ===
    "comment_reply" ||
    type ===
    "reply_activity"
  ) {
    return (
      <MessageCircleReply
        size={19}
      />
    );
  }

  if (
    type ===
    "post_comment" ||
    type ===
    "comment_activity"
  ) {
    return (
      <MessageCircle
        size={19}
      />
    );
  }

  return (
    <Bell
      size={19}
    />
  );
}

function FloatingNotificationCard({
  notification,
  onDismiss,
  onOpen,
}: FloatingNotificationCardProps) {
  const timerRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(
      null,
    );

  const remainingRef =
    useRef(
      DISPLAY_TIME_MS,
    );

  const startedAtRef =
    useRef<number>(
      0,
    );

  const clearTimer =
    useCallback(
      () => {
        if (
          timerRef.current
        ) {
          clearTimeout(
            timerRef.current,
          );

          timerRef.current =
            null;
        }
      },
      [],
    );

  const startTimer =
    useCallback(
      () => {
        clearTimer();

        if (
          remainingRef.current <=
          0
        ) {
          onDismiss(
            notification.id,
          );

          return;
        }

        startedAtRef.current =
          Date.now();

        timerRef.current =
          setTimeout(
            () => {
              remainingRef.current =
                0;

              onDismiss(
                notification.id,
              );
            },
            remainingRef.current,
          );
      },
      [
        clearTimer,
        notification.id,
        onDismiss,
      ],
    );

  useEffect(() => {
    startTimer();

    return () => {
      clearTimer();
    };
  }, [
    clearTimer,
    startTimer,
  ]);

  const pauseTimer =
    () => {
      if (
        !timerRef.current
      ) {
        return;
      }

      const elapsed =
        Date.now() -
        startedAtRef.current;

      remainingRef.current =
        Math.max(
          0,
          remainingRef.current -
            elapsed,
        );

      clearTimer();
    };

  const resumeTimer =
    () => {
      startTimer();
    };

  const openNotification =
    () => {
      clearTimer();

      onOpen(
        notification,
      );
    };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={
        openNotification
      }
      onKeyDown={(
        event,
      ) => {
        if (
          event.key ===
            "Enter" ||
          event.key ===
            " "
        ) {
          event.preventDefault();

          openNotification();
        }
      }}
      onMouseEnter={
        pauseTimer
      }
      onMouseLeave={
        resumeTimer
      }
      className="group relative w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#102A2A]/95 shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-green-400/30 focus:outline-none focus:ring-2 focus:ring-green-400/40"
    >
      <button
        type="button"
        aria-label="Close notification"
        onClick={(
          event,
        ) => {
          event.stopPropagation();

          clearTimer();

          onDismiss(
            notification.id,
          );
        }}
        className="absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black/20 text-gray-400 opacity-0 transition hover:bg-white/10 hover:text-white group-hover:opacity-100 group-focus-within:opacity-100"
      >
        <X
          size={16}
        />
      </button>

      <div className="flex items-start gap-4 p-4 pr-12">
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
          <NotificationIcon
            type={
              notification.type
            }
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-green-400">
            New activity
          </p>

          <p className="mt-1.5 text-sm leading-6 text-gray-100">
            {notification.message ??
              "You have a new notification."}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Click to view
          </p>
        </div>
      </div>

      <div className="h-0.5 w-full bg-green-400/40" />
    </div>
  );
}

export default function FloatingNotifications() {
  const supabase =
    useMemo(
      () =>
        createClient(),
      [],
    );

  const router =
    useRouter();

  const [
    notifications,
    setNotifications,
  ] =
    useState<
      FloatingNotification[]
    >([]);

  const dismissNotification =
    useCallback(
      (
        id: string,
      ) => {
        setNotifications(
          (
            current,
          ) =>
            current.filter(
              (
                item,
              ) =>
                item.id !==
                id,
            ),
        );
      },
      [],
    );

  useEffect(() => {
    let cancelled =
      false;

    let channel:
      ReturnType<
        typeof supabase.channel
      > | null =
      null;

    const subscribe =
      async () => {
        const {
          data: {
            user,
          },
          error:
            userError,
        } =
          await supabase.auth.getUser();

        if (
          cancelled ||
          userError ||
          !user
        ) {
          return;
        }

        channel =
          supabase
            .channel(
              `floating-notifications-${user.id}`,
            )
            .on(
              "postgres_changes",
              {
                event:
                  "INSERT",
                schema:
                  "public",
                table:
                  "notifications",
                filter:
                  `recipient_id=eq.${user.id}`,
              },
              async (
                payload,
              ) => {
                const row =
                  payload.new as NotificationRow;

                if (
                  !FLOATING_TYPES.has(
                    row.type,
                  )
                ) {
                  return;
                }

                let postSlug:
                  string | null =
                  null;

                if (
                  row.post_id
                ) {
                  const {
                    data:
                      post,
                    error:
                      postError,
                  } =
                    await supabase
                      .from(
                        "posts",
                      )
                      .select(
                        "slug",
                      )
                      .eq(
                        "id",
                        row.post_id,
                      )
                      .maybeSingle();

                  if (
                    postError
                  ) {
                    console.error(
                      "Floating notification post could not be loaded:",
                      postError,
                    );
                  } else {
                    postSlug =
                      post?.slug ??
                      null;
                  }
                }

                if (
                  cancelled
                ) {
                  return;
                }

                const enriched:
                  FloatingNotification =
                  {
                    ...row,
                    post_slug:
                      postSlug,
                  };

                setNotifications(
                  (
                    current,
                  ) => {
                    if (
                      current.some(
                        (
                          item,
                        ) =>
                          item.id ===
                          enriched.id,
                      )
                    ) {
                      return current;
                    }

                    return [
                      enriched,
                      ...current,
                    ].slice(
                      0,
                      4,
                    );
                  },
                );

                window.dispatchEvent(
                  new CustomEvent(
                    "notifications-changed",
                    {
                      detail: {
                        source:
                          "floating",
                      },
                    },
                  ),
                );
              },
            )
            .subscribe(
              (
                status,
                error,
              ) => {
                if (
                  status ===
                    "CHANNEL_ERROR" &&
                  error
                ) {
                  console.warn(
                    "Floating notification realtime temporarily disconnected:",
                    error,
                  );
                }
              },
            );
      };

    void subscribe();

    return () => {
      cancelled =
        true;

      if (
        channel
      ) {
        void supabase.removeChannel(
          channel,
        );
      }
    };
  }, [
    supabase,
  ]);

  const openNotification =
    useCallback(
      async (
        notification:
          FloatingNotification,
      ) => {
        if (
          !notification.read_at
        ) {
          const {
            error,
          } =
            await supabase
              .from(
                "notifications",
              )
              .update({
                read_at:
                  new Date().toISOString(),
              })
              .eq(
                "id",
                notification.id,
              );

          if (
            error
          ) {
            console.error(
              "Notification could not be marked as read:",
              error,
            );
          } else {
            window.dispatchEvent(
              new CustomEvent(
                "notifications-changed",
                {
                  detail: {
                    source:
                      "floating",
                  },
                },
              ),
            );
          }
        }

        dismissNotification(
          notification.id,
        );

        if (
          notification.post_slug
        ) {
          const hash =
            notification.comment_id
              ? `#comment-${notification.comment_id}`
              : "";

          router.push(
            `/blog/${notification.post_slug}${hash}`,
          );

          return;
        }

        router.push(
          "/account/notifications",
        );
      },
      [
        dismissNotification,
        router,
        supabase,
      ],
    );

  if (
    notifications.length ===
    0
  ) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-4 top-20 z-[250] flex flex-col items-end gap-3 sm:left-auto sm:right-5 sm:top-24 sm:w-[390px]"
      aria-live="polite"
      aria-relevant="additions"
    >
      {notifications.map(
        (
          notification,
        ) => (
          <div
            key={
              notification.id
            }
            className="pointer-events-auto w-full"
          >
            <FloatingNotificationCard
              notification={
                notification
              }
              onDismiss={
                dismissNotification
              }
              onOpen={
                openNotification
              }
            />
          </div>
        ),
      )}
    </div>
  );
}