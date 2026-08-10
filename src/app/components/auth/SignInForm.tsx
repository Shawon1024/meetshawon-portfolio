"use client";

import {
  FormEvent,
  useState,
} from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  LogIn,
} from "lucide-react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { createClient } from "../../lib/supabase/client";

export default function SignInForm() {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  // --------------------------------------------------
  // SIGN IN
  // --------------------------------------------------

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      setError("");

      const cleanEmail =
        email
          .trim()
          .toLowerCase();

      if (
        !cleanEmail ||
        !password
      ) {
        setError(
          "Please enter your email address and password.",
        );

        return;
      }

      try {
        setSubmitting(
          true,
        );

        const supabase =
          createClient();

        const {
          data,
          error:
            signInError,
        } =
          await supabase.auth.signInWithPassword(
            {
              email:
                cleanEmail,

              password,
            },
          );

        if (signInError) {
          const code =
            (
              signInError as {
                code?: string;
              }
            ).code ??
            "";

          const message =
            signInError.message
              .toLowerCase();

          if (
            code ===
              "invalid_credentials" ||
            message.includes(
              "invalid login credentials",
            )
          ) {
            setError(
              "The email address or password is incorrect.",
            );

            return;
          }

          if (
            code ===
              "email_not_confirmed" ||
            message.includes(
              "email not confirmed",
            )
          ) {
            setError(
              "Please verify your email address before signing in.",
            );

            return;
          }

          if (
            code ===
            "over_request_rate_limit"
          ) {
            setError(
              "Too many sign-in attempts. Please wait a little while and try again.",
            );

            return;
          }

          console.warn(
            "Sign in failed:",
            signInError,
          );

          setError(
            signInError.message ||
              "You could not be signed in.",
          );

          return;
        }

        if (
          !data.user
        ) {
          setError(
            "Your account could not be signed in.",
          );

          return;
        }

        // --------------------------------------------------
        // REDIRECT
        // --------------------------------------------------

        const next =
          searchParams.get(
            "next",
          );

        const safeNext =
          next &&
          next.startsWith(
            "/",
          ) &&
          !next.startsWith(
            "//",
          )
            ? next
            : "/account";

        router.push(
          safeNext,
        );

        router.refresh();
      } catch (
        error
      ) {
        console.warn(
          "Unexpected sign-in error:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "You could not be signed in.",
        );
      } finally {
        setSubmitting(
          false,
        );
      }
    };

  // --------------------------------------------------
  // STYLES
  // --------------------------------------------------

  const inputStyles =
    "mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400 disabled:cursor-not-allowed disabled:opacity-60";

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 shadow-xl md:p-8">
      <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
        Sign In
      </p>

      <h1 className="mt-3 text-3xl font-bold text-white">
        Welcome back
      </h1>

      <p className="mt-4 leading-7 text-gray-400">
        Sign in to manage your profile, comments, saved articles, and account
        settings.
      </p>

      <form
        onSubmit={
          handleSubmit
        }
        className="mt-8 space-y-6"
      >
        {/* =================================================
            EMAIL
        ================================================= */}

        <label className="block text-sm font-medium text-gray-300">
          Email

          <span className="ml-1 text-red-400">
            *
          </span>

          <input
            type="email"
            value={
              email
            }
            onChange={(
              event,
            ) =>
              setEmail(
                event.target
                  .value,
              )
            }
            className={
              inputStyles
            }
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={
              254
            }
            disabled={
              submitting
            }
            required
          />
        </label>

        {/* =================================================
            PASSWORD
        ================================================= */}

        <label className="block text-sm font-medium text-gray-300">
          Password

          <span className="ml-1 text-red-400">
            *
          </span>

          <div className="relative">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={
                password
              }
              onChange={(
                event,
              ) =>
                setPassword(
                  event.target
                    .value,
                )
              }
              className={`${inputStyles} pr-12`}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={
                submitting
              }
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (
                    current,
                  ) =>
                    !current,
                )
              }
              disabled={
                submitting
              }
              className="absolute right-3 top-[calc(50%+4px)] -translate-y-1/2 cursor-pointer rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff
                  size={
                    18
                  }
                />
              ) : (
                <Eye
                  size={
                    18
                  }
                />
              )}
            </button>
          </div>
        </label>

        {/* =================================================
            FORGOT PASSWORD
        ================================================= */}

        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-green-400 transition hover:text-green-300"
          >
            Forgot password?
          </Link>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-300"
          >
            {
              error
            }
          </p>
        )}

        {/* =================================================
            SUBMIT
        ================================================= */}

        <button
          type="submit"
          disabled={
            submitting
          }
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              Signing in...
            </>
          ) : (
            <>
              Sign In

              <LogIn
                size={
                  18
                }
              />
            </>
          )}
        </button>
      </form>

      {/* =================================================
          REGISTER
      ================================================= */}

      <p className="mt-6 text-center text-sm text-gray-400">
        Don&apos;t have an account?{" "}

        <Link
          href="/auth/sign-up"
          className="font-medium text-green-400 transition hover:text-green-300"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}