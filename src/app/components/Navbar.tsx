"use client";

import Image from "next/image";
import Link from "next/link";
import {
  usePathname,
} from "next/navigation";
import {
  Bell,
  Bookmark,
  ChevronDown,
  Clock3,
  HardDrive,
  LogOut,
  Menu,
  MessageCircle,
  ShieldCheck,
  UserRound,
  X,
  PenLine,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import RoleBadge from "./ui/RoleBadge";
import VerifiedBadge from "./ui/VerifiedBadge";
import { createClient } from "../lib/supabase/client";

interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: string | null;
  verified: boolean;
}

interface NotificationActor {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  avatar_url: string | null;
  verified: boolean;
}

interface RecentNotification {
  id: string;
  type: string;
  message: string | null;
  read_at: string | null;
  created_at: string;
  post_id: string | null;
  comment_id: string | null;
  actor_id: string | null;
  actor: NotificationActor | null;
  post_slug: string | null;
}

const navLinks = [
  {
    label:
      "About",

    href:
      "/about",
  },

  {
    label:
      "Skills",

    href:
      "/skills",
  },

  {
    label:
      "Projects",

    href:
      "/projects",
  },

  {
    label:
      "Certifications",

    href:
      "/certifications",
  },

  {
    label:
      "Blog",

    href:
      "/blog",
  },

  {
    label:
      "Contact",

    href:
      "/contact",
  },
];

const MAIN_SITE_URL =
  "https://meetshawon.com";

const mainSiteHref = (
  href: string,
) => {
  if (href === "/") {
    return MAIN_SITE_URL;
  }

  return `${MAIN_SITE_URL}${href}`;
};

const NOTIFICATIONS_CHANGED_EVENT =
  "notifications-changed";

