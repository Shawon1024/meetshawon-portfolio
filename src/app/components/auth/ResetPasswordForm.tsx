"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  CheckCircle2,
  KeyRound,
  Loader2,
} from "lucide-react";

import { createClient } from "../../lib/supabase/client";

export default function ResetPasswordForm() {
  const supabase =
    useMemo(
      () =>
        createClient(),
      [],
    );

  // --------------------------------------------------
  // RECOVERY STATE
  // --------------------------------------------------

  const [
    recoveryReady,
    setRecoveryReady,
  ] = useState(false);

  const [
    checkingRecovery,
    setCheckingRecovery,
  ] = useState(true);

  // --------------------------------------------------
  // PASSWORD STATE
  // --------------------------------------------------

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    updating,
    setUpdating,
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
  // VALIDATE PASSWORD RECOVERY SESSION
  // --------------------------------------------------

  useEffect(() => {
    let active = true;
    let recoveryDetected = false;

    const acceptRecoverySession = () => {
      if (!active) {
        return;
      }

      recoveryDetected = true;
      setRecoveryReady(true);
      setCheckingRecovery(false);
    };

    const {
      data:
        authListener,
    } =
      supabase.auth.onAuthStateChange(
        (
          event,
        ) => {
          if (
            event ===
            "PASSWORD_RECOVERY"
          ) {
            acceptRecoverySession();
          }
        },
      );

    /*
     * The recovery token may already have been verified
     * by /auth/confirm before this Client Component is
     * mounted. In that flow, Supabase stores the recovery
     * session in cookies and this component can miss the
     * PASSWORD_RECOVERY event entirely.
     *
     * getUser() validates the session with Supabase rather
     * than trusting locally stored session data.
     */
    const validateExistingSession = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!active || recoveryDetected) {
        return;
      }

      if (!error && user) {
        acceptRecoverySession();
        return;
      }

      /*
       * Allow a brief period for Supabase to process an
       * implicit-flow recovery URL and emit its auth event.
       */
      window.setTimeout(async () => {
        if (!active || recoveryDetected) {
          return;
        }

        const {
          data: { user: delayedUser },
          error: delayedError,
        } = await supabase.auth.getUser();

        if (!active || recoveryDetected) {
          return;
        }

        if (!delayedError && delayedUser) {
          acceptRecoverySession();
          return;
        }

        setRecoveryReady(false);
        setCheckingRecovery(false);
      }, 1200);
    };

    void validateExistingSession();

    return () => {
      active = false;

      authListener
        .subscription
        .unsubscribe();
    };
  }, [
    supabase,
  ]);

  // --------------------------------------------------
  // UPDATE PASSWORD
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

      if (
        !recoveryReady
      ) {
        setNotice({
          type:
            "error",

          message:
            "This password recovery session is not valid.",
        });

        return;
      }

      if (
        newPassword.length <
        8
      ) {
        setNotice({
          type:
            "error",

          message:
            "Your new password must be at least 8 characters long.",
        });

        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        setNotice({
          type:
            "error",

          message:
            "The passwords do not match.",
        });

        return;
      }

      try {
        setUpdating(
          true,
        );

        const {
          error,
        } =
          await supabase.auth.updateUser(
            {
              password:
                newPassword,
            },
          );

        if (error) {
          console.warn(
            "Password recovery update failed:",
            error,
          );

          setNotice({
            type:
              "error",

            message:
              error.message ||
              "Your password could not be reset.",
          });

          return;
        }

        setNewPassword(
          "",
        );

        setConfirmPassword(
          "",
        );

        /*
         * Prevent the recovery form from being used
         * repeatedly after the password was changed.
         */
        setRecoveryReady(
          false,
        );

        setNotice({
          type:
            "success",

          message:
            "Your password has been reset successfully. You can now sign in using your new password.",
        });

        /*
         * End the temporary recovery session after the
         * password has been changed successfully.
         */
        await supabase.auth.signOut({
          scope: "local",
        });
      } catch (
        error
      ) {
        console.warn(
          "Unexpected password recovery error:",
          error,
        );

        setNotice({
          type:
            "error",

          message:
            error instanceof Error
              ? error.message
              : "Your password could not be reset.",
        });
      } finally {
        setUpdating(
          false,
        );
      }
    };

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <section className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-8">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
        <KeyRound
          size={23}
        />
      </div>

      <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-green-400">
        Password Recovery
      </p>

      <h1 className="mt-3 text-3xl font-bold text-white">
        Choose a new password
      </h1>

      <p className="mt-4 leading-7 text-gray-400">
        Use the password recovery link sent to your email address to choose a
        new password.
      </p>

      {/* =================================================
          CHECKING RECOVERY LINK
      ================================================= */}

      {checkingRecovery && (
        <div className="mt-8 flex items-center gap-3 rounded-xl border border-white/10 bg-black/10 px-4 py-4 text-sm text-gray-400">
          <Loader2
            size={18}
            className="animate-spin text-green-300"
          />

          Checking password recovery link...
        </div>
      )}

      {/* =================================================
          VALID RECOVERY SESSION
      ================================================= */}

      {!checkingRecovery &&
        recoveryReady && (
          <form
            onSubmit={
              handleSubmit
            }
            className="mt-8 space-y-5"
          >
            <label className="block text-sm font-medium text-gray-300">
              New password

              <input
                type="password"
                value={
                  newPassword
                }
                onChange={(
                  event,
                ) =>
                  setNewPassword(
                    event.target
                      .value,
                  )
                }
                minLength={8}
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                disabled={
                  updating
                }
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <label className="block text-sm font-medium text-gray-300">
              Confirm new password

              <input
                type="password"
                value={
                  confirmPassword
                }
                onChange={(
                  event,
                ) =>
                  setConfirmPassword(
                    event.target
                      .value,
                  )
                }
                minLength={8}
                autoComplete="new-password"
                placeholder="Enter the password again"
                disabled={
                  updating
                }
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <p className="text-xs leading-5 text-gray-500">
              Use at least 8 characters. A longer and unique password is
              recommended.
            </p>

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
                updating
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updating ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <CheckCircle2
                  size={17}
                />
              )}

              {updating
                ? "Updating Password..."
                : "Set New Password"}
            </button>
          </form>
        )}

      {/* =================================================
          SUCCESS AFTER PASSWORD RESET
      ================================================= */}

      {!checkingRecovery &&
        !recoveryReady &&
        notice?.type ===
          "success" && (
          <div className="mt-8">
            <div className="rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-4 text-sm leading-6 text-green-300">
              {
                notice.message
              }
            </div>

            <Link
              href="/auth/sign-in"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-medium text-black transition hover:bg-green-400"
            >
              Sign In
            </Link>
          </div>
        )}

      {/* =================================================
          INVALID / DIRECT ACCESS
      ================================================= */}

      {!checkingRecovery &&
        !recoveryReady &&
        notice?.type !==
          "success" && (
          <div className="mt-8">
            <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-4 text-sm leading-6 text-amber-200">
              This password recovery link is missing, invalid, or expired.
              Request a new password reset email before trying again.
            </div>

            <Link
              href="/auth/sign-in"
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-white/10 px-5 py-3 font-medium text-gray-300 transition hover:border-green-400/30 hover:text-white"
            >
              Back to Sign In
            </Link>
          </div>
        )}
    </section>
  );
}
