import {
  redirect,
} from "next/navigation";

import { createClient } from "../lib/supabase/server";

export default async function SupabaseTestPage() {
  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  // Not logged in
  if (!user) {
    redirect(
      "/auth/sign-in",
    );
  }

  const {
    data: profile,
    error:
      profileError,
  } = await supabase
    .from("profiles")
    .select(`
      role
    `)
    .eq(
      "id",
      user.id,
    )
    .single();

  // Not admin
  if (
    profileError ||
    !profile ||
    profile.role !==
      "admin"
  ) {
    redirect(
      "/",
    );
  }

  // --------------------------------------------------
  // ADMIN-ONLY TEST
  // --------------------------------------------------

  const {
    data,
    error,
  } = await supabase
    .from("profiles")
    .select("id")
    .limit(5);

  return (
    <main className="px-6 py-20">
      <div className="mx-auto max-w-4xl">

        <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
          Admin Tool
        </p>

        <h1 className="mt-3 text-4xl font-bold text-white">
          Supabase Test
        </h1>

        <p className="mt-4 text-gray-400">
          Internal Supabase connectivity and database test page.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
          {error ? (
            <>
              <p className="font-medium text-red-300">
                Supabase test failed
              </p>

              <pre className="mt-4 overflow-x-auto whitespace-pre-wrap text-sm text-red-200">
                {JSON.stringify(
                  error,
                  null,
                  2,
                )}
              </pre>
            </>
          ) : (
            <>
              <p className="font-medium text-green-300">
                Supabase connection successful
              </p>

              <p className="mt-2 text-sm text-gray-400">
                The database responded successfully.
              </p>

              <pre className="mt-5 overflow-x-auto rounded-xl bg-black/20 p-4 text-xs text-gray-300">
                {JSON.stringify(
                  data,
                  null,
                  2,
                )}
              </pre>
            </>
          )}
        </div>

      </div>
    </main>
  );
}