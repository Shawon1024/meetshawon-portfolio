import Link from "next/link";
import {
  ArrowLeft,
  Users,
} from "lucide-react";
import { redirect } from "next/navigation";

import Container from "../../components/Container";
import UserManagementManager from "../../components/admin/UserManagementManager";
import { createClient } from "../../lib/supabase/server";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  // --------------------------------------------------
  // AUTH
  // --------------------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  // --------------------------------------------------
  // ADMIN CHECK
  // --------------------------------------------------

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    profile?.role !== "admin"
  ) {
    redirect("/account");
  }

  // --------------------------------------------------
  // LOAD USERS
  // --------------------------------------------------

  const {
    data: users,
    error: usersError,
  } = await supabase
    .from("profiles")
    .select(`
      id,
      display_name,
      avatar_url,
      role,
      verified
    `)
    .order("display_name", {
      ascending: true,
    });

  if (usersError) {
    console.error(
      "Admin users query failed:",
      usersError,
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main>
      {/* Header */}

      <section className="px-6 pb-10 pt-16 md:pt-24">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-green-400"
          >
            <ArrowLeft size={16} />
            Back to Admin
          </Link>

          <div className="mt-8 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
            <Users size={24} />
          </div>

          <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            User Management
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white">
            Community Accounts
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-gray-400">
            Search users, manage verification, and review account roles across
            the site.
          </p>
        </div>
      </section>

      {/* User manager */}

      <section className="border-t border-white/5 py-16">
        <Container>
          <div className="mx-auto max-w-6xl">
            {usersError ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-300">
                <p className="font-medium">
                  Users could not be loaded.
                </p>

                <p className="mt-2 text-sm">
                  {usersError.message}
                </p>
              </div>
            ) : (
              <UserManagementManager
                initialUsers={users ?? []}
                currentUserId={user.id}
              />
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}