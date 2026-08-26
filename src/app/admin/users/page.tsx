import Link from "next/link";
import { ArrowLeft, Scale, ShieldCheck, Users } from "lucide-react";
import { redirect } from "next/navigation";

import Container from "../../components/Container";
import DriveRetentionManager, {
  type DriveAccountReview,
} from "../../components/admin/DriveRetentionManager";
import UserManagementManager from "../../components/admin/UserManagementManager";
import { createClient } from "../../lib/supabase/server";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    redirect("/account");
  }

  const [
    usersResult,
    pendingAppealsResult,
    driveAccountsResult,
    labAccessResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(`
        id,
        first_name,
        last_name,
        username,
        avatar_url,
        role,
        verified
      `)
      .order("username", {
        ascending: true,
        nullsFirst: false,
      }),
    supabase
      .from("account_block_appeals")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.rpc("admin_list_drive_accounts"),
    supabase
      .from("lab_access_members")
      .select("user_id, access_level, status"),
  ]);

  const users = usersResult.data;
  const usersError = usersResult.error;
  const pendingAppeals = pendingAppealsResult.count ?? 0;

  const profileById = new Map(
    (users ?? []).map((userProfile) => [userProfile.id, userProfile]),
  );

  const labAccessByUserId = new Map(
    (labAccessResult.data ?? []).map((membership) => [
      membership.user_id,
      membership,
    ]),
  );

  const usersWithLabAccess = (users ?? []).map((userProfile) => ({
    ...userProfile,
    lab_access: labAccessByUserId.get(userProfile.id) ?? null,
  }));

  const driveAccounts = (
    (driveAccountsResult.data as DriveAccountReview[] | null) ?? []
  ).map((account) => {
    const accountProfile = profileById.get(account.user_id);

    return {
      ...account,
      first_name: accountProfile?.first_name ?? null,
      last_name: accountProfile?.last_name ?? null,
      website_username:
        accountProfile?.username ?? account.website_username,
      avatar_url: accountProfile?.avatar_url ?? null,
    };
  });

  if (usersError) {
    console.error("Admin users query failed:", usersError);
  }

  if (pendingAppealsResult.error) {
    console.error(
      "Pending appeals count failed:",
      pendingAppealsResult.error,
    );
  }

  if (driveAccountsResult.error) {
    console.error(
      "Admin Drive accounts query failed:",
      driveAccountsResult.error,
    );
  }

  if (labAccessResult.error) {
    console.error(
      "Admin Lab access query failed:",
      labAccessResult.error,
    );
  }

  const userManagementError = usersError ?? labAccessResult.error;

  return (
    <main>
      <section className="px-6 pb-10 pt-16 md:pt-24">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-green-400"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Admin
          </Link>

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                <Users size={24} aria-hidden="true" />
              </div>

              <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                User Management
              </p>

              <h1 className="mt-3 text-4xl font-bold text-white">
                Community Accounts
              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                Search users, manage verification, roles and Lab access, review
                Drive retention, and handle blocked-account appeals.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin/appeals"
                className="group relative inline-flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-2.5 text-sm font-medium text-amber-300 transition duration-200 hover:border-amber-400/40 hover:bg-amber-400/15 hover:text-amber-200"
              >
                <Scale
                  size={17}
                  className="transition-transform duration-200 group-hover:scale-110"
                  aria-hidden="true"
                />
                <span>Account Appeals</span>

                {pendingAppeals > 0 ? (
                  <span className="ml-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full border border-red-400/20 bg-red-400/10 px-1.5 text-[11px] font-bold leading-none text-red-300">
                    {pendingAppeals > 99 ? "99+" : pendingAppeals}
                  </span>
                ) : null}
              </Link>

              <Link
                href="/moderation"
                className="group relative inline-flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-400/10 px-4 py-2.5 text-sm font-medium text-blue-300 transition duration-200 hover:border-blue-400/40 hover:bg-blue-400/15 hover:text-blue-200"
              >
                <ShieldCheck
                  size={17}
                  className="transition-transform duration-200 group-hover:scale-110"
                  aria-hidden="true"
                />
                <span>Moderation</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 py-16">
        <Container>
          <div className="mx-auto max-w-6xl">
            {driveAccountsResult.error ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-300">
                <p className="font-medium">
                  Drive retention accounts could not be loaded.
                </p>
                <p className="mt-2 text-sm">
                  {driveAccountsResult.error.message}
                </p>
              </div>
            ) : (
              <DriveRetentionManager
                initialAccounts={driveAccounts}
                serverNow={new Date().toISOString()}
              />
            )}

            <div className="mt-12">
              {userManagementError ? (
                <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-300">
                  <p className="font-medium">
                    Users or Lab access records could not be loaded.
                  </p>
                  <p className="mt-2 text-sm">
                    {userManagementError.message}
                  </p>
                </div>
              ) : (
                <UserManagementManager
                  initialUsers={usersWithLabAccess}
                  currentUserId={user.id}
                />
              )}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
