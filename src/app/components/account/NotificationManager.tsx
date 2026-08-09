"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCheck,
  Heart,
  MessageCircleReply,
  ShieldCheck,
  Trash2,
  UserCog,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createClient } from "../../lib/supabase/client";
import VerifiedBadge from "../ui/VerifiedBadge";

interface NotificationActor {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  verified: boolean;
  role: string | null;
}

interface NotificationPost {
  id: string;
  title: string;
  slug: string;
}

interface NotificationItem {
  id: string;
  type: string;
  message: string | null;
  read_at: string | null;
  created_at: string;
  post_id: string | null;
  comment_id: string | null;
  actor_id: string | null;
  actor: NotificationActor | null;
  post: NotificationPost | null;
}

interface NotificationManagerProps {
  initialNotifications: NotificationItem[];
}

function formatDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(
    new Date(value),
  );
}

function getNotificationIcon(
  type: string,
) {
  switch (type) {
    case "comment_reply":
      return (
        <MessageCircleReply
          size={18}
        />
      );

    case "comment_reaction":
    case "post_reaction":
      return (
        <Heart
          size={18}
        />
      );

    case "verification":
      return (
        <ShieldCheck
          size={18}
        />
      );

    case "moderation":
      return (
        <UserCog
          size={18}
        />
      );

    default:
      return (
        <Bell
          size={18}
        />
      );
  }
}

function getNotificationHref(
  notification: NotificationItem,
) {
  if (
    notification.post?.slug
  ) {
    if (
      notification.comment_id
    ) {
      return `/blog/${notification.post.slug}#comment-${notification.comment_id}`;
    }

    return `/blog/${notification.post.slug}`;
  }

  return null;
}

const NOTIFICATIONS_CHANGED_EVENT =
  "notifications-changed";

