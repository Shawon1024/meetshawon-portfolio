"use client";

import Link from "next/link";
import {
  AlertCircle,
  CalendarClock,
  X,
} from "lucide-react";
import {
  useState,
} from "react";

import {
  SITE_STATUS,
} from "../config/siteStatus";

function formatMaintenanceDate(
  value: string,
) {
  const date =
    new Date(
      value,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "To be confirmed";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle:
        "full",

      timeStyle:
        "short",

      timeZone:
        SITE_STATUS.maintenance.timezone,
    },
  ).format(
    date,
  );
}

export default function SiteNotice() {
  const scheduled =
    SITE_STATUS.mode ===
    "scheduled";

  const construction =
    SITE_STATUS.mode ===
      "normal" &&
    SITE_STATUS
      .constructionNotice
      .enabled;

  const [
    visible,
    setVisible,
  ] =
    useState<boolean>(
      scheduled ||
        construction,
    );

  const dismissNotice =
    () => {
      setVisible(
        false,
      );
    };

  if (
    !visible ||
    SITE_STATUS.mode ===
      "maintenance" ||
    (
      !scheduled &&
      !construction
    )
  ) {
    return null;
  }

  const startTime =
    formatMaintenanceDate(
      SITE_STATUS
        .maintenance
        .startsAt,
    );

  const returnTime =
    formatMaintenanceDate(
      SITE_STATUS
        .maintenance
        .expectedReturnAt,
    );

  return (
    <aside
      aria-label={
        scheduled
          ? "Scheduled maintenance notice"
          : "Website status notice"
      }
      className={`border-b ${
        scheduled
          ? "border-cyan-400/15 bg-cyan-400/[0.06]"
          : "border-amber-400/15 bg-amber-400/[0.06]"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-start gap-3 px-6 py-3 md:items-center md:px-8">
        {scheduled ? (
          <CalendarClock
            size={18}
            className="mt-0.5 shrink-0 text-cyan-300 md:mt-0"
            aria-hidden="true"
          />
        ) : (
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0 text-amber-300 md:mt-0"
            aria-hidden="true"
          />
        )}

        <p
          className={`min-w-0 flex-1 text-sm leading-6 ${
            scheduled
              ? "text-cyan-100/80"
              : "text-amber-100/80"
          }`}
        >
          {scheduled ? (
            <>
              <span className="font-semibold text-cyan-200">
                Scheduled maintenance:
              </span>{" "}
              The main website is scheduled for maintenance on{" "}
              <span className="font-medium text-cyan-100">
                {
                  startTime
                }
              </span>
              . Expected return:{" "}
              <span className="font-medium text-cyan-100">
                {
                  returnTime
                }
              </span>
              . Drive is expected to remain available.{" "}
              <Link
                href="/maintenance"
                className="font-semibold text-cyan-200 underline decoration-cyan-300/40 underline-offset-4 transition hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                View maintenance details
              </Link>
              .
            </>
          ) : (
            <>
              <span className="font-semibold text-amber-200">
                {
                  SITE_STATUS
                    .constructionNotice
                    .label
                }
              </span>{" "}
              {
                SITE_STATUS
                  .constructionNotice
                  .message
              }{" "}
              <Link
                href="/terms"
                className="font-semibold text-amber-200 underline decoration-amber-300/40 underline-offset-4 transition hover:text-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                Read the Terms of Use
              </Link>
              .
            </>
          )}
        </p>

        <button
          type="button"
          onClick={
            dismissNotice
          }
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition focus-visible:outline-none focus-visible:ring-2 ${
            scheduled
              ? "text-cyan-200/70 hover:bg-cyan-400/10 hover:text-cyan-100 focus-visible:ring-cyan-300"
              : "text-amber-200/70 hover:bg-amber-400/10 hover:text-amber-100 focus-visible:ring-amber-300"
          }`}
          aria-label="Dismiss website notice"
        >
          <X
            size={17}
            aria-hidden="true"
          />
        </button>
      </div>
    </aside>
  );
}