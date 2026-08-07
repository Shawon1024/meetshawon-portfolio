import { createClient } from "../lib/supabase/server";

export default async function SupabaseTestPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const isMissingSession =
    error?.message === "Auth session missing!";

  return (
    <main className="px-6 py-24">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-8">
        <h1 className="text-3xl font-bold text-white">
          Supabase connection test
        </h1>

        {error && !isMissingSession ? (
          <p className="mt-5 text-red-300">
            Connection error: {error.message}
          </p>
        ) : (
          <div className="mt-5 space-y-3 text-gray-300">
            <p>
              Supabase client created successfully.
            </p>

            <p>
              Authentication status:{" "}
              {user ? "Signed in" : "Not signed in"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}