export default function Navbar() {
  const pathname =
    usePathname();

  const supabase =
    useMemo(
      () => createClient(),
      [],
    );

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    scrolled,
    setScrolled,
  ] = useState(false);

  const [
    accountOpen,
    setAccountOpen,
  ] = useState(false);

  const [
    loadingAuth,
    setLoadingAuth,
  ] = useState(true);

  const [
    profile,
    setProfile,
  ] = useState<ProfileData | null>(
    null,
  );

  const [
    unreadNotifications,
    setUnreadNotifications,
  ] = useState(0);

  const [
    recentNotifications,
    setRecentNotifications,
  ] = useState<RecentNotification[]>(
    [],
  );

  const [
    notificationOpen,
    setNotificationOpen,
  ] = useState(false);

  const [
    loadingNotifications,
    setLoadingNotifications,
  ] = useState(false);

  const [
    mobileProfileOpen,
    setMobileProfileOpen,
  ] = useState(false);

  const accountMenuRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const notificationMenuRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const mobileNotificationMenuRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 12,
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  // --------------------------------------------------
  // LOAD RECENT + UNREAD NOTIFICATIONS
  // --------------------------------------------------

  const loadNotifications =
    useCallback(
      async (
        currentUserId: string,
      ) => {
        setLoadingNotifications(
          true,
        );

        try {
          const {
            data:
              notificationRows,
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
              currentUserId,
            )
            .order(
              "created_at",
              {
                ascending: false,
              },
            )
            .limit(6);

          if (
            notificationsError
          ) {
            console.error(
              "Notifications could not be loaded:",
              notificationsError,
            );

            return;
          }

          const {
            count,
            error:
              unreadError,
          } = await supabase
            .from("notifications")
            .select("id", {
              count:
                "exact",
              head:
                true,
            })
            .eq(
              "recipient_id",
              currentUserId,
            )
            .is(
              "read_at",
              null,
            );

          if (unreadError) {
            console.error(
              "Unread notifications could not be loaded:",
              unreadError,
            );
          } else {
            setUnreadNotifications(
              count ?? 0,
            );
          }

          const rows =
            notificationRows ??
            [];

          const actorIds = [
            ...new Set(
              rows
                .map(
                  (item) =>
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

          const postIds = [
            ...new Set(
              rows
                .map(
                  (item) =>
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

          const actorMap =
            new Map<
              string,
              NotificationActor
            >();

          if (
            actorIds.length >
            0
          ) {
            const {
              data:
                actors,
              error:
                actorsError,
            } = await supabase
              .from(
                "profiles",
              )
              .select(`
                id,
                first_name,
                last_name,
                username,
                avatar_url,
                verified
              `)
              .in(
                "id",
                actorIds,
              );

            if (actorsError) {
              console.error(
                "Notification actors could not be loaded:",
                actorsError,
              );
            } else {
              (
                actors ?? []
              ).forEach(
                (
                  actor,
                ) => {
                  actorMap.set(
                    actor.id,
                    actor as NotificationActor,
                  );
                },
              );
            }
          }

          const postMap =
            new Map<
              string,
              string
            >();

          if (
            postIds.length >
            0
          ) {
            const {
              data:
                posts,
              error:
                postsError,
            } = await supabase
              .from("posts")
              .select(`
                id,
                slug
              `)
              .in(
                "id",
                postIds,
              );

            if (postsError) {
              console.error(
                "Notification posts could not be loaded:",
                postsError,
              );
            } else {
              (
                posts ?? []
              ).forEach(
                (
                  post,
                ) => {
                  postMap.set(
                    post.id,
                    post.slug,
                  );
                },
              );
            }
          }

          const enriched:
            RecentNotification[] =
            rows.map(
              (item) => ({
                ...item,

                actor:
                  item.actor_id
                    ? actorMap.get(
                        item.actor_id,
                      ) ??
                      null
                    : null,

                post_slug:
                  item.post_id
                    ? postMap.get(
                        item.post_id,
                      ) ??
                      null
                    : null,
              }),
            );

          setRecentNotifications(
            enriched,
          );
        } finally {
          setLoadingNotifications(
            false,
          );
        }
      },
      [
        supabase,
      ],
    );

  // --------------------------------------------------
  // LOAD AUTH + PROFILE
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const loadUser =
      async () => {
        try {
          const {
            data: { user },
          } =
            await supabase.auth.getUser();

          if (cancelled) {
            return;
          }

          if (!user) {
            setProfile(null);
            setUnreadNotifications(0);
            setRecentNotifications([]);
            setNotificationOpen(false);
            setLoadingAuth(false);
            return;
          }

          const {
            data,
            error,
          } = await supabase
            .from("profiles")
            .select(`
              id,
              first_name,
              last_name,
              username,
              avatar_url,
              role,
              verified
            `)
            .eq(
              "id",
              user.id,
            )
            .maybeSingle();

          if (error) {
            console.error(
              "Navbar profile load failed:",
              error,
            );

            setProfile(null);
            return;
          }

          if (cancelled) {
            return;
          }

          setProfile(
            data ?? null,
          );

          void loadNotifications(
            user.id,
          );
        } catch (error) {
          console.error(
            "Navbar auth load failed:",
            error,
          );
        } finally {
          if (!cancelled) {
            setLoadingAuth(false);
          }
        }
      };

    void loadUser();

    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        async (
          _event,
          session,
        ) => {
          if (!session?.user) {
            setProfile(null);
            setUnreadNotifications(0);
            setRecentNotifications([]);
            setNotificationOpen(false);
            setLoadingAuth(false);
            return;
          }

          const {
            data,
            error,
          } = await supabase
            .from("profiles")
            .select(`
              id,
              first_name,
              last_name,
              username,
              avatar_url,
              role,
              verified
            `)
            .eq(
              "id",
              session.user.id,
            )
            .maybeSingle();

          if (error) {
            console.error(
              "Navbar profile refresh failed:",
              error,
            );

            setProfile(null);
            setLoadingAuth(false);
            return;
          }

          setProfile(
            data ?? null,
          );

          void loadNotifications(
            session.user.id,
          );

          setLoadingAuth(false);
        },
      );

    return () => {
      cancelled = true;

      authListener.subscription.unsubscribe();
    };
  }, [
    loadNotifications,
    supabase,
  ]);

  // --------------------------------------------------
  // SYNC NOTIFICATIONS BETWEEN PAGE + NAVBAR
  // --------------------------------------------------

  useEffect(() => {
    if (!profile?.id) {
      return;
    }

    const userId =
      profile.id;

    const handleNotificationsChanged =
      (event: Event) => {
        const customEvent =
          event as CustomEvent<{
            source?: string;
          }>;

        if (
          customEvent.detail
            ?.source ===
          "navbar"
        ) {
          return;
        }

        void loadNotifications(
          userId,
        );
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
    profile?.id,
    loadNotifications,
  ]);

   // --------------------------------------------------
  // REALTIME NOTIFICATIONS
  // --------------------------------------------------

  useEffect(() => {
    if (!profile?.id) {
      return;
    }

    const userId =
      profile.id;

    let cancelled =
      false;

    const channel =
      supabase
        .channel(
          `notifications-insert-${userId}`,
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
              `recipient_id=eq.${userId}`,
          },
          () => {
            if (cancelled) {
              return;
            }

            void loadNotifications(
              userId,
            );

            window.dispatchEvent(
              new CustomEvent(
                NOTIFICATIONS_CHANGED_EVENT,
                {
                  detail: {
                    source:
                      "navbar",
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
            if (cancelled) {
              return;
            }

            if (
              status ===
              "CHANNEL_ERROR"
            ) {
              console.warn(
                "Notification realtime temporarily disconnected.",
                error ?? "",
              );

              return;
            }

            if (
              status ===
              "TIMED_OUT"
            ) {
              console.warn(
                "Notification realtime connection timed out temporarily.",
              );

              return;
            }

            if (
              status ===
              "CLOSED"
            ) {
              console.debug(
                "Notification realtime channel closed.",
              );
            }
          },
        );

    return () => {
      cancelled =
        true;

      void supabase.removeChannel(
        channel,
      );
    };
  }, [
    profile?.id,
    loadNotifications,
    supabase,
  ]);

  useEffect(() => {
    if (!profile?.id) {
      return;
    }

    const userId =
      profile.id;

    const handleFocus =
      () => {
        void loadNotifications(
          userId,
        );
      };

    window.addEventListener(
      "focus",
      handleFocus,
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus,
      );
    };
  }, [
    profile?.id,
    loadNotifications,
  ]);

  // --------------------------------------------------
  // CLOSE ACCOUNT MENU ON OUTSIDE CLICK
  // --------------------------------------------------

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setAccountOpen(false);
      }

      const target =
        event.target as Node;

      const clickedInsideDesktopNotifications =
        notificationMenuRef.current?.contains(
          target,
        ) ?? false;

      const clickedInsideMobileNotifications =
        mobileNotificationMenuRef.current?.contains(
          target,
        ) ?? false;

      if (
        !clickedInsideDesktopNotifications &&
        !clickedInsideMobileNotifications
      ) {
        setNotificationOpen(
          false,
        );
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  // --------------------------------------------------
  // MOBILE MENU SCROLL LOCK
  // --------------------------------------------------

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousBodyOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousBodyOverflow;
    };
  }, [
    mobileOpen,
  ]);

  // --------------------------------------------------
  // ACTIVE LINK
  // --------------------------------------------------

  const isActive = (
    href: string,
  ) => {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(
        `${href}/`,
      )
    );
  };

  // --------------------------------------------------
  // CLOSE MOBILE MENU
  // --------------------------------------------------

  const closeMobileMenu =
    () => {
      setMobileOpen(false);
      setNotificationOpen(false);
      setMobileProfileOpen(false);
    };

  // --------------------------------------------------
  // SIGN OUT
  // --------------------------------------------------

  const handleSignOut =
    async () => {
      try {
        await supabase.auth.signOut({
          scope: "local",
        });
      } catch (error) {
        console.error(
          "Navbar sign out failed:",
          error,
        );
      }

      setProfile(null);
      setUnreadNotifications(0);
      setRecentNotifications([]);
      setNotificationOpen(false);
      setMobileProfileOpen(false);
      setAccountOpen(false);
      setMobileOpen(false);

      window.location.href =
        `${MAIN_SITE_URL}/auth/sign-in`;
    };

  // --------------------------------------------------
  // NOTIFICATION HELPERS
  // --------------------------------------------------

  const formatNotificationTime =
    (
      value: string,
    ) => {
      const date =
        new Date(value);

      const now =
        new Date();

      const differenceMs =
        now.getTime() -
        date.getTime();

      const minute =
        60 * 1000;

      const hour =
        60 * minute;

      const day =
        24 * hour;

      if (
        differenceMs <
        minute
      ) {
        return "Just now";
      }

      if (
        differenceMs <
        hour
      ) {
        const minutes =
          Math.floor(
            differenceMs /
              minute,
          );

        return `${minutes}m ago`;
      }

      if (
        differenceMs <
        day
      ) {
        const hours =
          Math.floor(
            differenceMs /
              hour,
          );

        return `${hours}h ago`;
      }

      if (
        differenceMs <
        7 * day
      ) {
        const days =
          Math.floor(
            differenceMs /
              day,
          );

        return `${days}d ago`;
      }

      return new Intl.DateTimeFormat(
        "en-GB",
        {
          day: "numeric",
          month: "short",
        },
      ).format(
        date,
      );
    };

  const getNotificationHref =
    (
      notification:
        RecentNotification,
    ) => {
      if (
        notification.post_slug
      ) {
        if (
          notification.comment_id
        ) {
          return mainSiteHref(
            `/blog/${notification.post_slug}#comment-${notification.comment_id}`,
          );
        }

        return mainSiteHref(
          `/blog/${notification.post_slug}`,
        );
      }

      return mainSiteHref(
        "/account/notifications",
      );
    };

  const markNotificationRead =
    async (
      notification:
        RecentNotification,
    ) => {
      if (
        notification.read_at
      ) {
        return;
      }

      const {
        error,
      } = await supabase
        .from("notifications")
        .update({
          read_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          notification.id,
        );

      if (error) {
        console.error(
          "Notification could not be marked as read:",
          error,
        );

        return;
      }

      setRecentNotifications(
        (
          current,
        ) =>
          current.map(
            (item) =>
              item.id ===
              notification.id
                ? {
                    ...item,
                    read_at:
                      new Date().toISOString(),
                  }
                : item,
          ),
      );

      setUnreadNotifications(
        (
          current,
        ) =>
          Math.max(
            0,
            current - 1,
          ),
      );

      window.dispatchEvent(
        new CustomEvent(
          NOTIFICATIONS_CHANGED_EVENT,
          {
            detail: {
              source:
                "navbar",
            },
          },
        ),
      );
    };

  const markAllNotificationsRead =
    async () => {
      if (
        unreadNotifications ===
        0
      ) {
        return;
      }

      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const readAt =
        new Date().toISOString();

      const {
        error,
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

      if (error) {
        console.error(
          "Notifications could not be marked as read:",
          error,
        );

        return;
      }

      setUnreadNotifications(
        0,
      );

      setRecentNotifications(
        (
          current,
        ) =>
          current.map(
            (item) => ({
              ...item,
              read_at:
                item.read_at ??
                readAt,
            }),
          ),
      );

      window.dispatchEvent(
        new CustomEvent(
          NOTIFICATIONS_CHANGED_EVENT,
          {
            detail: {
              source:
                "navbar",
            },
          },
        ),
      );
    };

  // --------------------------------------------------
  // PROFILE DISPLAY
  // --------------------------------------------------

  const firstName =
    profile?.first_name?.trim() ??
    "";

  const lastName =
    profile?.last_name?.trim() ??
    "";

  const greetingName =
    firstName
      .split(/\s+/)
      .filter(Boolean)[0] ??
    "there";

  const fullName =
    [
      firstName,
      lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    profile?.username ||
    "Account";

  const initial =
    firstName
      .charAt(0)
      .toUpperCase() ||
    fullName
      .charAt(0)
      .toUpperCase() ||
    "U";

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="contents">
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-white/10 bg-[var(--background)]/[0.78] shadow-[0_10px_30px_rgba(0,0,0,0.22)]"
          : "border-transparent bg-[var(--background)]/[0.96] shadow-none"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          href={MAIN_SITE_URL}
          className="flex shrink-0 items-center"
          aria-label="Meet Shawon Home"
        >
          <Image
            src="/logo.png"
            alt="Meet Shawon"
            width={220}
            height={80}
            priority
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* =================================================
            DESKTOP RIGHT SIDE
        ================================================= */}

        <div className="hidden items-center gap-5 lg:flex">
          {/* Navigation */}

          <div className="flex items-center gap-1">
            {navLinks.map(
              (link) => {
                const active =
                  isActive(
                    link.href,
                  );

                return (
                  <Link
                    key={
                      link.href
                    }
                    href={
                      mainSiteHref(
                      link.href,
                    )
                    }
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition duration-200 ${
                      active
                        ? "bg-green-400/10 text-green-300"
                        : "text-gray-100 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {
                      link.label
                    }
                  </Link>
                );
              },
            )}
          </div>

          {/* Divider */}

          <div className="h-6 w-px bg-white/10" />

          {/* Account */}

          <div className="flex items-center gap-3">
            {loadingAuth ? (
              <div className="h-10 w-24 animate-pulse rounded-xl bg-white/5" />
            ) : !profile ? (
              <>
                <Link
                  href={mainSiteHref("/auth/sign-in")}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-100 transition duration-200 hover:bg-white/5 hover:text-white"
                >
                  Sign In
                </Link>

                <Link
                  href={mainSiteHref("/auth/sign-up")}
                  className="rounded-xl bg-green-500 px-4 py-2.5 text-sm font-medium text-black transition duration-200 hover:bg-green-400"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <div
                  ref={
                    notificationMenuRef
                  }
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setNotificationOpen(
                        (
                          current,
                        ) =>
                          !current,
                      );

                      setAccountOpen(
                        false,
                      );
                    }}
                    className="relative inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-200 transition duration-200 hover:border-green-400/30 hover:bg-white/[0.07] hover:text-white"
                    aria-label={
                      unreadNotifications > 0
                        ? `${unreadNotifications} unread notifications`
                        : "Notifications"
                    }
                    aria-haspopup="menu"
                    aria-expanded={
                      notificationOpen
                    }
                    title="Notifications"
                  >
                    <Bell
                      size={18}
                    />

                    {unreadNotifications > 0 && (
                      <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                        {unreadNotifications > 99
                          ? "99+"
                          : unreadNotifications}
                      </span>
                    )}
                  </button>

                  <div
                    className={`absolute right-0 mt-3 w-[360px] origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-[#102A2A] shadow-2xl transition-all duration-200 ${
                      notificationOpen
                        ? "visible scale-100 opacity-100"
                        : "invisible scale-95 opacity-0"
                    }`}
                    role="menu"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                      <div>
                        <p className="font-semibold text-white">
                          Notifications
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          {unreadNotifications > 0
                            ? `${unreadNotifications} unread`
                            : "You're all caught up"}
                        </p>
                      </div>

                      {unreadNotifications > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            void markAllNotificationsRead();
                          }}
                          className="text-xs font-medium text-green-400 transition hover:text-green-300"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-[420px] overflow-y-auto">
                      {loadingNotifications ? (
                        <div className="space-y-3 p-4">
                          {Array.from({
                            length: 3,
                          }).map(
                            (
                              _,
                              index,
                            ) => (
                              <div
                                key={
                                  index
                                }
                                className="h-16 animate-pulse rounded-xl bg-white/5"
                              />
                            ),
                          )}
                        </div>
                      ) : recentNotifications.length === 0 ? (
                        <div className="px-6 py-10 text-center">
                          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                            <Bell
                              size={20}
                            />
                          </div>

                          <p className="mt-4 font-medium text-white">
                            No notifications yet
                          </p>

                          <p className="mt-2 text-sm leading-6 text-gray-500">
                            Replies, reactions, and account updates will appear here.
                          </p>
                        </div>
                      ) : (
                        <div className="p-2">
                          {recentNotifications.map(
                            (
                              notification,
                            ) => {
                              const unread =
                                !notification.read_at;

                              const actorName =
                                notification.actor
                                  ? [
                                      notification.actor.first_name,
                                      notification.actor.last_name,
                                    ]
                                      .filter(Boolean)
                                      .join(" ") ||
                                    notification.actor.username ||
                                    null
                                  : null;

                              const notificationText =
                                notification.message ??
                                (actorName
                                  ? `${actorName} sent you a notification.`
                                  : "You have a new notification.");

                              return (
                                <Link
                                  key={
                                    notification.id
                                  }
                                  href={
                                    getNotificationHref(
                                      notification,
                                    )
                                  }
                                  onClick={() => {
                                    void markNotificationRead(
                                      notification,
                                    );

                                    setNotificationOpen(
                                      false,
                                    );
                                  }}
                                  className={`group flex gap-3 rounded-xl p-3 transition ${
                                    unread
                                      ? "bg-green-400/[0.06] hover:bg-green-400/[0.10]"
                                      : "hover:bg-white/5"
                                  }`}
                                >
                                  <div className="relative shrink-0">
                                    {notification.actor
                                      ?.avatar_url ? (
                                      <Image
                                        src={
                                          notification.actor
                                            .avatar_url
                                        }
                                        alt=""
                                        width={40}
                                        height={40}
                                        sizes="40px"
                                        className="h-10 w-10 rounded-full object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-400/10 text-sm font-semibold text-green-300">
                                        {actorName
                                          ?.charAt(
                                            0,
                                          )
                                          .toUpperCase() ??
                                          "N"}
                                      </div>
                                    )}

                                    {unread && (
                                      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#102A2A] bg-green-400" />
                                    )}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className={`text-sm leading-5 ${
                                      unread
                                        ? "font-medium text-white"
                                        : "text-gray-300"
                                    }`}>
                                      {
                                        notificationText
                                      }
                                    </p>

                                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-gray-500">
                                      <Clock3
                                        size={12}
                                      />

                                      {formatNotificationTime(
                                        notification.created_at,
                                      )}
                                    </p>
                                  </div>
                                </Link>
                              );
                            },
                          )}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-white/10 p-2">
                      <Link
                        href={
                          mainSiteHref(
                            "/account/notifications",
                          )
                        }
                        onClick={() =>
                          setNotificationOpen(
                            false,
                          )
                        }
                        className="block rounded-xl px-4 py-3 text-center text-sm font-semibold text-green-400 transition hover:bg-white/5 hover:text-green-300"
                      >
                        See all notifications
                      </Link>
                    </div>
                  </div>
                </div>

                <div
                  ref={
                    accountMenuRef
                  }
                  className="relative"
                >
                {/* Account trigger */}

                <button
                  type="button"
                  onClick={() => {
                    setAccountOpen(
                      (
                        current,
                      ) =>
                        !current,
                    );

                    setNotificationOpen(
                      false,
                    );
                  }}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1.5 pr-3 transition duration-200 hover:border-green-400/30 hover:bg-white/[0.07]"
                  aria-haspopup="menu"
                  aria-expanded={
                    accountOpen
                  }
                >
                  {profile.avatar_url ? (
                    <Image
                      src={
                        profile.avatar_url
                      }
                      alt={`${fullName} profile`}
                      width={32}
                      height={32}
                      sizes="32px"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-400/10 text-sm font-semibold text-green-300">
                      {
                        initial
                      }
                    </div>
                  )}

                  <span className="max-w-36 truncate text-sm font-medium text-white">
                    Hello, {greetingName}
                  </span>

                  <ChevronDown
                    size={15}
                    className={`text-gray-400 transition duration-200 ${
                      accountOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {/* =================================================
                    ACCOUNT DROPDOWN
                ================================================= */}

                <div
                  className={`absolute right-0 mt-3 w-72 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-[#102A2A] shadow-2xl transition-all duration-200 ${
                    accountOpen
                      ? "visible scale-100 opacity-100"
                      : "invisible scale-95 opacity-0"
                  }`}
                  role="menu"
                >
                  {/* Identity */}

                  <div className="border-b border-white/10 p-5">
                    <div className="flex items-center gap-3">
                      {profile.avatar_url ? (
                        <Image
                          src={
                            profile.avatar_url
                          }
                          alt={`${fullName} profile`}
                          width={44}
                          height={44}
                          sizes="44px"
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-400/10 font-semibold text-green-300">
                          {
                            initial
                          }
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="truncate font-medium text-white">
                            {
                              fullName
                            }
                          </p>

                          {profile.verified && (
                            <VerifiedBadge
                              size={
                                16
                              }
                            />
                          )}
                        </div>

                        {profile.username && (
                          <p className="mt-0.5 truncate text-xs text-gray-400">
                            @
                            {
                              profile.username
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      <RoleBadge
                        role={
                          profile.role
                        }
                        showUser
                      />
                    </div>
                  </div>

                  {/* Account links */}

                  <div className="p-2">
                    {profile.username && (
                      <Link
                        href={
                          mainSiteHref(
                            `/u/${profile.username}`,
                          )
                        }
                        role="menuitem"
                        onClick={() =>
                          setAccountOpen(
                            false,
                          )
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-200 transition hover:bg-white/5 hover:text-white"
                      >
                        <UserRound
                          size={
                            17
                          }
                        />

                        My Profile
                      </Link>
                    )}

                    <Link
                      href={mainSiteHref("/account")}
                      role="menuitem"
                      onClick={() =>
                        setAccountOpen(
                          false,
                        )
                      }
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-200 transition hover:bg-white/5 hover:text-white"
                    >
                      <UserRound
                        size={
                          17
                        }
                      />

                      Edit Profile
                    </Link>

                    <Link
                      href={mainSiteHref("/account/saved")}
                      role="menuitem"
                      onClick={() =>
                        setAccountOpen(
                          false,
                        )
                      }
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-200 transition hover:bg-white/5 hover:text-white"
                    >
                      <Bookmark
                        size={
                          17
                        }
                      />

                      Saved Articles
                    </Link>

                    <Link
                      href={mainSiteHref("/account/activity")}
                      role="menuitem"
                      onClick={() =>
                        setAccountOpen(
                          false,
                        )
                      }
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-200 transition hover:bg-white/5 hover:text-white"
                    >
                      <MessageCircle
                        size={
                          17
                        }
                      />

                      My Activity
                    </Link>

                    <Link
                      href={mainSiteHref("/account/security")}
                      role="menuitem"
                      onClick={() =>
                        setAccountOpen(
                          false,
                        )
                      }
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-200 transition hover:bg-white/5 hover:text-white"
                    >
                      <ShieldCheck
                        size={
                          17
                        }
                      />

                      Security
                    </Link>
                  </div>

                  {/* Staff dashboards */}

                  {(profile.role ===
                    "admin" ||
                    profile.role ===
                      "moderator" ||
                    profile.role ===
                      "author") && (
                    <div className="border-t border-white/10 p-2">
                      {profile.role ===
                        "admin" && (
                        <Link
                          href={mainSiteHref("/admin")}
                          role="menuitem"
                          onClick={() =>
                            setAccountOpen(
                              false,
                            )
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-amber-300 transition hover:bg-amber-400/10"
                        >
                          <ShieldCheck
                            size={
                              17
                            }
                          />

                          Admin Dashboard
                        </Link>
                      )}

                      {profile.role ===
                        "moderator" && (
                        <Link
                          href={mainSiteHref("/moderation")}
                          role="menuitem"
                          onClick={() =>
                            setAccountOpen(
                              false,
                            )
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-blue-300 transition hover:bg-blue-400/10"
                        >
                          <ShieldCheck
                            size={
                              17
                            }
                          />

                          Moderation Dashboard
                        </Link>
                      )}

                      {(profile.role ===
                        "admin" ||
                        profile.role ===
                          "author" ||
                        profile.role ===
                          "moderator") && (
                        <Link
                          href={mainSiteHref("/admin/posts")}
                          role="menuitem"
                          onClick={() =>
                            setAccountOpen(
                              false,
                            )
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-green-300 transition hover:bg-green-400/10"
                        >
                          <PenLine
                            size={17}
                          />

                          Blog Studio
                        </Link>
                      )}
                    </div>
                  )}

                  {(profile.role ===
                    "admin" ||
                    profile.role ===
                      "partner") && (
                    <div className="border-t border-white/10 p-2">
                      <a
                        href="https://drive.meetshawon.com"
                        rel="noopener noreferrer"
                        role="menuitem"
                        onClick={() =>
                          setAccountOpen(
                            false,
                          )
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sky-300 transition hover:bg-sky-400/10"
                      >
                        <HardDrive
                          size={
                            17
                          }
                        />

                        Drive
                      </a>
                    </div>
                  )}

                  {/* Sign out */}

                  <div className="border-t border-white/10 p-2">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        void handleSignOut();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-300 transition hover:bg-red-400/10"
                    >
                      <LogOut
                        size={
                          17
                        }
                      />

                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
              </>
            )}
          </div>
        </div>

        {/* =================================================
            MOBILE BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            setMobileOpen(
              (current) =>
                !current,
            )
          }
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-gray-100 transition duration-200 hover:border-green-400/30 hover:bg-white/5 hover:text-white lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={
            mobileOpen
          }
        >
          <span className="relative flex h-5 w-5 items-center justify-center">
            <Menu
              size={21}
              className={`absolute transition-all duration-300 ${
                mobileOpen
                  ? "rotate-90 scale-75 opacity-0"
                  : "rotate-0 scale-100 opacity-100"
              }`}
            />

            <X
              size={21}
              className={`absolute transition-all duration-300 ${
                mobileOpen
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-75 opacity-0"
              }`}
            />
          </span>
        </button>
      </nav>

      {/* =================================================
          MOBILE NAVIGATION
      ================================================= */}

      <div
        className={`absolute inset-x-0 top-full z-40 h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain border-t bg-[var(--background)]/98 shadow-2xl backdrop-blur-xl transition duration-300 ease-out lg:hidden ${
          mobileOpen
            ? "visible translate-y-0 border-white/5 opacity-100"
            : "invisible pointer-events-none -translate-y-2 border-transparent opacity-0"
        }`}
      >
        <div className="px-6 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5">
          <div className="mx-auto max-w-7xl">
            {/* Main navigation */}

            <div className="space-y-1">
              {navLinks.map(
                (link) => {
                  const active =
                    isActive(
                      link.href,
                    );

                  return (
                    <Link
                      key={
                        link.href
                      }
                      href={
                        mainSiteHref(
                          link.href,
                        )
                      }
                      onClick={
                        closeMobileMenu
                      }
                      className={`block rounded-xl px-4 py-3 text-sm font-medium transition duration-200 ${
                        active
                          ? "bg-green-400/10 text-green-300"
                          : "text-gray-100 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {
                        link.label
                      }
                    </Link>
                  );
                },
              )}
            </div>

            {/* =================================================
                MOBILE ACCOUNT
            ================================================= */}

            <div className="mt-5 border-t border-white/10 pt-5">
              {loadingAuth ? (
                <div className="h-12 animate-pulse rounded-xl bg-white/5" />
              ) : !profile ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link
                    href={mainSiteHref("/auth/sign-in")}
                    onClick={
                      closeMobileMenu
                    }
                    className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-medium text-gray-100 transition duration-200 hover:border-green-400/30 hover:bg-white/5 hover:text-white"
                  >
                    Sign In
                  </Link>

                  <Link
                    href={mainSiteHref("/auth/sign-up")}
                    onClick={
                      closeMobileMenu
                    }
                    className="rounded-xl bg-green-500 px-4 py-3 text-center text-sm font-medium text-black transition duration-200 hover:bg-green-400"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* =================================================
                      MOBILE NOTIFICATIONS
                  ================================================= */}

                  <div
                    ref={
                      mobileNotificationMenuRef
                    }
                    className="rounded-xl border border-white/10 bg-black/10"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setNotificationOpen(
                          (
                            current,
                          ) =>
                            !current,
                        );

                        setMobileProfileOpen(
                          false,
                        );
                      }}
                      className="flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm text-gray-100 transition duration-200 hover:bg-white/5 hover:text-white"
                      aria-expanded={
                        notificationOpen
                      }
                    >
                      <span className="flex items-center gap-3">
                        <Bell
                          size={17}
                        />

                        Notifications
                      </span>

                      <span className="flex items-center gap-2">
                        {unreadNotifications > 0 && (
                          <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                            {unreadNotifications > 99
                              ? "99+"
                              : unreadNotifications}
                          </span>
                        )}

                        <ChevronDown
                          size={15}
                          className={`text-gray-500 transition-transform duration-300 ${
                            notificationOpen
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </span>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-out ${
                        notificationOpen
                          ? "max-h-[560px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="border-t border-white/10 p-2">
                        {loadingNotifications ? (
                          <div className="space-y-2 py-1">
                            {Array.from({
                              length: 3,
                            }).map(
                              (
                                _,
                                index,
                              ) => (
                                <div
                                  key={
                                    index
                                  }
                                  className="h-14 animate-pulse rounded-lg bg-white/5"
                                />
                              ),
                            )}
                          </div>
                        ) : recentNotifications.length === 0 ? (
                          <p className="px-3 py-4 text-center text-sm text-gray-500">
                            No notifications yet.
                          </p>
                        ) : (
                          <div className="space-y-1">
                            {recentNotifications
                              .slice(
                                0,
                                4,
                              )
                              .map(
                                (
                                  notification,
                                ) => {
                                  const unread =
                                    !notification.read_at;

                                  const actorName =
                                    notification.actor
                                      ? [
                                          notification.actor.first_name,
                                          notification.actor.last_name,
                                        ]
                                          .filter(Boolean)
                                          .join(" ") ||
                                        notification.actor.username ||
                                        null
                                      : null;

                                  return (
                                    <Link
                                      key={
                                        notification.id
                                      }
                                      href={
                                        getNotificationHref(
                                          notification,
                                        )
                                      }
                                      onClick={() => {
                                        void markNotificationRead(
                                          notification,
                                        );

                                        closeMobileMenu();
                                      }}
                                      className={`block rounded-lg px-3 py-3 text-sm transition ${
                                        unread
                                          ? "bg-green-400/[0.06] text-white"
                                          : "text-gray-300 hover:bg-white/5"
                                      }`}
                                    >
                                      <p className="leading-5">
                                        {notification.message ??
                                          (actorName
                                            ? `${actorName} sent you a notification.`
                                            : "You have a new notification.")}
                                      </p>

                                      <p className="mt-1 text-xs text-gray-500">
                                        {formatNotificationTime(
                                          notification.created_at,
                                        )}
                                      </p>
                                    </Link>
                                  );
                                },
                              )}
                          </div>
                        )}

                        {unreadNotifications > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              void markAllNotificationsRead();
                            }}
                            className="mt-2 w-full cursor-pointer rounded-lg px-3 py-2.5 text-center text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
                          >
                            Mark all as read
                          </button>
                        )}

                        <Link
                          href={mainSiteHref("/account/notifications")}
                          onClick={
                            closeMobileMenu
                          }
                          className="mt-1 block rounded-lg px-3 py-2.5 text-center text-sm font-medium text-green-400 transition hover:bg-white/5 hover:text-green-300"
                        >
                          See all notifications
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      MOBILE PROFILE DROPDOWN
                  ================================================= */}

                  <div className="rounded-xl border border-white/10 bg-black/10">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileProfileOpen(
                          (
                            current,
                          ) =>
                            !current,
                        );

                        setNotificationOpen(
                          false,
                        );
                      }}
                      className="flex w-full cursor-pointer items-center justify-between rounded-xl p-3 text-left transition duration-200 hover:bg-white/5"
                      aria-expanded={
                        mobileProfileOpen
                      }
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {profile.avatar_url ? (
                          <Image
                            src={
                              profile.avatar_url
                            }
                            alt={`${fullName} profile`}
                            width={44}
                            height={44}
                            sizes="44px"
                            className="h-11 w-11 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-400/10 font-semibold text-green-300">
                            {
                              initial
                            }
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="truncate font-medium text-white">
                              {
                                fullName
                              }
                            </p>

                            {profile.verified && (
                              <VerifiedBadge
                                size={
                                  16
                                }
                              />
                            )}
                          </div>

                          {profile.username && (
                            <p className="mt-0.5 truncate text-xs text-gray-400">
                              @
                              {
                                profile.username
                              }
                            </p>
                          )}

                          <div className="mt-2">
                            <RoleBadge
                              role={
                                profile.role
                              }
                              showUser
                            />
                          </div>
                        </div>
                      </div>

                      <ChevronDown
                        size={17}
                        className={`shrink-0 text-gray-500 transition-transform duration-300 ${
                          mobileProfileOpen
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-out ${
                        mobileProfileOpen
                          ? "max-h-[650px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="space-y-1 border-t border-white/10 p-2">
                        {profile.username && (
                          <Link
                            href={
                              mainSiteHref(
                                `/u/${profile.username}`,
                              )
                            }
                            onClick={
                              closeMobileMenu
                            }
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-100 transition duration-200 hover:bg-white/5 hover:text-white"
                          >
                            <UserRound
                              size={
                                17
                              }
                            />

                            My Profile
                          </Link>
                        )}

                        <Link
                          href={mainSiteHref("/account")}
                          onClick={
                            closeMobileMenu
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-100 transition duration-200 hover:bg-white/5 hover:text-white"
                        >
                          <UserRound
                            size={
                              17
                            }
                          />

                          Edit Profile
                        </Link>

                        <Link
                          href={mainSiteHref("/account/saved")}
                          onClick={
                            closeMobileMenu
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-100 transition duration-200 hover:bg-white/5 hover:text-white"
                        >
                          <Bookmark
                            size={
                              17
                            }
                          />

                          Saved Articles
                        </Link>

                        <Link
                          href={mainSiteHref("/account/activity")}
                          onClick={
                            closeMobileMenu
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-100 transition duration-200 hover:bg-white/5 hover:text-white"
                        >
                          <MessageCircle
                            size={
                              17
                            }
                          />

                          My Activity
                        </Link>

                        <Link
                          href={mainSiteHref("/account/security")}
                          onClick={
                            closeMobileMenu
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-100 transition duration-200 hover:bg-white/5 hover:text-white"
                        >
                          <ShieldCheck
                            size={
                              17
                            }
                          />

                          Security
                        </Link>

                        {(profile.role ===
                          "admin" ||
                          profile.role ===
                            "author" ||
                          profile.role ===
                            "moderator") && (
                          <Link
                            href={mainSiteHref("/admin/posts")}
                            onClick={
                              closeMobileMenu
                            }
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-green-300 transition duration-200 hover:bg-green-400/10"
                          >
                            <PenLine
                              size={
                                17
                              }
                            />

                            Blog Studio
                          </Link>
                        )}

                        {profile.role ===
                          "admin" && (
                          <Link
                            href={mainSiteHref("/admin")}
                            onClick={
                              closeMobileMenu
                            }
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-amber-300 transition duration-200 hover:bg-amber-400/10"
                          >
                            <ShieldCheck
                              size={
                                17
                              }
                            />

                            Admin Dashboard
                          </Link>
                        )}

                        {profile.role ===
                          "moderator" && (
                          <Link
                            href={mainSiteHref("/moderation")}
                            onClick={
                              closeMobileMenu
                            }
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-blue-300 transition duration-200 hover:bg-blue-400/10"
                          >
                            <ShieldCheck
                              size={
                                17
                              }
                            />

                            Moderation Dashboard
                          </Link>
                        )}

                        {(profile.role ===
                          "admin" ||
                          profile.role ===
                            "partner") && (
                          <a
                            href="https://drive.meetshawon.com"
                            rel="noopener noreferrer"
                            onClick={
                              closeMobileMenu
                            }
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-sky-300 transition duration-200 hover:bg-sky-400/10"
                          >
                            <HardDrive
                              size={
                                17
                              }
                            />

                            Drive
                          </a>
                        )}

                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              void handleSignOut();
                            }}
                            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-red-300 transition duration-200 hover:bg-red-400/10"
                          >
                            <LogOut
                              size={
                                17
                              }
                            />

                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>

    {/* Preserve the fixed header's place in the page flow on every screen size. */}
    <div className="h-[72px]" aria-hidden="true" />
    </div>
  );
}
