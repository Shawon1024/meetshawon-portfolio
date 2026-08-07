"use client";

import Link from "next/link";
import {
  Bookmark,
  BookmarkCheck,
  Loader2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createClient } from "../../lib/supabase/client";

interface BookmarkButtonProps {
  postId: string;
}

export default function BookmarkButton({
  postId,
}: BookmarkButtonProps) {
  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const [userId, setUserId] =
    useState<string | null>(null);

  const [
    bookmarkId,
    setBookmarkId,
  ] = useState<string | null>(
    null,
  );

  const [loading, setLoading] =
    useState(true);

  const [working, setWorking] =
    useState(false);

  const [error, setError] =
    useState("");

  // --------------------------------------------------
  // LOAD CURRENT BOOKMARK STATE
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const loadBookmark =
      async () => {
        setLoading(true);
        setError("");

        try {
          const {
            data: { user },
          } =
            await supabase.auth.getUser();

          if (cancelled) {
            return;
          }

          // Signed-out visitors are allowed.
          if (!user) {
            setUserId(null);
            setBookmarkId(null);
            return;
          }

          setUserId(user.id);

          const {
            data,
            error,
          } = await supabase
            .from("bookmarks")
            .select("id")
            .eq(
              "user_id",
              user.id,
            )
            .eq(
              "post_id",
              postId,
            )
            .maybeSingle();

          if (error) {
            throw error;
          }

          if (cancelled) {
            return;
          }

          setBookmarkId(
            data?.id ?? null,
          );
        } catch (error) {
          if (cancelled) {
            return;
          }

          console.error(
            "Could not load bookmark status:",
            error,
          );

          setError(
            "Saved status could not be loaded.",
          );
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    void loadBookmark();

    return () => {
      cancelled = true;
    };
  }, [
    postId,
    supabase,
  ]);

  // --------------------------------------------------
  // SAVE / UNSAVE
  // --------------------------------------------------

  const toggleBookmark =
    async () => {
      if (
        !userId ||
        working
      ) {
        return;
      }

      setWorking(true);
      setError("");

      try {
        // --------------------------------------------
        // REMOVE BOOKMARK
        // --------------------------------------------

        if (bookmarkId) {
          const {
            error,
          } = await supabase
            .from("bookmarks")
            .delete()
            .eq(
              "id",
              bookmarkId,
            )
            .eq(
              "user_id",
              userId,
            );

          if (error) {
            throw error;
          }

          setBookmarkId(null);

          return;
        }

        // --------------------------------------------
        // CREATE BOOKMARK
        // --------------------------------------------

        const {
          data,
          error,
        } = await supabase
          .from("bookmarks")
          .insert({
            user_id:
              userId,

            post_id:
              postId,
          })
          .select("id")
          .single();

        if (error) {
          // Unique constraint safety
          if (
            error.code ===
            "23505"
          ) {
            const {
              data:
                existingBookmark,
            } = await supabase
              .from("bookmarks")
              .select("id")
              .eq(
                "user_id",
                userId,
              )
              .eq(
                "post_id",
                postId,
              )
              .maybeSingle();

            if (
              existingBookmark
                ?.id
            ) {
              setBookmarkId(
                existingBookmark.id,
              );

              return;
            }
          }

          throw error;
        }

        setBookmarkId(
          data.id,
        );
      } catch (error) {
        console.error(
          "Bookmark update failed:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "The article could not be saved.",
        );
      } finally {
        setWorking(false);
      }
    };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-4 py-2.5 text-sm text-gray-500 opacity-60"
      >
        <Loader2
          size={17}
          className="animate-spin"
        />

        Loading...
      </button>
    );
  }

  // --------------------------------------------------
  // SIGNED OUT
  // --------------------------------------------------

  if (!userId) {
    return (
      <Link
        href="/auth/sign-in"
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-green-400/30 hover:text-green-300"
      >
        <Bookmark
          size={17}
        />

        Sign in to save
      </Link>
    );
  }

  // --------------------------------------------------
  // SIGNED IN
  // --------------------------------------------------

  const saved =
    Boolean(bookmarkId);

  return (
    <div>
      <button
        type="button"
        disabled={working}
        onClick={() => {
          void toggleBookmark();
        }}
        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
          saved
            ? "border-green-400/30 bg-green-400/10 text-green-300"
            : "border-white/10 bg-black/10 text-gray-300 hover:border-green-400/30 hover:text-white"
        }`}
      >
        {working ? (
          <Loader2
            size={17}
            className="animate-spin"
          />
        ) : saved ? (
          <BookmarkCheck
            size={17}
          />
        ) : (
          <Bookmark
            size={17}
          />
        )}

        {working
          ? "Updating..."
          : saved
            ? "Saved"
            : "Save Article"}
      </button>

      {error && (
        <p
          role="alert"
          className="mt-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}
    </div>
  );
}