import Link from "next/link";

import {
  ArrowRight,
  Cloud,
  FolderLock,
  HardDrive,
  ShieldCheck,
} from "lucide-react";

import {
  redirect,
} from "next/navigation";

import Container from "../components/Container";
import { createClient } from "../lib/supabase/server";

export default async function DrivePage() {
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

  // --------------------------------------------------
  // NOT SIGNED IN
  // --------------------------------------------------

  if (
    userError ||
    !user
  ) {
    redirect(
      "https://meetshawon.com/auth/sign-in?next=https%3A%2F%2Fdrive.meetshawon.com",
    );
  }

  // --------------------------------------------------
  // LOAD USER ROLE
  // --------------------------------------------------

  const {
    data:
      profile,
    error:
      profileError,
  } =
    await supabase
      .from("profiles")
      .select("role")
      .eq(
        "id",
        user.id,
      )
      .single();

  // --------------------------------------------------
  // ROLE CHECK
  // --------------------------------------------------

  const canAccessDrive =
    profile?.role ===
      "admin" ||
    profile?.role ===
      "partner";

  if (
    profileError ||
    !canAccessDrive
  ) {
    /*
     * IMPORTANT:
     *
     * Use the absolute main-domain URL.
     *
     * redirect("/") would send the user back to
     * drive.meetshawon.com and create a loop.
     */

    redirect(
      "https://meetshawon.com",
    );
  }

  // --------------------------------------------------
  // AUTHORISED DRIVE PAGE
  // --------------------------------------------------

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">

              {/* LEFT */}

              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-medium text-green-300">
                  <Cloud
                    size={
                      16
                    }
                  />

                  Meet Shawon Drive
                </div>

                <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl">
                  Your private
                  cloud.

                  <span className="block text-green-400">
                    Secure.
                    Personal.
                    Controlled.
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
                  A private storage
                  environment designed
                  for secure file
                  access, personal
                  data management,
                  and controlled
                  sharing through
                  MeetShawon.Com.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="#drive-access"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400"
                  >
                    Access Drive

                    <ArrowRight
                      size={
                        18
                      }
                    />
                  </Link>

                  <Link
                    href="https://meetshawon.com"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 font-medium text-white transition hover:border-green-400/30 hover:bg-white/5"
                  >
                    Back to Portfolio
                  </Link>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <FolderLock
                      size={
                        21
                      }
                      className="text-green-300"
                    />

                    <p className="mt-3 font-medium text-white">
                      Private Access
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      Access-controlled
                      personal storage.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <ShieldCheck
                      size={
                        21
                      }
                      className="text-green-300"
                    />

                    <p className="mt-3 font-medium text-white">
                      Secure by Design
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      Built around
                      authenticated
                      access.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <HardDrive
                      size={
                        21
                      }
                      className="text-green-300"
                    />

                    <p className="mt-3 font-medium text-white">
                      Self-Hosted
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      Future storage
                      hosted on private
                      infrastructure.
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT */}

              <div
                id="drive-access"
                className="rounded-3xl border border-white/10 bg-[var(--surface)]/80 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-400/10 text-green-300">
                  <HardDrive
                    size={
                      24
                    }
                  />
                </div>

                <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-green-400">
                  Private Drive
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white">
                  Drive access
                </h2>

                <p className="mt-4 leading-7 text-gray-400">
                  Your account is
                  authorised for
                  Meet Shawon Drive.
                  Private storage
                  services will become
                  available here once
                  the NAS integration
                  is completed.
                </p>

                <div className="mt-8 rounded-2xl border border-green-400/20 bg-green-400/[0.06] p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={
                        20
                      }
                      className="mt-0.5 shrink-0 text-green-300"
                    />

                    <div>
                      <p className="font-medium text-white">
                        Access authorised
                      </p>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        Your account has
                        permission to
                        access the private
                        Drive environment.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled
                  className="mt-6 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-medium text-black opacity-50"
                >
                  NAS Connection
                  Coming Soon

                  <ArrowRight
                    size={
                      18
                    }
                  />
                </button>

                <p className="mt-4 text-center text-xs leading-6 text-gray-600">
                  Private storage
                  infrastructure has
                  not yet been
                  connected.
                </p>
              </div>

            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}