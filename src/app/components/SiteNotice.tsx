"use client";

import Link from "next/link";
import {
  AlertCircle,
  X,
} from "lucide-react";
import {
  useState,
} from "react";

// ==================================================
// WEBSITE NOTICE — EASY MAINTENANCE GUIDE
// ==================================================
//
// WHAT THIS COMPONENT DOES
//
// This component displays a temporary notice directly
// underneath the website navigation bar.
//
// Visitors can dismiss the notice using the close
// button. It remains dismissed while they navigate
// through the website, but it may return after a full
// page refresh.
//
// --------------------------------------------------
// HOW TO HIDE THE NOTICE
// --------------------------------------------------
//
// Find:
//
//   enabled: true,
//
// Change it to:
//
//   enabled: false,
//
// You do not need to delete this component or remove
// it from layout.tsx. Setting enabled to false makes
// this component render nothing.
//
// --------------------------------------------------
// HOW TO SHOW THE NOTICE AGAIN
// --------------------------------------------------
//
// Change:
//
//   enabled: false,
//
// back to:
//
//   enabled: true,
//
// --------------------------------------------------
// HOW TO PUBLISH A DIFFERENT NOTICE
// --------------------------------------------------
//
// 1. Set `enabled` to true.
//
// 2. Change the label. For example:
//
//      label: "Scheduled maintenance:",
//
// 3. Change the message. For example:
//
//      message:
//        "Some website features may be temporarily unavailable.",
//
// After deploying the changes, the new notice will
// appear when visitors load or refresh the website.
//
// --------------------------------------------------
// CURRENT REMINDER
// --------------------------------------------------
//
// TODO(SITE-NOTICE):
// When the website is no longer undergoing active
// refinement, change `enabled` from true to false.
//
// To find this file later, search the project for:
//
//   SITE-NOTICE
//
// ==================================================

const SITE_NOTICE = {
  // true  = display the notice
  // false = hide the notice
  enabled:
    true,

  // Short heading displayed before the message.
  label:
    "Website update notice:",

  // Main notice shown to visitors.
  message:
    "This website is undergoing continued refinement, so some content may be incomplete or change. Cybersecurity material is provided for educational and authorised defensive use only.",
} as const;

// ==================================================
// END WEBSITE NOTICE CONFIGURATION
// ==================================================

export default function SiteNotice() {
  const [
    visible,
    setVisible,
  ] =
    useState<boolean>(
      SITE_NOTICE.enabled,
    );

  const dismissNotice =
    () => {
      setVisible(
        false,
      );
    };

  if (
    !SITE_NOTICE.enabled ||
    !visible
  ) {
    return null;
  }

  return (
    <aside
      aria-label="Website status notice"
      className="border-b border-amber-400/15 bg-amber-400/[0.06]"
    >
      <div className="mx-auto flex w-full max-w-7xl items-start gap-3 px-6 py-3 md:items-center md:px-8">
        <AlertCircle
          size={18}
          className="mt-0.5 shrink-0 text-amber-300 md:mt-0"
          aria-hidden="true"
        />

        <p className="min-w-0 flex-1 text-sm leading-6 text-amber-100/80">
          <span className="font-semibold text-amber-200">
            {
              SITE_NOTICE.label
            }
          </span>{" "}
          {
            SITE_NOTICE.message
          }{" "}
          <Link
            href="/terms"
            className="font-semibold text-amber-200 underline decoration-amber-300/40 underline-offset-4 transition hover:text-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            Read the Terms of Use
          </Link>
          .
        </p>

        <button
          type="button"
          onClick={
            dismissNotice
          }
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-amber-200/70 transition hover:bg-amber-400/10 hover:text-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
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