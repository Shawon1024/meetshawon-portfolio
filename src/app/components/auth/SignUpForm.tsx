"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";

import { createClient } from "../../lib/supabase/client";

export default function SignUpForm() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (
      !displayName.trim() ||
      !email.trim() ||
      !password
    ) {
      setError("Please complete every field.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Your password must contain at least 8 characters.",
      );
      return;
    }

    try {
      setSubmitting(true);

      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: displayName.trim(),
          },
        },
      });

      if (error) {
        throw error;
      }

      setMessage(
        "Account created. Check your email and confirm your account before signing in.",
      );

      setDisplayName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Your account could not be created.",
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
        Create Account
      </p>

      <h1 className="mt-3 text-3xl font-bold text-white">
        Join the community
      </h1>

      <p className="mt-4 leading-7 text-gray-400">
        Create an account to comment on articles and react to posts.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
      >
        <label className="block text-sm font-medium text-gray-300">
          Display name

          <input
            type="text"
            value={displayName}
            onChange={(event) =>
              setDisplayName(event.target.value)
            }
            className={inputStyles}
            placeholder="Your name"
            autoComplete="name"
            maxLength={100}
            disabled={submitting}
            required
          />
        </label>

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
            maxLength={254}
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
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            minLength={8}
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

        {message && (
          <p
            role="status"
            className="rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm text-green-300"
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Creating account..."
            : "Create Account"}

          <UserPlus size={18} />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link
          href="/auth/sign-in"
          className="font-medium text-green-400 hover:text-green-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}