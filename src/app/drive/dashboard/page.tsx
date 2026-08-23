import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  Activity,
  ArrowUpRight,
  Cloud,
  Database,
  FolderLock,
  Gauge,
  HardDrive,
  Server,
  ShieldCheck,
} from "lucide-react";

import {
  redirect,
} from "next/navigation";

import ProfileAvatar from "../../components/ui/ProfileAvatar";

import {
  createClient,
} from "../../lib/supabase/server";

export const metadata: Metadata = {
  title:
    "Drive Dashboard",
  description:
    "Secure private cloud storage dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

interface DriveProfile {
  first_name:
    string | null;
  last_name:
    string | null;
  username:
    string | null;
  avatar_url:
    string | null;
  gender:
    string | null;
  role:
    string | null;
}

function getFullName(
  profile: DriveProfile,
) {
  const fullName = [
    profile.first_name,
    profile.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    fullName ||
    profile.username ||
    "Drive User"
  );
}

export default async function DriveDashboardPage() {
  // --------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------

  const supabase =
    await createClient();

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
    redirect(
      "/auth/sign-in?drive=1&next=%2Fdashboard",
    );
  }

  // --------------------------------------------------
  // PROFILE AND ROLE
  // --------------------------------------------------

  const {
    data:
      profile,
    error:
      profileError,
  } =
    await supabase
      .from("profiles")
      .select(`
        first_name,
        last_name,
        username,
        avatar_url,
        gender,
        role
      `)
      .eq(
        "id",
        user.id,
      )
      .single<DriveProfile>();

  if (
    profileError ||
    !profile
  ) {
    redirect(
      "/access-denied?reason=profile",
    );
  }

  const canAccessDrive =
    profile.role ===
      "admin" ||
    profile.role ===
      "partner";

  if (!canAccessDrive) {
    redirect(
      "/access-denied?reason=role",
    );
  }

  // --------------------------------------------------
  // DRIVE ALLOCATION
  // --------------------------------------------------

  const isAdmin =
    profile.role ===
    "admin";

  const displayName =
    getFullName(profile);

  const datasetName =
    isAdmin
      ? "meetshawon_main"
      : profile.username
        ? `meetshawon_${profile.username}`
        : "Dataset assignment pending";

  const allocation =
    isAdmin
      ? "Main administrator storage"
      : "101 GiB private allocation";

  const capacityLabel =
    isAdmin
      ? "Main dataset"
      : "101 GiB";

  return (
    <main className="px-5 py-10 sm:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        {/* =============================================
            DASHBOARD HEADER
        ============================================= */}

        <section className="relative isolate overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[#071722]/85 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute -left-24 -top-32 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

            <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-cyan-300/15 blur-3xl" />

            <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.035)_1px,transparent_1px)] bg-[size:42px_42px]" />
          </div>

          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-green-300">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-green-400/60" />

                  <span className="relative m-auto h-2 w-2 rounded-full bg-green-400" />
                </span>

                Authentication verified
              </div>

              <h1 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
                Welcome,{" "}

                <span className="text-cyan-300">
                  {displayName}
                </span>
              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                Manage your private storage allocation, connection status,
                and Drive access from this secure dashboard.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="https://www.meetshawon.com"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
              >
                Portfolio

                <ArrowUpRight
                  size={16}
                />
              </Link>

              <Link
                href="https://files.meetshawon.com/apps/files/files"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110"
              >
                <Cloud
                  size={17}
                />

                Open Files

                <ArrowUpRight
                  size={16}
                />
              </Link>
            </div>
          </div>
        </section>

        {/* =============================================
            SUMMARY CARDS
        ============================================= */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Access role
              </p>

              <ShieldCheck
                size={19}
                className="text-green-300"
              />
            </div>

            <p className="mt-4 text-xl font-semibold capitalize text-white">
              {profile.role}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Drive access authorized
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Storage allocation
              </p>

              <HardDrive
                size={19}
                className="text-cyan-300"
              />
            </div>

            <p className="mt-4 text-xl font-semibold text-white">
              {isAdmin
                ? "Main"
                : "101 GiB"}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {allocation}
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Storage service
              </p>

              <Gauge
                size={19}
                className="text-blue-300"
              />
            </div>

            <p className="mt-4 text-xl font-semibold text-green-300">
              Operational
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Private NAS connected
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                File service
              </p>

              <Server
                size={19}
                className="text-purple-300"
              />
            </div>

            <p className="mt-4 text-xl font-semibold text-green-300">
              Online
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Nextcloud connected
            </p>
          </article>
        </section>

        {/* =============================================
            MAIN DASHBOARD
        ============================================= */}

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Storage overview */}

          <article className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-400">
                  Storage overview
                </p>

                <h2 className="mt-3 text-2xl font-bold text-white">
                  Private dataset
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                <Database
                  size={23}
                />
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-white/10 bg-black/15 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Assigned dataset
              </p>

              <p className="mt-2 break-all font-mono text-lg text-cyan-200">
                {datasetName}
              </p>
            </div>

            <div className="mt-7">
              <p className="text-sm font-medium text-white">
                Storage service
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Capacity
                  </p>

                  <p className="mt-2 font-semibold text-cyan-200">
                    {capacityLabel}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Usage reporting
                  </p>

                  <p className="mt-2 font-semibold text-green-300">
                    Available in Files
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                Live used-space telemetry is not exposed on this dashboard.
                Open Files to manage your data and view the storage information
                provided by Nextcloud.
              </p>
            </div>
          </article>

          {/* Account access */}

          <article className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-green-400">
              Account access
            </p>

            <h2 className="mt-3 text-2xl font-bold text-white">
              Authorized identity
            </h2>

            <div className="mt-7 flex items-center gap-4">
              <ProfileAvatar
                avatarUrl={
                  profile.avatar_url
                }
                gender={
                  profile.gender
                }
                name={
                  displayName
                }
                className="h-14 w-14"
                iconSize={23}
              />

              <div className="min-w-0">
                <p className="truncate font-semibold text-white">
                  {displayName}
                </p>

                <p className="truncate text-sm text-slate-400">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-3">
              <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] pb-3 text-sm">
                <span className="text-slate-400">
                  Role
                </span>

                <span className="capitalize text-white">
                  {profile.role}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] pb-3 text-sm">
                <span className="text-slate-400">
                  Username
                </span>

                <span className="truncate text-white">
                  {profile.username
                    ? `@${profile.username}`
                    : "Not configured"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-400">
                  Session
                </span>

                <span className="inline-flex items-center gap-2 text-green-300">
                  <span className="h-2 w-2 rounded-full bg-green-400" />

                  Active
                </span>
              </div>
            </div>
          </article>
        </section>

        {/* =============================================
            CONNECTION STATUS
        ============================================= */}

        <section className="mt-6 rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Activity
              size={22}
              className="text-cyan-300"
            />

            <div>
              <h2 className="text-xl font-semibold text-white">
                Infrastructure status
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Current Drive service readiness
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-green-400/15 bg-green-400/[0.05] p-5">
              <p className="text-sm text-slate-400">
                Authentication gateway
              </p>

              <p className="mt-2 flex items-center gap-2 font-semibold text-green-300">
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />

                Online
              </p>
            </div>

            <div className="rounded-2xl border border-green-400/15 bg-green-400/[0.05] p-5">
              <p className="text-sm text-slate-400">
                Private NAS
              </p>

              <p className="mt-2 flex items-center gap-2 font-semibold text-green-300">
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />

                Operational
              </p>
            </div>

            <div className="rounded-2xl border border-green-400/15 bg-green-400/[0.05] p-5">
              <p className="text-sm text-slate-400">
                File interface
              </p>

              <p className="mt-2 flex items-center gap-2 font-semibold text-green-300">
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />

                Nextcloud online
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-blue-400/15 bg-blue-400/[0.05] p-5">
            <FolderLock
              size={20}
              className="mt-0.5 shrink-0 text-blue-300"
            />

            <p className="text-sm leading-6 text-slate-300">
              Your authenticated account is connected to its private dataset
              through Nextcloud. Open Files to upload, organise, share, and
              restore recently deleted items from the recycle bin.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}