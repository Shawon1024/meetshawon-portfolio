import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Globe2,
  HardDrive,
  Mail,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { redirect } from "next/navigation";

import { SITE_STATUS } from "../config/siteStatus";

export const metadata: Metadata = {
  title: "Service Maintenance",
  description:
    "A Meet Shawon service is temporarily unavailable while scheduled maintenance is completed.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

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

export default function MaintenancePage() {
  if (SITE_STATUS.mode === "normal") {
    redirect("/");
  }

  const scheduled = SITE_STATUS.mode === "scheduled";
  const driveOnly = SITE_STATUS.mode === "drive_maintenance";
  const fullMaintenance = SITE_STATUS.mode === "full_maintenance";
  const active = !scheduled;

  const affectedService = driveOnly
    ? "Drive"
    : fullMaintenance
      ? "Website and Drive"
      : "Website";

  const activeHeading = driveOnly
    ? "Meet Shawon Drive is temporarily unavailable"
    : fullMaintenance
      ? "The website and Drive are temporarily unavailable"
      : "The website is temporarily unavailable";

  const startTime = formatMaintenanceDate(
    SITE_STATUS.maintenance.startsAt,
  );
  const returnTime = formatMaintenanceDate(
    SITE_STATUS.maintenance.expectedReturnAt,
  );

  return (
    <main className="fixed inset-0 z-[100] overflow-y-auto bg-[#061b17] px-6 py-12 md:px-8 md:py-16">
      <div
        className="pointer-events-none fixed inset-0"
        aria-hidden="true"
      >
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-green-400/20 bg-green-400/10 text-green-300">
            <Wrench size={30} aria-hidden="true" />
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.22em] text-green-400">
            {active ? "Maintenance in progress" : "Upcoming maintenance"}
          </p>

          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl">
            {active ? activeHeading : SITE_STATUS.maintenance.title}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            {active
              ? SITE_STATUS.maintenance.summary
              : "Planned website maintenance has been scheduled. The website remains available until the maintenance window begins."}
          </p>

          {active && (
            <span className="mt-6 inline-flex rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-medium text-green-300">
              Affected: {affectedService}
            </span>
          )}
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-7">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <CalendarClock size={21} aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-semibold text-white">
                  Maintenance begins
                </h2>
                <p className="mt-2 leading-7 text-gray-400">{startTime}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-7">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                <Clock3 size={21} aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-semibold text-white">Planned return</h2>
                <p className="mt-2 leading-7 text-gray-400">{returnTime}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <ShieldCheck
              size={23}
              className="mt-0.5 shrink-0 text-green-300"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-xl font-semibold text-white">
                Why maintenance is taking place
              </h2>
              <p className="mt-3 leading-7 text-gray-400">
                {SITE_STATUS.maintenance.reason}
              </p>
              {active && (
                <p className="mt-3 leading-7 text-gray-400">
                  {SITE_STATUS.maintenance.progressMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white">
              Planned changes
            </h2>
            <div className="mt-5 space-y-4">
              {SITE_STATUS.maintenance.plannedChanges.map((change) => (
                <div key={change} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-green-300"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-6 text-gray-400">
                    {change}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white">
              Services remaining available
            </h2>
            <div className="mt-5 space-y-4">
              {!driveOnly && !fullMaintenance && (
                <a
                  href="https://drive.meetshawon.com"
                  className="flex items-start gap-3 text-sm leading-6 text-gray-400 transition hover:text-cyan-200"
                >
                  <HardDrive
                    size={18}
                    className="mt-0.5 shrink-0 text-cyan-300"
                    aria-hidden="true"
                  />
                  Meet Shawon Drive for authorised users
                </a>
              )}

              {driveOnly && (
                <a
                  href="https://meetshawon.com"
                  className="flex items-start gap-3 text-sm leading-6 text-gray-400 transition hover:text-cyan-200"
                >
                  <Globe2
                    size={18}
                    className="mt-0.5 shrink-0 text-cyan-300"
                    aria-hidden="true"
                  />
                  Main website
                </a>
              )}

              <a
                href={SITE_STATUS.maintenance.contactPath}
                className="flex items-start gap-3 text-sm leading-6 text-gray-400 transition hover:text-cyan-200"
              >
                <Mail
                  size={18}
                  className="mt-0.5 shrink-0 text-cyan-300"
                  aria-hidden="true"
                />
                Urgent contact form
              </a>
            </div>
          </section>
        </div>

        <div className="mt-8 rounded-3xl border border-green-400/15 bg-green-400/[0.06] p-6 text-center md:p-8">
          <h2 className="text-xl font-semibold text-white">
            Need to contact me urgently?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-400">
            The urgent contact form remains available during maintenance for
            important enquiries.
          </p>
          <Link
            href={SITE_STATUS.maintenance.contactPath}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-semibold text-black transition hover:bg-green-400"
          >
            <Mail size={17} aria-hidden="true" />
            Urgent contact
          </Link>
        </div>

        <p className="mt-8 text-center text-sm leading-6 text-gray-500">
          Sorry for the inconvenience, and thank you for your patience while
          the work is completed.
        </p>
      </div>
    </main>
  );
}
