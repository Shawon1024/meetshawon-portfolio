"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Cloud,
  Database,
  Eye,
  EyeOff,
  HardDrive,
  LockKeyhole,
  LogIn,
  Network,
  Server,
  ShieldCheck,
} from "lucide-react";
import {
  FormEvent,
  useState,
} from "react";
import {
  useRouter,
} from "next/navigation";

import {
  createClient,
} from "../../lib/supabase/client";

// --------------------------------------------------
// ANIMATED WI-FI SIGNAL
// --------------------------------------------------

function DriveWifiSignal() {
  return (
    <svg
      viewBox="0 0 32 32"
      width="27"
      height="27"
      fill="none"
      aria-label="Secure wireless connection active"
      className="shrink-0 text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.9)]"
    >
      <circle
        cx="16"
        cy="25"
        r="2.25"
        fill="currentColor"
        className="drive-wifi-dot"
      />

      <path
        d="M11.5 20.5C14.1 17.9 17.9 17.9 20.5 20.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        className="drive-wifi-arc-one"
      />

      <path
        d="M7.5 16.5C12.2 11.8 19.8 11.8 24.5 16.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        className="drive-wifi-arc-two"
      />

      <path
        d="M3.5 12.5C10.4 5.6 21.6 5.6 28.5 12.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        className="drive-wifi-arc-three"
      />
    </svg>
  );
}

// --------------------------------------------------
// ANIMATED ECG SIGNAL
// --------------------------------------------------

function DriveEcgSignal() {
  return (
    <svg
      viewBox="0 0 64 28"
      width="43"
      height="25"
      fill="none"
      aria-label="Gateway activity signal"
      className="shrink-0 overflow-visible text-green-300 drop-shadow-[0_0_7px_rgba(134,239,172,0.9)]"
    >
      <path
        d="M1 15H10L14 14L18 7L23 23L28 15H36L40 12L44 15H63"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drive-ecg-path"
      />

      <circle
        cx="63"
        cy="15"
        r="1.8"
        fill="currentColor"
        className="drive-ecg-dot"
      />
    </svg>
  );
}

