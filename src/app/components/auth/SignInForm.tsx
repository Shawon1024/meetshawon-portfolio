"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "../../lib/supabase/client";

export default function SignInForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setSubmitting(true);

      const supabase = createClient();

      const { error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) {
        throw error;
      }

      router.push("/account");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "You could not be signed in.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyles =
    "mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 shadow-2xl md:p-8">
      <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
        Welcome Back
      </p>

      <h1 className="mt-3 text-3xl font-bold text-white">
        Sign in
      </h1>

      <p className="mt-4 leading-7 text-gray-400">
        Sign in to comment, react, and manage your profile.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
      >
        <label className="block text-sm font-medium text-gray-300">
          Email

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            className={inputStyles}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={submitting}
            required
          />
        </label>

        <label className="block text-sm font-medium text-gray-300">
          Password

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            className={inputStyles}
            placeholder="Your password"
            autoComplete="current-password"
            disabled={submitting}
            required
          />
        </label>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Sign In"}
          <LogIn size={18} />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/sign-up"
          className="font-medium text-green-400 hover:text-green-300"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}