export default function NotificationManager({
  initialNotifications,
}: NotificationManagerProps) {
  const supabase =
    useMemo(
      () => createClient(),
      [],
    );

  const router =
    useRouter();

  const [
    notifications,
    setNotifications,
  ] = useState(
    initialNotifications,
  );

  const [
    workingId,
    setWorkingId,
  ] = useState<string | null>(
    null,
  );

  const [
    bulkWorking,
    setBulkWorking,
  ] = useState(false);

  const [
    clearConfirmOpen,
    setClearConfirmOpen,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  // --------------------------------------------------
  // SYNC CHANGES MADE FROM NAVBAR
  // --------------------------------------------------

  useEffect(() => {
    const handleNotificationsChanged =
      (event: Event) => {
        const customEvent =
          event as CustomEvent<{
            source?: string;
          }>;

        if (
          customEvent.detail
            ?.source ===
          "manager"
        ) {
          return;
        }

        router.refresh();
      };

    window.addEventListener(
      NOTIFICATIONS_CHANGED_EVENT,
      handleNotificationsChanged,
    );

    return () => {
      window.removeEventListener(
        NOTIFICATIONS_CHANGED_EVENT,
        handleNotificationsChanged,
      );
    };
  }, [
    router,
  ]);

  const notifyNavbar =
    () => {
      window.dispatchEvent(
        new CustomEvent(
          NOTIFICATIONS_CHANGED_EVENT,
          {
            detail: {
              source:
                "manager",
            },
          },
        ),
      );
    };

  const unreadCount =
    notifications.filter(
      (item) =>
        !item.read_at,
    ).length;

  // --------------------------------------------------
  // MARK ONE READ
  // --------------------------------------------------

  const markRead =
    async (
      notification:
        NotificationItem,
    ) => {
      if (
        notification.read_at
      ) {
        return;
      }

      setError("");
      setWorkingId(
        notification.id,
      );

      const readAt =
        new Date().toISOString();

      const {
        error:
          updateError,
      } = await supabase
        .from("notifications")
        .update({
          read_at:
            readAt,
        })
        .eq(
          "id",
          notification.id,
        );

      if (updateError) {
        setError(
          updateError.message,
        );

        setWorkingId(
          null,
        );

        return;
      }

      setNotifications(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              notification.id
                ? {
                    ...item,
                    read_at:
                      readAt,
                  }
                : item,
          ),
      );

      notifyNavbar();

      setWorkingId(
        null,
      );
    };

  // --------------------------------------------------
  // MARK ALL READ
  // --------------------------------------------------

  const markAllRead =
    async () => {
      if (
        unreadCount === 0
      ) {
        return;
      }

      setError("");
      setBulkWorking(true);

      const readAt =
        new Date().toISOString();

      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (!user) {
        setError(
          "You are no longer signed in.",
        );

        setBulkWorking(false);
        return;
      }

      const {
        error:
          updateError,
      } = await supabase
        .from("notifications")
        .update({
          read_at:
            readAt,
        })
        .eq(
          "recipient_id",
          user.id,
        )
        .is(
          "read_at",
          null,
        );

      if (updateError) {
        setError(
          updateError.message,
        );

        setBulkWorking(false);
        return;
      }

      setNotifications(
        (current) =>
          current.map(
            (item) => ({
              ...item,
              read_at:
                item.read_at ??
                readAt,
            }),
          ),
      );

      notifyNavbar();

      setBulkWorking(false);
    };

  // --------------------------------------------------
  // DELETE ONE
  // --------------------------------------------------

  const deleteNotification =
    async (
      id: string,
    ) => {
      setError("");
      setWorkingId(id);

      const {
        error:
          deleteError,
      } = await supabase
        .from("notifications")
        .delete()
        .eq(
          "id",
          id,
        );

      if (deleteError) {
        setError(
          deleteError.message,
        );

        setWorkingId(
          null,
        );

        return;
      }

      setNotifications(
        (current) =>
          current.filter(
            (item) =>
              item.id !== id,
          ),
      );

      notifyNavbar();

      setWorkingId(
        null,
      );
    };

  // --------------------------------------------------
  // CLEAR ALL
  // --------------------------------------------------

  const requestClearAll =
    () => {
      if (
        notifications.length ===
        0
      ) {
        return;
      }

      setClearConfirmOpen(
        true,
      );
    };

  const clearAll =
    async () => {
      if (
        notifications.length ===
        0
      ) {
        setClearConfirmOpen(
          false,
        );

        return;
      }

      setError("");
      setBulkWorking(true);

      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (!user) {
        setError(
          "You are no longer signed in.",
        );

        setBulkWorking(false);
        return;
      }

      const {
        error:
          deleteError,
      } = await supabase
        .from("notifications")
        .delete()
        .eq(
          "recipient_id",
          user.id,
        );

      if (deleteError) {
        setError(
          deleteError.message,
        );

        setBulkWorking(false);
        return;
      }

      setNotifications([]);

      notifyNavbar();

      setClearConfirmOpen(
        false,
      );

      setBulkWorking(false);
    };

  return (
    <div>
      {/* =================================================
          SUMMARY + ACTIONS
      ================================================= */}

      <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-sm text-gray-500">
              Total
            </p>

            <p className="mt-1 text-2xl font-semibold text-white">
              {
                notifications.length
              }
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Unread
            </p>

            <p className="mt-1 text-2xl font-semibold text-green-300">
              {
                unreadCount
              }
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={
              bulkWorking ||
              unreadCount === 0
            }
            onClick={() => {
              void markAllRead();
            }}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-200 transition hover:border-green-400/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCheck
              size={16}
            />

            Mark all read
          </button>

          <button
            type="button"
            disabled={
              bulkWorking ||
              notifications.length ===
                0
            }
            onClick={() => {
              requestClearAll();
            }}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-red-400/20 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2
              size={16}
            />

            Clear all
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {
            error
          }
        </div>
      )}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {notifications.length ===
      0 ? (
        <div className="mt-6 rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-10 text-center md:p-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-400/10 text-green-300">
            <Bell
              size={28}
            />
          </div>

          <h2 className="mt-6 text-2xl font-semibold text-white">
            No notifications yet
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-400">
            Replies, reactions, verification updates, role changes, and other
            account events will appear here.
          </p>
        </div>
      ) : (
        /* =================================================
            LIST
        ================================================= */

        <div className="mt-6 space-y-3">
          {notifications.map(
            (
              notification,
            ) => {
              const unread =
                !notification.read_at;

              const actorName =
                notification.actor
                  ?.display_name ??
                notification.actor
                  ?.username ??
                null;

              const href =
                getNotificationHref(
                  notification,
                );

              const content = (
                <>
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      unread
                        ? "bg-green-400/10 text-green-300"
                        : "bg-white/5 text-gray-500"
                    }`}
                  >
                    {getNotificationIcon(
                      notification.type,
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {notification.actor &&
                        actorName && (
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white">
                            {
                              actorName
                            }

                            {notification.actor
                              .verified && (
                              <VerifiedBadge
                                size={
                                  14
                                }
                              />
                            )}
                          </span>
                        )}

                      {unread && (
                        <span className="rounded-full border border-green-400/20 bg-green-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-300">
                          New
                        </span>
                      )}
                    </div>

                    <p
                      className={`mt-1 leading-6 ${
                        unread
                          ? "text-gray-200"
                          : "text-gray-400"
                      }`}
                    >
                      {notification.message ??
                        "You have a new notification."}
                    </p>

                    {notification.post && (
                      <p className="mt-2 truncate text-sm text-gray-500">
                        {
                          notification.post
                            .title
                        }
                      </p>
                    )}

                    <p className="mt-2 text-xs text-gray-600">
                      {formatDate(
                        notification.created_at,
                      )}
                    </p>
                  </div>
                </>
              );

              return (
                <article
                  key={
                    notification.id
                  }
                  className={`flex flex-col gap-4 rounded-2xl border p-4 transition md:flex-row md:items-start ${
                    unread
                      ? "border-green-400/20 bg-green-400/[0.04]"
                      : "border-white/10 bg-[var(--surface)]/70"
                  }`}
                >
                  {href ? (
                    <Link
                      href={
                        href
                      }
                      onClick={() => {
                        void markRead(
                          notification,
                        );
                      }}
                      className="flex min-w-0 flex-1 gap-4 rounded-xl"
                    >
                      {
                        content
                      }
                    </Link>
                  ) : (
                    <div className="flex min-w-0 flex-1 gap-4">
                      {
                        content
                      }
                    </div>
                  )}

                  <div className="flex shrink-0 items-center gap-2 md:pt-1">
                    {unread && (
                      <button
                        type="button"
                        disabled={
                          workingId ===
                          notification.id
                        }
                        onClick={() => {
                          void markRead(
                            notification,
                          );
                        }}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-gray-300 transition hover:border-green-400/30 hover:text-green-300 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Check
                          size={14}
                        />

                        Mark read
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={
                        workingId ===
                        notification.id
                      }
                      onClick={() => {
                        void deleteNotification(
                          notification.id,
                        );
                      }}
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-red-400/10 text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Delete notification"
                      title="Delete notification"
                    >
                      <Trash2
                        size={15}
                      />
                    </button>
                  </div>
                </article>
              );
            },
          )}
        </div>
      )}

      {/* =================================================
          CLEAR ALL CONFIRMATION
      ================================================= */}

      {clearConfirmOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !bulkWorking
            ) {
              setClearConfirmOpen(
                false,
              );
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-notifications-title"
            className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#102A2A] shadow-2xl"
          >
            <div className="p-6 md:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-red-300">
                <AlertTriangle
                  size={22}
                />
              </div>

              <h2
                id="clear-notifications-title"
                className="mt-5 text-2xl font-semibold text-white"
              >
                Clear all notifications?
              </h2>

              <p className="mt-3 leading-7 text-gray-400">
                This will permanently remove all{" "}
                <span className="font-medium text-white">
                  {notifications.length}
                </span>{" "}
                notification
                {notifications.length === 1
                  ? ""
                  : "s"}{" "}
                from your account.
              </p>

              <div className="mt-5 rounded-2xl border border-red-400/10 bg-red-400/[0.05] p-4">
                <p className="text-sm leading-6 text-red-200/80">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/10 p-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={
                  bulkWorking
                }
                onClick={() => {
                  setClearConfirmOpen(
                    false,
                  );
                }}
                className="cursor-pointer rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  bulkWorking
                }
                onClick={() => {
                  void clearAll();
                }}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2
                  size={16}
                />

                {bulkWorking
                  ? "Clearing..."
                  : "Clear All"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}