export default function DriveSignInForm() {
  const router =
    useRouter();

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
          "Enter your email address and password.",
        );

        return;
      }

      try {
        setSubmitting(true);

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
            ).code ?? "";

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
              "Verify your email address before accessing Drive.",
            );

            return;
          }

          if (
            code ===
            "over_request_rate_limit"
          ) {
            setError(
              "Too many sign-in attempts. Wait briefly and try again.",
            );

            return;
          }

          console.warn(
            "Drive sign-in failed:",
            signInError,
          );

          setError(
            "Drive authentication failed. Please try again.",
          );

          return;
        }

        if (!data.user) {
          setError(
            "Your account could not be authenticated.",
          );

          return;
        }

        router.push(
          "/dashboard",
        );

        router.refresh();
      } catch (
        unexpectedError
      ) {
        console.warn(
          "Unexpected Drive sign-in error:",
          unexpectedError,
        );

        setError(
          "Drive is temporarily unable to process your sign-in.",
        );
      } finally {
        setSubmitting(false);
      }
    };

  const inputStyles =
    "mt-2 w-full rounded-xl border border-cyan-300/10 bg-[#0a1c29]/85 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="relative isolate overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[#071722]/80 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      {/* =============================================
          BACKGROUND EFFECTS
      ============================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-44 h-[30rem] w-[30rem] rounded-full bg-blue-400/25 blur-3xl" />

        <div className="absolute -bottom-52 right-0 h-[32rem] w-[32rem] rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="absolute left-1/3 top-1/3 h-72 w-72 rounded-full bg-green-300/10 blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.045)_1px,transparent_1px)] bg-[size:42px_42px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(3,15,24,0.58)_95%)]" />
      </div>

      {/* =============================================
          SYSTEM STATUS BAR
      ============================================= */}

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-black/10 px-6 py-3 text-xs sm:px-8">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="flex items-center gap-3 text-green-300">
            <span className="relative flex h-3 w-3">
              <span className="absolute -inset-1 animate-ping rounded-full bg-green-400/50" />

              <span className="absolute -inset-0.5 rounded-full bg-green-400/20" />

              <span className="relative m-auto inline-flex h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
            </span>

            Authentication gateway online
          </div>

          <div className="hidden items-center gap-2 text-slate-400 sm:flex">
            <LockKeyhole
              size={13}
            />

            Encrypted session
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <Network
            size={13}
          />

          drive.meetshawon.com
        </div>
      </div>

      <div className="relative z-10 grid lg:grid-cols-[1.12fr_0.88fr]">
        {/* =============================================
            NAS / CLOUD INTRODUCTION
        ============================================= */}

        <section className="relative overflow-hidden border-b border-white/[0.07] p-6 sm:p-9 lg:border-b-0 lg:border-r lg:p-11">
          {/* Drive logo */}

            <div className="relative aspect-[2025/777] w-full max-w-[390px] transition duration-300 group-hover:opacity-90">
              <Image
                src="/drive-logo.png"
                alt="Meet Shawon Drive"
                fill
                sizes="(max-width: 768px) 80vw, 390px"
                className="object-contain object-left"
                priority
              />
            </div>

          <div className="mt-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-cyan-300">
              <Cloud
                size={14}
              />

              Private cloud access
            </div>

            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.08] text-white sm:text-5xl">
              Your files.

              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-green-300 bg-clip-text text-transparent">
                Your private cloud.
              </span>
            </h1>

            <p className="mt-5 max-w-xl leading-7 text-slate-300">
              A self-hosted storage environment providing authenticated,
              role-controlled access to dedicated private datasets.
            </p>
          </div>

          {/* =============================================
              SECURE STORAGE ROUTE
          ============================================= */}

          <div className="mt-9 rounded-2xl border border-cyan-300/10 bg-black/15 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  Secure storage route
                </p>

                <p className="mt-1 font-medium text-white">
                  Account → Gateway → Private NAS
                </p>
              </div>

              <DriveWifiSignal />
            </div>

            <div className="mt-5 flex items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/10 text-blue-300">
                <LockKeyhole
                  size={18}
                />
              </div>

              <div className="mx-2 h-px flex-1 bg-gradient-to-r from-blue-400/60 via-cyan-400/30 to-green-400/60" />

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                <ShieldCheck
                  size={18}
                />
              </div>

              <div className="mx-2 h-px flex-1 bg-gradient-to-r from-cyan-400/60 via-cyan-400/30 to-green-400/60" />

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-green-400/20 bg-green-400/10 text-green-300">
                <Server
                  size={18}
                />
              </div>
            </div>
          </div>

          {/* =============================================
              INFRASTRUCTURE FEATURES
          ============================================= */}

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
              <HardDrive
                size={18}
                className="text-cyan-300"
              />

              <p className="mt-3 text-sm font-semibold text-white">
                ZFS storage
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Mirrored private storage
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
              <Database
                size={18}
                className="text-blue-300"
              />

              <p className="mt-3 text-sm font-semibold text-white">
                Dedicated data
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Isolated user datasets
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
              <ShieldCheck
                size={18}
                className="text-green-300"
              />

              <p className="mt-3 text-sm font-semibold text-white">
                Role access
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Admin and Partner only
              </p>
            </div>
          </div>
        </section>

        {/* =============================================
            AUTHENTICATION CONSOLE
        ============================================= */}

        <section className="flex items-center p-6 sm:p-9 lg:p-11">
          <div className="w-full">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-cyan-400">
                  Identity verification
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white">
                  Access Drive
                </h2>
              </div>

              <Server
                size={29}
                className="shrink-0 text-cyan-300 drop-shadow-[0_0_9px_rgba(103,232,249,0.7)]"
              />
            </div>

            <p className="mt-4 leading-7 text-slate-300">
              Authenticate with an authorised Meet Shawon account to access
              your assigned private storage.
            </p>

            {/* Gateway status */}

            <div className="mt-6 flex items-center gap-3 border-y border-green-400/10 py-3">
              <DriveEcgSignal />

              <div>
                <p className="text-sm font-medium text-green-200">
                  Gateway available
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  Storage integration status appears after authentication.
                </p>
              </div>
            </div>

            {/* =============================================
                SIGN-IN FORM
            ============================================= */}

            <form
              onSubmit={
                handleSubmit
              }
              className="mt-7 space-y-5"
            >
              <label className="block text-sm font-medium text-slate-200">
                Account email

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
                  maxLength={254}
                  disabled={
                    submitting
                  }
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
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
                    className="absolute right-3 top-[calc(50%+4px)] -translate-y-1/2 cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        size={18}
                      />
                    ) : (
                      <Eye
                        size={18}
                      />
                    )}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <LockKeyhole
                    size={13}
                  />

                  Authorised users only
                </div>

                <Link
                  href="https://www.meetshawon.com/auth/forgot-password"
                  className="text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-300"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={
                  submitting
                }
                className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-[length:200%_100%] px-6 py-3.5 font-semibold text-slate-950 shadow-lg shadow-blue-950/40 transition-all duration-300 hover:bg-right disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Verifying identity..."
                  : "Connect to Drive"}

                {!submitting && (
                  <LogIn
                    size={18}
                    className="transition group-hover:translate-x-0.5"
                  />
                )}
              </button>
            </form>

            <div className="mt-7 border-t border-white/[0.07] pt-5">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <Link
                  href="https://www.meetshawon.com"
                  className="transition hover:text-white"
                >
                  Return to portfolio
                </Link>

                <span>
                  Meet Shawon Private Infrastructure
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}