import Link from "next/link";
import {
  Ban,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { redirect } from "next/navigation";

import BlockAppealForm from "../../components/account/BlockAppealForm";
import Container from "../../components/Container";
import { createClient } from "../../lib/supabase/server";

export default async function BlockedAccountPage() {
  const supabase =
    await createClient();

  // --------------------------------------------------
  // AUTH
  // --------------------------------------------------

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/auth/sign-in",
    );
  }

  // --------------------------------------------------
  // RESTRICTION
  // --------------------------------------------------

  const {
    data:
      restriction,
    error:
      restrictionError,
  } = await supabase
    .from(
      "account_restrictions",
    )
    .select(`
      status,
      public_reason,
      updated_at
    `)
    .eq(
      "user_id",
      user.id,
    )
    .maybeSingle();

  if (
    restrictionError
  ) {
    console.error(
      "Blocked account restriction could not be loaded:",
      restrictionError,
    );
  }

  // --------------------------------------------------
  // NOT BLOCKED ANYMORE
  // --------------------------------------------------

  if (
    !restriction ||
    restriction.status !==
      "blocked"
  ) {
    redirect(
      "/account",
    );
  }

  // --------------------------------------------------
  // PENDING APPEAL
  // --------------------------------------------------

  const {
    data:
      pendingAppeal,
    error:
      appealError,
  } = await supabase
    .from(
      "account_block_appeals",
    )
    .select(`
      id
    `)
    .eq(
      "user_id",
      user.id,
    )
    .eq(
      "status",
      "pending",
    )
    .maybeSingle();

  if (
    appealError
  ) {
    console.error(
      "Pending appeal could not be loaded:",
      appealError,
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main>
      <section className="px-6 py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="overflow-hidden rounded-3xl border border-red-400/20 bg-[var(--surface)]/80 shadow-2xl">
              {/* =================================================
                  HEADER
              ================================================= */}

              <div className="border-b border-red-400/10 bg-red-400/[0.04] p-7 md:p-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-red-300">
                  <Ban
                    size={27}
                  />
                </div>

                <p className="mt-6 text-sm font-medium uppercase tracking-[0.22em] text-red-300">
                  Account Blocked
                </p>

                <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                  Your account has been blocked
                </h1>

                <p className="mt-4 leading-7 text-gray-400">
                  Your account currently has restricted access to authenticated
                  features on this website.
                </p>
              </div>

              {/* =================================================
                  CONTENT
              ================================================= */}

              <div className="space-y-6 p-7 md:p-10">
                {/* Reason */}

                <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldAlert
                      size={20}
                      className="mt-0.5 shrink-0 text-red-300"
                    />

                    <div>
                      <p className="font-medium text-white">
                        Reason
                      </p>

                      <p className="mt-2 leading-7 text-gray-400">
                        {restriction.public_reason ??
                          "No public reason was provided."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Information */}

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <p className="text-sm leading-6 text-gray-400">
                    If you believe this decision was made in error, you can
                    request a review from the administrator. Your appeal will
                    remain pending until it has been reviewed.
                  </p>
                </div>

                {/* Appeal */}

                <BlockAppealForm
                  hasPendingAppeal={
                    Boolean(
                      pendingAppeal,
                    )
                  }
                />

                {/* Public site */}

                <div className="text-center">
                  <Link
                    href="/"
                    className="text-sm text-gray-500 transition hover:text-white"
                  >
                    Return to public website
                  </Link>
                </div>
              </div>

              {/* =================================================
                  FOOTER
              ================================================= */}

              <div className="border-t border-white/10 px-7 py-5 md:px-10">
                <p className="flex items-center justify-center gap-2 text-xs text-gray-600">
                  <LogOut
                    size={13}
                  />

                  You can still sign out from the navigation menu.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}