import Link from "next/link";
import {
  Bookmark,
  MessageCircle,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { redirect } from "next/navigation";

import Container from "../components/Container";
import ProfileEditor from "../components/account/ProfileEditor";
import { createClient } from "../lib/supabase/server";

export default async function AccountPage() {
  const supabase =
    await createClient();

  // --------------------------------------------------
  // AUTH
  // --------------------------------------------------

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/auth/sign-in",
    );
  }

  // --------------------------------------------------
  // PROFILE
  // --------------------------------------------------

  const {
    data: profile,
    error,
  } = await supabase
    .from("profiles")
    .select(`
      display_name,
      username,
      username_set,
      bio,
      avatar_url,
      location,
      website_url,
      role,
      verified
    `)
    .eq(
      "id",
      user.id,
    )
    .single();

  if (
    error ||
    !profile
  ) {
    return (
      <main>
        <section className="px-6 py-24">
          <div className="mx-auto max-w-3xl rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-300">
            Your profile could not be loaded.
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      {/* =================================================
          HEADER
      ================================================= */}

      <section className="px-6 pb-12 pt-16 md:pt-24">
        <div className="mx-auto max-w-6xl">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
            <UserRound
              size={24}
            />
          </div>

          <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Account
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
            Your Profile
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-gray-400">
            Manage your public identity, profile photo, username, bio, and
            account details.
          </p>
        </div>
      </section>

      {/* =================================================
          QUICK LINKS
      ================================================= */}

      <section className="border-t border-white/5 py-10">
        <Container>
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Profile */}

            <div className="rounded-2xl border border-green-400/20 bg-green-400/10 p-5">
              <UserRound
                size={21}
                className="text-green-300"
              />

              <p className="mt-4 font-medium text-white">
                Profile
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Edit your public profile.
              </p>
            </div>

            {/* Saved */}

            <Link
              href="/account/saved"
              className="group rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5 transition hover:border-green-400/30"
            >
              <Bookmark
                size={21}
                className="text-gray-400 transition group-hover:text-green-300"
              />

              <p className="mt-4 font-medium text-white">
                Saved Articles
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Articles saved for later.
              </p>
            </Link>

            {/* Comments */}

<Link
  href="/account/activity"
  className="group rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5 transition hover:border-green-400/30"
>
  <MessageCircle
    size={21}
    className="text-gray-400 transition group-hover:text-green-300"
  />

  <p className="mt-4 font-medium text-white">
    My Activity
  </p>

  <p className="mt-2 text-sm text-gray-400">
    View your comments, replies, and reactions.
  </p>
</Link>

            {/* Security */}

            <Link
  href="/account/security"
  className="group rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5 transition hover:border-green-400/30"
>
  <ShieldCheck
    size={21}
    className="text-gray-400 transition group-hover:text-green-300"
  />

  <p className="mt-4 font-medium text-white">
    Security
  </p>

  <p className="mt-2 text-sm text-gray-400">
    Manage your password and sign-in sessions.
  </p>
</Link>
          </div>
        </Container>
      </section>

      {/* =================================================
          PROFILE EDITOR
      ================================================= */}

      <section className="border-t border-white/5 py-16">
        <Container>
          <div className="mx-auto max-w-5xl">
            <ProfileEditor
              userId={
                user.id
              }
              email={
                user.email ??
                null
              }
              initialProfile={
                profile
              }
            />
          </div>
        </Container>
      </section>
    </main>
  );
}