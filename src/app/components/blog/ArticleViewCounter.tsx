"use client";

import { Eye } from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createClient } from "../../lib/supabase/client";

interface ArticleViewCounterProps {
  postId: string;
  initialViews: number;
}

const VIEW_COOLDOWN =
  12 * 60 * 60 * 1000;

export default function ArticleViewCounter({
  postId,
  initialViews,
}: ArticleViewCounterProps) {
  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const [views, setViews] =
    useState(initialViews);

  useEffect(() => {
    let cancelled = false;

    const countView = async () => {
      const storageKey =
        `blog-view:${postId}`;

      const now = Date.now();

      try {
        const storedValue =
          window.localStorage.getItem(
            storageKey,
          );

        const lastViewed =
          storedValue
            ? Number(
                storedValue,
              )
            : 0;

        /*
         * This browser has already counted
         * this article within the cooldown.
         */
        if (
          lastViewed &&
          now - lastViewed <
            VIEW_COOLDOWN
        ) {
          return;
        }

        /*
         * Mark it before making the request.
         *
         * This also protects against React's
         * development-mode effect running twice.
         */
        window.localStorage.setItem(
          storageKey,
          String(now),
        );

        const {
          data,
          error,
        } = await supabase.rpc(
          "increment_post_view",
          {
            target_post_id:
              postId,
          },
        );

        if (error) {
          /*
           * Allow another attempt if the
           * database request failed.
           */
          const currentValue =
            window.localStorage.getItem(
              storageKey,
            );

          if (
            currentValue ===
            String(now)
          ) {
            window.localStorage.removeItem(
              storageKey,
            );
          }

          console.error(
            "Could not record article view:",
            error,
          );

          return;
        }

        if (
          cancelled
        ) {
          return;
        }

        if (
          typeof data ===
          "number"
        ) {
          setViews(data);
          return;
        }

        /*
         * PostgreSQL bigint can sometimes
         * arrive as a string.
         */
        if (
          typeof data ===
            "string" &&
          !Number.isNaN(
            Number(data),
          )
        ) {
          setViews(
            Number(data),
          );
        }
      } catch (error) {
        console.error(
          "Could not record article view:",
          error,
        );
      }
    };

    void countView();

    return () => {
      cancelled = true;
    };
  }, [
    postId,
    supabase,
  ]);

  return (
    <span
      className="inline-flex items-center gap-2"
      title={`${views.toLocaleString(
        "en-GB",
      )} views`}
    >
      <Eye size={15} />

      {views.toLocaleString(
        "en-GB",
      )}{" "}
      {views === 1
        ? "view"
        : "views"}
    </span>
  );
}