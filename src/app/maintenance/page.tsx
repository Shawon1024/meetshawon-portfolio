import type {
  Metadata,
} from "next";
import Link from "next/link";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  HardDrive,
  Mail,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import {
  redirect,
} from "next/navigation";
import Image from "next/image";
import {
  SITE_STATUS,
} from "../config/siteStatus";

export const metadata:
  Metadata = {
  title:
    "Website Maintenance",

  description:
    "Meet Shawon is temporarily unavailable while scheduled website maintenance is completed.",

  robots: {
    index:
      false,

    follow:
      false,

    noarchive:
      true,
  },
};

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
        SITE_STATUS
          .maintenance
          .timezone,
    },
  ).format(
    date,
  );
}

export default function MaintenancePage() {
  if (
    SITE_STATUS.mode ===
    "normal"
  ) {
    redirect(
      "/",
    );
  }

  const active =
    SITE_STATUS.mode ===
    "maintenance";

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
    <main className="relative z-[100] min-h-screen overflow-hidden bg-[#061b17] px-6 py-12 md:px-8 md:py-16">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />

        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {active && (
            <>
                <header className="fixed inset-x-0 top-0 z-[120] border-b border-white/10 bg-[#061b17]/95 shadow-lg shadow-black/20 backdrop-blur-xl">
                <div className="mx-auto flex h-[65px] max-w-5xl items-center justify-between gap-3 px-6 sm:h-[73px] sm:gap-5 md:px-8">
                    <Image
                    src="/logo.png"
                    alt="Meet Shawon"
                    width={220}
                    height={80}
                    priority
                    className="h-10 w-auto shrink-0 object-contain sm:h-12"
                    />

                    <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-2 text-xs font-semibold text-green-300">
                    <span
                        className="relative flex h-2 w-2"
                        aria-hidden="true"
                    >
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-50" />

                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                    </span>

                    <span>
                        Maintenance
                        <span className="hidden sm:inline">
                        {" "}active
                        </span>
                    </span>
                    </div>
                </div>
                </header>

                <div
                className="h-[65px] sm:h-[73px]"
                aria-hidden="true"
                />
            </>
        )}
        <div className="text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-green-400/20 bg-green-400/10 text-green-300">
            <Wrench
              size={30}
              aria-hidden="true"
            />
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.22em] text-green-400">
            {
              active
                ? "Maintenance in progress"
                : "Upcoming maintenance"
            }
          </p>

          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl">
            {
              active
                ? "The website is temporarily unavailable"
                : SITE_STATUS
                    .maintenance
                    .title
            }
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            {
              active
                ? SITE_STATUS
                    .maintenance
                    .summary
                : "Planned maintenance has been scheduled. The website remains available until the maintenance window begins."
            }
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-7">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <CalendarClock
                  size={21}
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Maintenance begins
                </h2>

                <p className="mt-2 leading-7 text-gray-400">
                  {
                    startTime
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-7">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                <Clock3
                  size={21}
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Planned return
                </h2>

                <p className="mt-2 leading-7 text-gray-400">
                  {
                    returnTime
                  }
                </p>
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
                {
                  SITE_STATUS
                    .maintenance
                    .reason
                }
              </p>

              {active && (
                <p className="mt-3 leading-7 text-gray-400">
                  {
                    SITE_STATUS
                      .maintenance
                      .progressMessage
                  }
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
              {SITE_STATUS
                .maintenance
                .plannedChanges
                .map(
                  (
                    change,
                  ) => (
                    <div
                      key={
                        change
                      }
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-green-300"
                        aria-hidden="true"
                      />

                      <p className="text-sm leading-6 text-gray-400">
                        {
                          change
                        }
                      </p>
                    </div>
                  ),
                )}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white">
              Services remaining available
            </h2>

            <div className="mt-5 space-y-4">
              {SITE_STATUS
                .maintenance
                .availableServices
                .map(
                  (
                    service,
                    index,
                  ) => (
                    <div
                      key={
                        service
                      }
                      className="flex items-start gap-3"
                    >
                      {index ===
                      0 ? (
                        <Mail
                          size={18}
                          className="mt-0.5 shrink-0 text-cyan-300"
                          aria-hidden="true"
                        />
                      ) : (
                        <HardDrive
                          size={18}
                          className="mt-0.5 shrink-0 text-cyan-300"
                          aria-hidden="true"
                        />
                      )}

                      <p className="text-sm leading-6 text-gray-400">
                        {
                          service
                        }
                      </p>
                    </div>
                  ),
                )}
            </div>
          </section>
        </div>

        <div className="mt-8 rounded-3xl border border-green-400/15 bg-green-400/[0.06] p-6 text-center md:p-8">
          <h2 className="text-xl font-semibold text-white">
            Need to contact me urgently?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-400">
            The contact page and contact form remain available during
            maintenance for important enquiries.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={
                SITE_STATUS
                  .maintenance
                  .contactPath
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-semibold text-black transition hover:bg-green-400"
            >
              <Mail
                size={17}
                aria-hidden="true"
              />

              Urgent contact
            </Link>

            <a
              href="https://drive.meetshawon.com"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 font-semibold text-white transition hover:border-white/20 hover:bg-white/5"
            >
              <HardDrive
                size={17}
                aria-hidden="true"
              />

              Open Drive
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-sm leading-6 text-gray-500">
          Sorry for the inconvenience, and thank you for your patience while
          the work is completed.
        </p>

        {active && (
            <footer className="mt-12 border-t border-white/10 pt-7 text-center">
                <p className="text-sm text-gray-500">
                Copyright © {new Date().getFullYear()} Md Samsudduha Shawon. All
                rights reserved.
                </p>

                <p className="mt-2 text-xs text-gray-600">
                Meet Shawon · London, United Kingdom
                </p>
            </footer>
        )}
      </div>
    </main>
  );
}