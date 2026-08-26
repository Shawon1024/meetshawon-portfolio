import type { Metadata } from "next";
import Image from "next/image";
import { AlertTriangle, FlaskConical, LockKeyhole, ShieldX } from "lucide-react";
import { redirect } from "next/navigation";

import LabAccountActions from "../../components/lab/LabAccountActions";
import { createClient } from "../../lib/supabase/server";

export const metadata: Metadata = {
  title: "Lab Access Denied",
  description: "Your account is not authorised to access Meet Shawon Lab.",
  robots: {
    index: false,
    follow: false,
  },
};

interface LabAccessDeniedPageProps {
  searchParams: Promise<{
    reason?: string;
  }>;
}

export default async function LabAccessDeniedPage({
  searchParams,
}: LabAccessDeniedPageProps) {
  const resolvedSearchParams = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?lab=1&next=%2F");
  }

  const [profileResult, membershipResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("first_name, role")
      .eq("id", user.id)
      .single(),
    supabase
      .from("lab_access_members")
      .select("status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle(),
  ]);

  const profile = profileResult.data;
  const canAccessLab =
    !profileResult.error &&
    (profile?.role === "admin" || membershipResult.data?.status === "active");

  if (canAccessLab) {
    redirect("/");
  }

  const profileUnavailable =
    resolvedSearchParams.reason === "profile" || profileResult.error;

  return (
    <main
      data-service-shell="lab"
      className="relative isolate flex min-h-dvh items-center overflow-hidden px-5 py-12 sm:px-6"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-red-400/[0.08] blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-cyan-400/[0.07] blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <section className="overflow-hidden rounded-[2rem] border border-red-300/15 bg-[#0b2422]/90 p-6 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-10">
          <Image
            src="/logo.png"
            alt="Meet Shawon"
            width={210}
            height={76}
            priority
            className="h-14 w-auto object-contain"
          />

          <div className="mt-9 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-300/20 bg-red-300/10 text-red-200">
            <ShieldX size={31} aria-hidden="true" />
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.22em] text-red-300">
            Authorisation required
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
            Lab access denied
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Hello {profile?.first_name ?? "there"}. Your account is signed in,
            but it has not been granted access to the private Meet Shawon
            Cybersecurity Lab.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
              <LockKeyhole size={21} className="text-red-300" aria-hidden="true" />
              <h2 className="mt-4 font-semibold text-white">Restricted membership</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Access is limited to administrators and explicitly approved Lab
                members.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
              <FlaskConical size={21} className="text-cyan-300" aria-hidden="true" />
              <h2 className="mt-4 font-semibold text-white">Controlled environment</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Lab access is granted only for legal, ethical and authorised
                technical activity.
              </p>
            </div>
          </div>

          {profileUnavailable ? (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] p-5">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-300" aria-hidden="true" />
              <p className="text-sm leading-6 text-amber-100/80">
                Your profile could not be verified, so access was denied safely.
                Sign in again or contact the administrator if this continues.
              </p>
            </div>
          ) : null}

          <div className="mt-8 border-t border-white/10 pt-7">
            <LabAccountActions denied />
          </div>

          <p className="mt-6 text-xs leading-5 text-slate-500">
            Signed in as {user.email}. Authentication alone does not provide Lab
            authorisation.
          </p>
        </section>
      </div>
    </main>
  );
}
