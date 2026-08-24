import type {
  Metadata,
} from "next";

import {
  AlertTriangle,
  FolderLock,
  LockKeyhole,
  ShieldX,
} from "lucide-react";

import {
  redirect,
} from "next/navigation";

import DriveAccessDeniedActions from "../../components/drive/DriveAccessDeniedActions";

import {
  createClient,
} from "../../lib/supabase/server";

export const metadata: Metadata = {
  title:
    "Drive Access Denied",
  description:
    "Your account is not authorised to access Meet Shawon Drive.",
  robots: {
    index: false,
    follow: false,
  },
};

interface AccessDeniedPageProps {
  searchParams: Promise<{
    reason?: string;
  }>;
}

export default async function DriveAccessDeniedPage({
  searchParams,
}: AccessDeniedPageProps) {
  const resolvedSearchParams =
    await searchParams;

  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  // --------------------------------------------------
  // SIGNED OUT
  // --------------------------------------------------

  if (!user) {
    redirect(
      "/auth/sign-in?drive=1&next=%2Fdashboard",
    );
  }

  // --------------------------------------------------
  // CHECK WHETHER ACCESS HAS CHANGED
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
        role
      `)
      .eq(
        "id",
        user.id,
      )
      .single();

  const canAccessDrive =
    !profileError &&
    (
      profile?.role ===
        "admin" ||
      profile?.role ===
        "partner"
    );

  if (canAccessDrive) {
    redirect(
      "/dashboard",
    );
  }

  const profileUnavailable =
    resolvedSearchParams
      .reason ===
      "profile" ||
    profileError;

  const firstName =
    profile?.first_name ??
    "there";

  return (
    <main className="px-5 py-12 sm:px-6 md:py-20">
      <div className="mx-auto max-w-3xl">
        <section className="relative isolate overflow-hidden rounded-[2rem] border border-red-400/15 bg-[#10171d]/90 p-6 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-10">
          {/* Background */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute -left-32 -top-36 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />

            <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="absolute inset-0 bg-[linear-gradient(rgba(248,113,113,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(248,113,113,0.025)_1px,transparent_1px)] bg-[size:42px_42px]" />
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-red-300 shadow-lg shadow-red-950/20">
            <ShieldX
              size={31}
            />
          </div>

          <p className="mt-7 text-sm font-medium uppercase tracking-[0.22em] text-red-300">
            Authorisation rejected
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
            Drive access denied
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Hello {firstName}. Your account is authenticated, but it does not
            currently have permission to access Meet Shawon Drive.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
              <LockKeyhole
                size={21}
                className="text-red-300"
              />

              <h2 className="mt-4 font-semibold text-white">
                Restricted service
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Drive is currently restricted to authorised Admin and Partner
                accounts.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
              <FolderLock
                size={21}
                className="text-cyan-300"
              />

              <h2 className="mt-4 font-semibold text-white">
                Private datasets
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Storage is only assigned after an account has received Drive
                authorisation.
              </p>
            </div>
          </div>

          {profileUnavailable && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-400/15 bg-amber-400/[0.06] p-5">
              <AlertTriangle
                size={20}
                className="mt-0.5 shrink-0 text-amber-300"
              />

              <p className="text-sm leading-6 text-amber-100/80">
                Your account profile could not be verified. Access has been
                denied safely. Try signing in again or contact the
                administrator if the problem continues.
              </p>
            </div>
          )}

          <div className="mt-8 border-t border-white/10 pt-7">
            <DriveAccessDeniedActions />
          </div>

          <p className="mt-6 text-xs leading-5 text-slate-500">
            Signed in as {user.email}. Authentication does not automatically
            provide Drive authorisation.
          </p>
        </section>
      </div>
    </main>
  );
}