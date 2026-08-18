"use client";

import {
  KeyRound,
  Loader2,
  LogOut,
  Mail,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { createClient } from "../../lib/supabase/client";

interface AccountSecurityProps {
  email: string | null;
}

export default function AccountSecurity({
  email,
}: AccountSecurityProps) {
  const router =
    useRouter();

  const supabase =
    createClient();

  // ==================================================
  // EMAIL STATE
  // ==================================================

  const [
    emailFormOpen,
    setEmailFormOpen,
  ] = useState(false);

  const [
    newEmail,
    setNewEmail,
  ] = useState("");

  const [
    emailPassword,
    setEmailPassword,
  ] = useState("");

  const [
    changingEmail,
    setChangingEmail,
  ] = useState(false);

  const [
    emailNotice,
    setEmailNotice,
  ] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  // ==================================================
  // PASSWORD STATE
  // ==================================================

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    changingPassword,
    setChangingPassword,
  ] = useState(false);

  const [
    sendingResetEmail,
    setSendingResetEmail,
  ] = useState(false);

  const [
    passwordNotice,
    setPasswordNotice,
  ] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  // ==================================================
  // SESSION STATE
  // ==================================================

  const [
    signingOut,
    setSigningOut,
  ] = useState(false);

  const [
    signingOutEverywhere,
    setSigningOutEverywhere,
  ] = useState(false);

  const [
    sessionNotice,
    setSessionNotice,
  ] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  // ==================================================
  // DELETE ACCOUNT STATE
  // ==================================================

  const [
    deleteModalOpen,
    setDeleteModalOpen,
  ] = useState(false);

  const [
    deleteConfirmation,
    setDeleteConfirmation,
  ] = useState("");

  const [
    deletingAccount,
    setDeletingAccount,
  ] = useState(false);

  const [
    deleteError,
    setDeleteError,
  ] = useState("");

  // ==================================================
  // CHANGE EMAIL
  // ==================================================

  const handleEmailChange =
    async (
      event: FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      setEmailNotice(null);

      const currentEmail =
        email
          ?.trim()
          .toLowerCase() ??
        "";

      const cleanNewEmail =
        newEmail
          .trim()
          .toLowerCase();

      if (!currentEmail) {
        setEmailNotice({
          type: "error",
          message:
            "Your current email address could not be determined. Refresh the page and try again.",
        });

        return;
      }

      if (!cleanNewEmail) {
        setEmailNotice({
          type: "error",
          message:
            "Enter the new email address you want to use.",
        });

        return;
      }

      if (
        cleanNewEmail ===
        currentEmail
      ) {
        setEmailNotice({
          type: "error",
          message:
            "This is already your current email address. Enter a different email address.",
        });

        return;
      }

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          cleanNewEmail,
        )
      ) {
        setEmailNotice({
          type: "error",
          message:
            "Enter a valid email address before continuing.",
        });

        return;
      }

      if (!emailPassword) {
        setEmailNotice({
          type: "error",
          message:
            "Enter your current password to confirm this email change.",
        });

        return;
      }

      try {
        setChangingEmail(
          true,
        );

        const {
          data:
            signInData,
          error:
            signInError,
        } =
          await supabase.auth.signInWithPassword(
            {
              email:
                currentEmail,

              password:
                emailPassword,
            },
          );

        if (
          signInError ||
          !signInData.user
        ) {
          setEmailNotice({
            type: "error",
            message:
              "The current password you entered is incorrect. Your email address has not been changed.",
          });

          return;
        }

        const {
          error:
            updateError,
        } =
          await supabase.auth.updateUser(
            {
              email:
                cleanNewEmail,
            },
          );

        if (updateError) {
          const authError =
            updateError as {
              code?: string;
              message?: string;
            };

          const code =
            authError.code ??
            "";

          const message =
            (
              authError.message ??
              ""
            ).toLowerCase();

          const emailAlreadyExists =
            code ===
              "email_exists" ||
            code ===
              "user_already_exists" ||
            code ===
              "identity_already_exists" ||
            message.includes(
              "already registered",
            ) ||
            message.includes(
              "already exists",
            ) ||
            message.includes(
              "already been registered",
            );

          if (
            emailAlreadyExists
          ) {
            setEmailNotice({
              type: "error",
              message:
                "An account with this email address already exists. Please use a different email address.",
            });

            return;
          }

          if (
            code ===
            "over_email_send_rate_limit"
          ) {
            setEmailNotice({
              type: "error",
              message:
                "Too many verification emails were requested. Please wait a little while before trying again.",
            });

            return;
          }

          console.warn(
            "Email change request failed:",
            updateError,
          );

          setEmailNotice({
            type: "error",
            message:
              updateError.message ||
              "Your email address could not be changed. Please try again.",
          });

          return;
        }

        setNewEmail("");
        setEmailPassword("");
        setEmailFormOpen(
          false,
        );

        setEmailNotice({
          type: "success",
          message:
            "Email change requested. Check your new email address and verify it to complete the change. Your current email remains active for sign-in until the new address is verified.",
        });
      } catch (error) {
        console.warn(
          "Unexpected email change error:",
          error,
        );

        setEmailNotice({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Your email address could not be changed. Please try again.",
        });
      } finally {
        setChangingEmail(
          false,
        );
      }
    };

  // ==================================================
  // CHANGE PASSWORD
  // ==================================================

  const handlePasswordChange =
    async (
      event: FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      setPasswordNotice(null);

      const currentEmail =
        email
          ?.trim()
          .toLowerCase() ??
        "";

      if (!currentEmail) {
        setPasswordNotice({
          type: "error",
          message:
            "Your account email could not be determined. Refresh the page and try again.",
        });

        return;
      }

      if (!currentPassword) {
        setPasswordNotice({
          type: "error",
          message:
            "Enter your current password.",
        });

        return;
      }

      if (
        newPassword.length <
        8
      ) {
        setPasswordNotice({
          type: "error",
          message:
            "Your new password must be at least 8 characters long.",
        });

        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        setPasswordNotice({
          type: "error",
          message:
            "The new passwords do not match.",
        });

        return;
      }

      if (
        currentPassword ===
        newPassword
      ) {
        setPasswordNotice({
          type: "error",
          message:
            "Your new password must be different from your current password.",
        });

        return;
      }

      try {
        setChangingPassword(
          true,
        );

        const {
          data:
            signInData,
          error:
            signInError,
        } =
          await supabase.auth.signInWithPassword(
            {
              email:
                currentEmail,

              password:
                currentPassword,
            },
          );

        if (
          signInError ||
          !signInData.user
        ) {
          setPasswordNotice({
            type: "error",
            message:
              "Your current password is incorrect.",
          });

          return;
        }

        const {
          error:
            updateError,
        } =
          await supabase.auth.updateUser(
            {
              password:
                newPassword,
            },
          );

        if (updateError) {
          console.warn(
            "Password update failed:",
            updateError,
          );

          setPasswordNotice({
            type: "error",
            message:
              updateError.message ||
              "Your password could not be updated.",
          });

          return;
        }

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setPasswordNotice({
          type: "success",
          message:
            "Your password has been updated successfully.",
        });
      } catch (error) {
        console.warn(
          "Unexpected password update error:",
          error,
        );

        setPasswordNotice({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Your password could not be updated.",
        });
      } finally {
        setChangingPassword(
          false,
        );
      }
    };

  // ==================================================
  // FORGOT PASSWORD
  // ==================================================

  const sendPasswordReset =
    async () => {
      setPasswordNotice(null);

      if (!email) {
        setPasswordNotice({
          type: "error",
          message:
            "Your account email could not be determined.",
        });

        return;
      }

      try {
        setSendingResetEmail(
          true,
        );

        const redirectTo =
          `${window.location.origin}/auth/reset-password`;

        const {
          error:
            resetError,
        } =
          await supabase.auth.resetPasswordForEmail(
            email,
            {
              redirectTo,
            },
          );

        if (resetError) {
          const code =
            (
              resetError as {
                code?: string;
              }
            ).code ??
            "";

          if (
            code ===
            "over_email_send_rate_limit"
          ) {
            setPasswordNotice({
              type: "error",
              message:
                "Too many reset emails were requested. Please wait a little while before trying again.",
            });

            return;
          }

          console.warn(
            "Password reset request failed:",
            resetError,
          );

          setPasswordNotice({
            type: "error",
            message:
              resetError.message ||
              "The password reset email could not be sent.",
          });

          return;
        }

        setPasswordNotice({
          type: "success",
          message:
            "Password reset email sent. Check your inbox and follow the link to choose a new password.",
        });
      } catch (error) {
        console.warn(
          "Unexpected password reset error:",
          error,
        );

        setPasswordNotice({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "The password reset email could not be sent.",
        });
      } finally {
        setSendingResetEmail(
          false,
        );
      }
    };

  // ==================================================
  // SIGN OUT CURRENT SESSION
  // ==================================================

  const signOutCurrent =
    async () => {
      setSessionNotice(null);

      try {
        setSigningOut(
          true,
        );

        const {
          error,
        } =
          await supabase.auth.signOut(
            {
              scope: "local",
            },
          );

        if (error) {
          throw error;
        }

        router.push(
          "/auth/sign-in",
        );

        router.refresh();
      } catch (error) {
        setSessionNotice({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "You could not be signed out.",
        });
      } finally {
        setSigningOut(
          false,
        );
      }
    };

  // ==================================================
  // SIGN OUT ALL SESSIONS
  // ==================================================

  const signOutEverywhere =
    async () => {
      setSessionNotice(null);

      try {
        setSigningOutEverywhere(
          true,
        );

        const {
          error,
        } =
          await supabase.auth.signOut(
            {
              scope: "global",
            },
          );

        if (error) {
          throw error;
        }

        router.push(
          "/auth/sign-in",
        );

        router.refresh();
      } catch (error) {
        setSessionNotice({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Your sessions could not be signed out.",
        });
      } finally {
        setSigningOutEverywhere(
          false,
        );
      }
    };

  // ==================================================
  // OPEN DELETE MODAL
  // ==================================================

  const openDeleteModal =
    () => {
      setDeleteError("");
      setDeleteConfirmation(
        "",
      );

      setDeleteModalOpen(
        true,
      );
    };

  // ==================================================
  // CLOSE DELETE MODAL
  // ==================================================

  const closeDeleteModal =
    () => {
      if (
        deletingAccount
      ) {
        return;
      }

      setDeleteModalOpen(
        false,
      );

      setDeleteConfirmation(
        "",
      );

      setDeleteError("");
    };

  // ==================================================
  // DELETE ACCOUNT
  // ==================================================

  const deleteAccount =
    async () => {
      if (
        deleteConfirmation !==
        "DELETE"
      ) {
        setDeleteError(
          'Type "DELETE" exactly to confirm.',
        );

        return;
      }

      setDeleteError("");

      try {
        setDeletingAccount(
          true,
        );

        const response =
          await fetch(
            "/api/account/delete",
            {
              method:
                "DELETE",

              headers: {
                "Content-Type":
                  "application/json",
              },
            },
          );

        const result =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            result.error ??
              "Your account could not be deleted.",
          );
        }

        /*
         * The server has already removed the
         * Supabase Auth account.
         *
         * Clear any remaining local auth data.
         */
        try {
          await supabase.auth.signOut({
            scope: "local",
          });
        } catch {
          // The user may already no longer exist.
        }

        router.replace(
          "/",
        );

        router.refresh();
      } catch (error) {
        setDeleteError(
          error instanceof Error
            ? error.message
            : "Your account could not be deleted.",
        );

        setDeletingAccount(
          false,
        );
      }
    };

  return (
    <>
      <div className="space-y-8">
        {/* =================================================
            ACCOUNT EMAIL
        ================================================= */}

        <section className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-8">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
              <Mail
                size={19}
              />
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-300">
                Email
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-white">
                Email Address
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-gray-400">
                Manage the email address used to sign in to your account.
              </p>
            </div>
          </div>

          <div className="mt-7 rounded-xl border border-white/10 bg-black/10 p-4">
            <p className="text-sm text-gray-500">
              Current email
            </p>

            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="break-all font-medium text-white">
                {email ??
                  "Unknown"}
              </p>

              {!emailFormOpen && (
                <button
                  type="button"
                  onClick={() => {
                    setEmailNotice(null);

                    setEmailFormOpen(
                      true,
                    );
                  }}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-400/20 bg-blue-400/10 px-4 py-2.5 text-sm font-medium text-blue-300 transition hover:bg-blue-400/15"
                >
                  <Mail
                    size={16}
                  />

                  Change Email
                </button>
              )}
            </div>
          </div>

          {emailFormOpen && (
            <form
              onSubmit={
                handleEmailChange
              }
              className="mt-7 space-y-5"
            >
              <label className="block text-sm font-medium text-gray-300">
                New email address

                <input
                  type="email"
                  value={
                    newEmail
                  }
                  onChange={(
                    event,
                  ) =>
                    setNewEmail(
                      event.target
                        .value,
                    )
                  }
                  disabled={
                    changingEmail
                  }
                  autoComplete="email"
                  maxLength={254}
                  placeholder="new@example.com"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-gray-300">
                Current password

                <input
                  type="password"
                  value={
                    emailPassword
                  }
                  onChange={(
                    event,
                  ) =>
                    setEmailPassword(
                      event.target
                        .value,
                    )
                  }
                  disabled={
                    changingEmail
                  }
                  autoComplete="current-password"
                  placeholder="Enter your current password"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                  required
                />
              </label>

              <div className="rounded-xl border border-blue-400/10 bg-blue-400/[0.04] p-4">
                <p className="text-sm leading-6 text-gray-400">
                  A verification link will be sent to your new email address. Your current
                  email remains active until the new address is verified. The new
                  email also cannot already belong to another account.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={
                    changingEmail
                  }
                  onClick={() => {
                    setEmailFormOpen(
                      false,
                    );

                    setNewEmail("");
                    setEmailPassword("");
                    setEmailNotice(null);
                  }}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    changingEmail
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {changingEmail ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Mail
                      size={17}
                    />
                  )}

                  {changingEmail
                    ? "Requesting Change..."
                    : "Confirm Email Change"}
                </button>
              </div>
            </form>
          )}

          {emailNotice && (
            <p
              role={
                emailNotice.type ===
                "error"
                  ? "alert"
                  : "status"
              }
              className={`mt-5 rounded-xl border px-4 py-3 text-sm leading-6 ${
                emailNotice.type ===
                "error"
                  ? "border-red-400/20 bg-red-400/10 text-red-300"
                  : "border-green-400/20 bg-green-400/10 text-green-300"
              }`}
            >
              {
                emailNotice.message
              }
            </p>
          )}

          <p className="mt-5 text-xs leading-5 text-gray-500">
            Your login email is private and is not displayed on your public
            profile. After the change is completed, your previous email address
            can receive a security notification if Email address changed
            notifications are enabled in Supabase.
          </p>
        </section>

        {/* =================================================
            CHANGE PASSWORD
        ================================================= */}

        <section className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-8">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
              <KeyRound
                size={19}
              />
            </div>

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
                Password
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-white">
                Change Password
              </h2>
            </div>
          </div>

          <form
            onSubmit={
              handlePasswordChange
            }
            className="mt-8 space-y-5"
          >
            <label className="block text-sm font-medium text-gray-300">
              Current password

              <input
                type="password"
                value={
                  currentPassword
                }
                onChange={(
                  event,
                ) =>
                  setCurrentPassword(
                    event.target
                      .value,
                  )
                }
                disabled={
                  changingPassword
                }
                autoComplete="current-password"
                placeholder="Enter your current password"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400 disabled:cursor-not-allowed disabled:opacity-60"
                required
              />
            </label>

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
                disabled={
                  changingPassword
                }
                autoComplete="new-password"
                placeholder="Enter a new password"
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400"
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
                disabled={
                  changingPassword
                }
                autoComplete="new-password"
                placeholder="Enter the password again"
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400"
              />
            </label>

            <div className="flex flex-col gap-3 text-xs leading-5 text-gray-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Use at least 8 characters. A longer, unique password is
                recommended.
              </p>

              <button
                type="button"
                disabled={
                  sendingResetEmail
                }
                onClick={() => {
                  void sendPasswordReset();
                }}
                className="w-fit font-medium text-green-400 transition hover:text-green-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sendingResetEmail
                  ? "Sending reset email..."
                  : "Forgot your password?"}
              </button>
            </div>

            {passwordNotice && (
              <p
                role={
                  passwordNotice.type ===
                  "error"
                    ? "alert"
                    : "status"
                }
                className={`rounded-xl border px-4 py-3 text-sm leading-6 ${
                  passwordNotice.type ===
                  "error"
                    ? "border-red-400/20 bg-red-400/10 text-red-300"
                    : "border-green-400/20 bg-green-400/10 text-green-300"
                }`}
              >
                {
                  passwordNotice.message
                }
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={
                  changingPassword ||
                  sendingResetEmail
                }
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {changingPassword ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <KeyRound
                    size={17}
                  />
                )}

                {changingPassword
                  ? "Updating..."
                  : "Update Password"}
              </button>
            </div>
          </form>
        </section>

        {/* =================================================
            SESSIONS
        ================================================= */}

        <section className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 md:p-8">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
              <ShieldCheck
                size={19}
              />
            </div>

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
                Sessions
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-white">
                Sign-in Sessions
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-gray-400">
                Sign out of this browser only, or revoke your sign-in sessions
                across all devices.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {/* Current Browser */}

            <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
              <h3 className="font-medium text-white">
                Current Browser
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                End this browser session while leaving your other devices
                signed in.
              </p>

              <button
                type="button"
                disabled={
                  signingOut ||
                  signingOutEverywhere
                }
                onClick={() => {
                  void signOutCurrent();
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-green-400/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {signingOut ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <LogOut
                    size={16}
                  />
                )}

                {signingOut
                  ? "Signing out..."
                  : "Sign Out"}
              </button>
            </div>

            {/* All Devices */}

            <div className="rounded-2xl border border-red-400/10 bg-red-400/[0.03] p-5">
              <h3 className="font-medium text-white">
                All Devices
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Revoke your active sessions on other browsers and devices.
              </p>

              <button
                type="button"
                disabled={
                  signingOut ||
                  signingOutEverywhere
                }
                onClick={() => {
                  void signOutEverywhere();
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-400/20 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {signingOutEverywhere ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <LogOut
                    size={16}
                  />
                )}

                {signingOutEverywhere
                  ? "Signing out..."
                  : "Sign Out Everywhere"}
              </button>
            </div>
          </div>

          {sessionNotice && (
            <p
              role={
                sessionNotice.type ===
                "error"
                  ? "alert"
                  : "status"
              }
              className={`mt-6 rounded-xl border px-4 py-3 text-sm leading-6 ${
                sessionNotice.type ===
                "error"
                  ? "border-red-400/20 bg-red-400/10 text-red-300"
                  : "border-green-400/20 bg-green-400/10 text-green-300"
              }`}
            >
              {
                sessionNotice.message
              }
            </p>
          )}
        </section>

        {/* =================================================
            DANGER ZONE
        ================================================= */}

        <section className="rounded-3xl border border-red-400/20 bg-red-400/[0.03] p-6 md:p-8">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
              <TriangleAlert
                size={20}
              />
            </div>

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-300">
                Danger Zone
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-white">
                Delete Account
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-gray-400">
                Permanently delete your account and remove your access to the
                site. This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-red-400/10 bg-black/10 p-5">
            <h3 className="font-medium text-white">
              Permanently delete your account
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Your authentication account will be permanently removed. Related
              profile and community data may also be removed according to the
              database relationships configured for your account.
            </p>

            <button
              type="button"
              onClick={
                openDeleteModal
              }
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-400"
            >
              <Trash2
                size={17}
              />

              Delete Account
            </button>
          </div>
        </section>
      </div>

      {/* =================================================
          DELETE ACCOUNT MODAL
      ================================================= */}

      {deleteModalOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 px-5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
          onMouseDown={(
            event,
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeDeleteModal();
            }
          }}
        >
          <div className="relative w-full max-w-lg rounded-3xl border border-red-400/20 bg-[#102A2A] p-6 shadow-2xl md:p-8">
            {/* Close */}

            <button
              type="button"
              disabled={
                deletingAccount
              }
              onClick={
                closeDeleteModal
              }
              className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
              aria-label="Close delete account confirmation"
            >
              <X
                size={20}
              />
            </button>

            {/* Warning */}

            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
              <TriangleAlert
                size={24}
              />
            </div>

            <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-red-300">
              Permanent Action
            </p>

            <h2
              id="delete-account-title"
              className="mt-3 pr-10 text-2xl font-bold text-white"
            >
              Delete your account?
            </h2>

            <p className="mt-4 leading-7 text-gray-400">
              This permanently removes your login account. You will not be able
              to recover it after deletion.
            </p>

            {email && (
              <div className="mt-5 rounded-xl border border-white/10 bg-black/10 p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Account
                </p>

                <p className="mt-2 break-all text-sm text-gray-300">
                  {email}
                </p>
              </div>
            )}

            {/* Confirmation */}

            <label className="mt-6 block text-sm font-medium text-gray-300">
              Type{" "}
              <span className="font-bold text-red-300">
                DELETE
              </span>{" "}
              to confirm

              <input
                type="text"
                value={
                  deleteConfirmation
                }
                disabled={
                  deletingAccount
                }
                onChange={(
                  event,
                ) => {
                  setDeleteConfirmation(
                    event.target
                      .value,
                  );

                  setDeleteError(
                    "",
                  );
                }}
                autoComplete="off"
                placeholder="DELETE"
                className="mt-3 w-full rounded-xl border border-red-400/20 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-red-400 disabled:opacity-50"
              />
            </label>

            {deleteError && (
              <p
                role="alert"
                className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
              >
                {
                  deleteError
                }
              </p>
            )}

            {/* Buttons */}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={
                  deletingAccount
                }
                onClick={
                  closeDeleteModal
                }
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition hover:border-white/20 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  deletingAccount ||
                  deleteConfirmation !==
                    "DELETE"
                }
                onClick={() => {
                  void deleteAccount();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deletingAccount ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2
                    size={17}
                  />
                )}

                {deletingAccount
                  ? "Deleting Account..."
                  : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}