"use client";

import Link from "next/link";
import {
  AlertCircle,
  CalendarClock,
  X,
} from "lucide-react";
import {
  type ReactNode,
  useState,
} from "react";

import { SITE_STATUS } from "../config/siteStatus";

function formatMaintenanceDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "To be confirmed";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: SITE_STATUS.maintenance.timezone,
  }).format(date);
}

interface NoticeShellProps {
  children: ReactNode;
  label: string;
  tone: "amber" | "cyan";
  icon: ReactNode;
}

function NoticeShell({
  children,
  label,
  tone,
  icon,
}: NoticeShellProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  const scheduled = tone === "cyan";

  return (
    <aside
      aria-label={label}
      className={`border-b ${
        scheduled
          ? "border-cyan-400/15 bg-cyan-400/[0.06]"
          : "border-amber-400/15 bg-amber-400/[0.06]"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-start gap-3 px-6 py-3 md:items-center md:px-8">
        {icon}

        <p
          className={`min-w-0 flex-1 text-sm leading-6 ${
            scheduled
              ? "text-cyan-100/80"
              : "text-amber-100/80"
          }`}
        >
          {children}
        </p>

        <button
          type="button"
          onClick={() => setVisible(false)}
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition focus-visible:outline-none focus-visible:ring-2 ${
            scheduled
              ? "text-cyan-200/70 hover:bg-cyan-400/10 hover:text-cyan-100 focus-visible:ring-cyan-300"
              : "text-amber-200/70 hover:bg-amber-400/10 hover:text-amber-100 focus-visible:ring-amber-300"
          }`}
          aria-label={`Dismiss ${label.toLowerCase()}`}
        >
          <X size={17} aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}

export default function SiteNotice() {
  const scheduled = SITE_STATUS.mode === "scheduled";
  const siteAvailable =
    SITE_STATUS.mode !== "site_maintenance" &&
    SITE_STATUS.mode !== "full_maintenance";
  const showGeneralNotice =
    siteAvailable && SITE_STATUS.generalNotice.enabled;

  if (!scheduled && !showGeneralNotice) {
    return null;
  }

  const startTime = formatMaintenanceDate(
    SITE_STATUS.maintenance.startsAt,
  );
  const returnTime = formatMaintenanceDate(
    SITE_STATUS.maintenance.expectedReturnAt,
  );

  return (
    <>
      {scheduled && (
        <NoticeShell
          label="Scheduled maintenance notice"
          tone="cyan"
          icon={
            <CalendarClock
              size={18}
              className="mt-0.5 shrink-0 text-cyan-300 md:mt-0"
              aria-hidden="true"
            />
          }
        >
          <span className="font-semibold text-cyan-200">
            Scheduled maintenance:
          </span>{" "}
          The main website is scheduled for maintenance on{" "}
          <span className="font-medium text-cyan-100">{startTime}</span>.
          Expected return:{" "}
          <span className="font-medium text-cyan-100">{returnTime}</span>.
          Drive is expected to remain available.{" "}
          <Link
            href="/maintenance"
            className="font-semibold text-cyan-200 underline decoration-cyan-300/40 underline-offset-4 transition hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            View maintenance details
          </Link>
          .
        </NoticeShell>
      )}

      {showGeneralNotice && (
        <NoticeShell
          label="Website update notice"
          tone="amber"
          icon={
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-amber-300 md:mt-0"
              aria-hidden="true"
            />
          }
        >
          <span className="font-semibold text-amber-200">
            {SITE_STATUS.generalNotice.label}
          </span>{" "}
          {SITE_STATUS.generalNotice.message}{" "}
          <Link
            href="/terms"
            className="font-semibold text-amber-200 underline decoration-amber-300/40 underline-offset-4 transition hover:text-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            Read the Terms of Use
          </Link>
          .
        </NoticeShell>
      )}
    </>
  );
}
