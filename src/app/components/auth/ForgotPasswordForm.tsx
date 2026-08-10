"use client";

import {
  FormEvent,
  useState,
} from "react";
import Link from "next/link";
import {
  KeyRound,
  Loader2,
  Mail,
} from "lucide-react";

import { createClient } from "../../lib/supabase/client";

export default function ForgotPasswordForm() {
  const [
    email,
    setEmail,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    notice,
    setNotice,
  ] = useState<{
    type:
      | "error"
      | "success";

    message:
      string;
  } | null>(
    null,
  );

  // --------------------------------------------------
  // SEND RESET EMAIL
  // --------------------------------------------------

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      setNotice(
        null,
      );

      const cleanEmail =
        email
          .trim()
          .toLowerCase();

      if (!cleanEmail) {
        setNotice({
          type:
            "error",

          message:
            "Enter your email address.",
        });

        return;
      }

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          cleanEmail,
        )
      ) {
        setNotice({
          type:
            "error",

          message:
            "Enter a valid email address.",
        });

        return;
      }

      try {
        setSubmitting(
          true,
        );

        const supabase =
          createClient();

        const redirectTo =
          `${window.location.origin}/auth/reset-password`;

        const {
          error,
        } =
          await supabase.auth.resetPasswordForEmail(
            cleanEmail,
            {
              redirectTo,
            },
          );

        if (error) {
          const code =
            (
              error as {
                code?: string;
              }
            ).code ??
            "";

          if (
            code ===
            "over_email_send_rate_limit"
          ) {
            setNotice({
              type:
                "error",

              message:
                "Too many password reset emails were requested. Please wait a little while and try again.",
            });

            return;
          }

          console.warn(
            "Password reset request failed:",
            error,
          );

          setNotice({
            type:
              "error",

            message:
              error.message ||
              "The password reset email could not be sent.",
          });

          return;
        }

        /*
         * Do not reveal whether the email exists.
         *
         * This prevents account enumeration.
         */
        setNotice({
          type:
            "success",

          message:
            "If an account exists for this email address, a password reset link has been sent. Check your inbox and spam folder.",
        });

        setEmail(
          "",
        );
      } catch (
        error
      ) {
        console.warn(
          "Unexpected password reset error:",
          error,
        );

        setNotice({
          type:
            "error",

          message:
            "The password reset request could not be completed. Please try again.",
        });
      } finally {
        setSubmitting(
          false,
        );
      }
    };

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 shadow-xl md:p-8">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
        <KeyRound
          size={23}
        />
      </div>

      <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
        Password Recovery
      </p>

      <h1 className="mt-3 text-3xl font-bold text-white">
        Forgot your password?
      </h1>

      <p className="mt-4 leading-7 text-gray-400">
        Enter the email address associated with your account. We&apos;ll send
        you a secure link to reset your password.
      </p>

      <form
        onSubmit={
          handleSubmit
        }
        className="mt-8 space-y-6"
      >
        <label className="block text-sm font-medium text-gray-300">
          Email

          <span className="ml-1 text-red-400">
            *
          </span>

          <div className="relative">
            <Mail
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-500"
            />

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
              autoComplete="email"
              maxLength={254}
              placeholder="you@example.com"
              disabled={
                submitting
              }
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/10 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </label>

        {notice && (
          <p
            role={
              notice.type ===
              "error"
                ? "alert"
                : "status"
            }
            className={`rounded-xl border px-4 py-3 text-sm leading-6 ${
              notice.type ===
              "error"
                ? "border-red-400/20 bg-red-400/10 text-red-300"
                : "border-green-400/20 bg-green-400/10 text-green-300"
            }`}
          >
            {
              notice.message
            }
          </p>
        )}

        <button
          type="submit"
          disabled={
            submitting
          }
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Sending...
            </>
          ) : (
            <>
              <Mail
                size={18}
              />

              Send Reset Link
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Remember your password?{" "}

        <Link
          href="/auth/sign-in"
          className="font-medium text-green-400 transition hover:text-green-300"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}