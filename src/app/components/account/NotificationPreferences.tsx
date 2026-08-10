"use client";

import {
  BellRing,
  Heart,
  MessageCircleReply,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import { createClient } from "../../lib/supabase/client";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

interface Preferences {
  comment_replies: boolean;
  comment_reactions: boolean;
  post_reactions: boolean;
  verification_updates: boolean;
  moderation_updates: boolean;
  system_notifications: boolean;
}

interface PreferenceRowProps {
  title: string;
  description: string;
  icon: ReactNode;
  enabled: boolean;
  saving: boolean;
  onToggle: () => void;
}

// --------------------------------------------------
// DEFAULTS
// --------------------------------------------------

const defaultPreferences: Preferences = {
  comment_replies: true,
  comment_reactions: true,
  post_reactions: true,
  verification_updates: true,
  moderation_updates: true,
  system_notifications: true,
};

// --------------------------------------------------
// PREFERENCE ROW
// --------------------------------------------------

function PreferenceRow({
  title,
  description,
  icon,
  enabled,
  saving,
  onToggle,
}: PreferenceRowProps) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-white/5 py-5 last:border-b-0">
      {/* Icon */}

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-300">
        {icon}
      </div>

      {/* Text */}

      <div className="min-w-0">
        <p className="font-medium text-white">
          {title}
        </p>

        <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">
          {description}
        </p>
      </div>

      {/* Toggle */}

      <button
        type="button"
        disabled={saving}
        onClick={onToggle}
        className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
          enabled
            ? "bg-green-500"
            : "bg-white/15"
        } disabled:cursor-not-allowed disabled:opacity-50`}
        aria-pressed={enabled}
        aria-label={`${title}: ${
          enabled
            ? "On"
            : "Off"
        }`}
      >
        <span
          className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
            enabled
              ? "translate-x-5"
              : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

// --------------------------------------------------
// COMPONENT
// --------------------------------------------------

export default function NotificationPreferences() {
  const supabase =
    useMemo(
      () => createClient(),
      [],
    );

  const [
    preferences,
    setPreferences,
  ] =
    useState<Preferences>(
      defaultPreferences,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    savingKey,
    setSavingKey,
  ] =
    useState<
      keyof Preferences | null
    >(null);

  const [
    error,
    setError,
  ] =
    useState("");

  // --------------------------------------------------
  // LOAD
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const loadPreferences =
      async () => {
        try {
          const {
            data: {
              user,
            },
            error:
              userError,
          } =
            await supabase.auth.getUser();

          if (
            userError ||
            !user
          ) {
            if (!cancelled) {
              setError(
                "Your notification preferences could not be loaded.",
              );
            }

            return;
          }

          const {
            data,
            error:
              loadError,
          } = await supabase
            .from(
              "notification_preferences",
            )
            .select(`
              comment_replies,
              comment_reactions,
              post_reactions,
              verification_updates,
              moderation_updates,
              system_notifications
            `)
            .eq(
              "user_id",
              user.id,
            )
            .maybeSingle();

          if (
            loadError
          ) {
            console.error(
              "Notification preferences load error:",
              loadError,
            );

            if (
              !cancelled
            ) {
              setError(
                "Notification preferences could not be loaded.",
              );
            }

            return;
          }

          if (
            cancelled
          ) {
            return;
          }

          if (
            data
          ) {
            setPreferences({
              comment_replies:
                data.comment_replies ??
                true,

              comment_reactions:
                data.comment_reactions ??
                true,

              post_reactions:
                data.post_reactions ??
                true,

              verification_updates:
                data.verification_updates ??
                true,

              moderation_updates:
                data.moderation_updates ??
                true,

              system_notifications:
                data.system_notifications ??
                true,
            });
          }
        } catch (
          loadException
        ) {
          console.error(
            "Notification preferences failed:",
            loadException,
          );

          if (
            !cancelled
          ) {
            setError(
              "Notification preferences could not be loaded.",
            );
          }
        } finally {
          if (
            !cancelled
          ) {
            setLoading(
              false,
            );
          }
        }
      };

    void loadPreferences();

    return () => {
      cancelled = true;
    };
  }, [
    supabase,
  ]);

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  const updatePreference =
    async (
      key:
        keyof Preferences,
    ) => {
      setError("");
      setSavingKey(
        key,
      );

      try {
        const {
          data: {
            user,
          },
          error:
            userError,
        } =
          await supabase.auth.getUser();

        if (
          userError ||
          !user
        ) {
          setError(
            "You are no longer signed in.",
          );

          return;
        }

        const updatedPreferences:
          Preferences = {
          ...preferences,

          [key]:
            !preferences[
              key
            ],
        };

        const {
          error:
            saveError,
        } = await supabase
          .from(
            "notification_preferences",
          )
          .upsert(
            {
              user_id:
                user.id,

              ...updatedPreferences,

              updated_at:
                new Date().toISOString(),
            },
            {
              onConflict:
                "user_id",
            },
          );

        if (
          saveError
        ) {
          console.error(
            "Notification preference save error:",
            saveError,
          );

          setError(
            "Your notification preference could not be saved.",
          );

          return;
        }

        setPreferences(
          updatedPreferences,
        );
      } catch (
        saveException
      ) {
        console.error(
          "Notification preference save failed:",
          saveException,
        );

        setError(
          "Your notification preference could not be saved.",
        );
      } finally {
        setSavingKey(
          null,
        );
      }
    };

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <section className="w-full rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-green-400">
          Preferences
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          Notification Settings
        </h2>

        <p className="mt-3 max-w-2xl leading-7 text-gray-400">
          Choose which types of activity should generate notifications for your
          account.
        </p>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-6 space-y-3">
          {Array.from({
            length: 6,
          }).map(
            (
              _,
              index,
            ) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-xl bg-white/5"
              />
            ),
          )}
        </div>
      ) : (
        <div className="mt-6">
          <PreferenceRow
            title="Comment replies"
            description="Notify me when another user replies to one of my comments."
            icon={
              <MessageCircleReply
                size={18}
              />
            }
            enabled={
              preferences.comment_replies
            }
            saving={
              savingKey ===
              "comment_replies"
            }
            onToggle={() => {
              void updatePreference(
                "comment_replies",
              );
            }}
          />

          <PreferenceRow
            title="Comment reactions"
            description="Notify me when another user reacts to one of my comments."
            icon={
              <Heart
                size={18}
              />
            }
            enabled={
              preferences.comment_reactions
            }
            saving={
              savingKey ===
              "comment_reactions"
            }
            onToggle={() => {
              void updatePreference(
                "comment_reactions",
              );
            }}
          />

          <PreferenceRow
            title="Post reactions"
            description="Notify me when users react to content connected to my account."
            icon={
              <Heart
                size={18}
              />
            }
            enabled={
              preferences.post_reactions
            }
            saving={
              savingKey ===
              "post_reactions"
            }
            onToggle={() => {
              void updatePreference(
                "post_reactions",
              );
            }}
          />

          <PreferenceRow
            title="Verification updates"
            description="Notify me when my profile verification status changes."
            icon={
              <ShieldCheck
                size={18}
              />
            }
            enabled={
              preferences.verification_updates
            }
            saving={
              savingKey ===
              "verification_updates"
            }
            onToggle={() => {
              void updatePreference(
                "verification_updates",
              );
            }}
          />

          <PreferenceRow
            title="Role and moderation updates"
            description="Notify me when my account role or moderation status changes."
            icon={
              <UserCog
                size={18}
              />
            }
            enabled={
              preferences.moderation_updates
            }
            saving={
              savingKey ===
              "moderation_updates"
            }
            onToggle={() => {
              void updatePreference(
                "moderation_updates",
              );
            }}
          />

          <PreferenceRow
            title="System notifications"
            description="Receive important service and account announcements."
            icon={
              <BellRing
                size={18}
              />
            }
            enabled={
              preferences.system_notifications
            }
            saving={
              savingKey ===
              "system_notifications"
            }
            onToggle={() => {
              void updatePreference(
                "system_notifications",
              );
            }}
          />
        </div>
      )}
    </section>
  );
}