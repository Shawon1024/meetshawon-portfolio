"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Binary,
  Eye,
  EyeOff,
  FlaskConical,
  KeyRound,
  LockKeyhole,
  LogIn,
  Network,
  ShieldCheck,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "../../lib/supabase/client";

export default function LabSignInForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Enter your email address and password.");
      return;
    }

    try {
      setSubmitting(true);

      const supabase = createClient();
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (signInError) {
        const code = (signInError as { code?: string }).code ?? "";
        const message = signInError.message.toLowerCase();

        if (
          code === "invalid_credentials" ||
          message.includes("invalid login credentials")
        ) {
          setError("The email address or password is incorrect.");
          return;
        }

        if (
          code === "email_not_confirmed" ||
          message.includes("email not confirmed")
        ) {
          setError("Verify your email address before accessing the Lab.");
          return;
        }

        if (code === "over_request_rate_limit") {
          setError("Too many sign-in attempts. Wait briefly and try again.");
          return;
        }

        console.warn("Lab sign-in failed:", signInError);
        setError("Lab authentication failed. Please try again.");
        return;
      }

      if (!data.user) {
        setError("Your account could not be authenticated.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (unexpectedError) {
      console.warn("Unexpected Lab sign-in error:", unexpectedError);
      setError("The Lab portal is temporarily unable to process your sign-in.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyles =
    "mt-2 w-full rounded-xl border border-emerald-300/10 bg-[#071d1a]/90 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/10 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="relative isolate overflow-hidden rounded-[2rem] border border-emerald-300/15 bg-[#071d1a]/85 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-44 -top-48 h-[32rem] w-[32rem] rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="absolute -bottom-52 right-0 h-[32rem] w-[32rem] rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(52,211,153,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.04)_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(3,18,16,0.62)_95%)]" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-black/10 px-6 py-3 text-xs sm:px-8">
        <div className="flex items-center gap-3 text-emerald-300">
          <span className="relative flex h-3 w-3">
            <span className="absolute -inset-1 animate-ping rounded-full bg-emerald-400/40" />
            <span className="relative m-auto inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]" />
          </span>
          Authentication gateway online
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <Network size={13} aria-hidden="true" />
          lab.meetshawon.com
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
        <section className="border-b border-white/[0.07] p-6 sm:p-9 lg:border-b-0 lg:border-r lg:p-11">
          <Image
            src="/logo.png"
            alt="Meet Shawon"
            width={230}
            height={84}
            priority
            className="h-16 w-auto object-contain object-left"
          />

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
            <FlaskConical size={14} aria-hidden="true" />
            Private cybersecurity lab
          </div>

          <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.08] text-white sm:text-5xl">
            Practical security.
            <span className="block bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              Controlled access.
            </span>
          </h1>

          <p className="mt-5 max-w-xl leading-7 text-slate-300">
            A restricted portal for authorised cybersecurity learning,
            documented experiments and isolated technical environments.
          </p>

          <div className="mt-9 rounded-2xl border border-emerald-300/10 bg-black/15 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Access path
            </p>
            <p className="mt-2 font-medium text-white">
              Identity → Authorisation → Lab portal
            </p>

            <div className="mt-5 flex items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
                <KeyRound size={18} aria-hidden="true" />
              </div>
              <div className="mx-2 h-px flex-1 bg-gradient-to-r from-cyan-300/60 to-emerald-300/60" />
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-300">
                <ShieldCheck size={18} aria-hidden="true" />
              </div>
              <div className="mx-2 h-px flex-1 bg-gradient-to-r from-emerald-300/60 to-violet-300/60" />
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-300/10 text-violet-300">
                <Binary size={18} aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["Authenticated", "Verified identity"],
              ["Restricted", "Explicit membership"],
              ["Authorised", "Ethical use only"],
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4"
              >
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center p-6 sm:p-9 lg:p-11">
          <div className="w-full">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
                  Identity verification
                </p>
                <h2 className="mt-3 text-3xl font-bold text-white">
                  Access the Lab
                </h2>
              </div>
              <LockKeyhole size={29} className="shrink-0 text-emerald-300" aria-hidden="true" />
            </div>

            <p className="mt-4 leading-7 text-slate-300">
              Sign in with an authorised Meet Shawon account. Authentication
              does not automatically grant Lab membership.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <label className="block text-sm font-medium text-slate-200">
                Account email <span className="ml-1 text-red-400">*</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputStyles}
                  placeholder="you@example.com"
                  autoComplete="email"
                  maxLength={254}
                  disabled={submitting}
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Password <span className="ml-1 text-red-400">*</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={`${inputStyles} pr-12`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={submitting}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    disabled={submitting}
                    className="absolute right-3 top-[calc(50%+4px)] -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 text-xs text-slate-400">
                  <LockKeyhole size={13} aria-hidden="true" />
                  Authorised members only
                </span>
                <Link
                  href="https://www.meetshawon.com/auth/forgot-password"
                  className="text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
                >
                  Forgot password?
                </Link>
              </div>

              {error ? (
                <p
                  role="alert"
                  className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-300"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_100%] px-6 py-3.5 font-semibold text-slate-950 shadow-lg shadow-emerald-950/40 transition-all duration-300 hover:bg-right disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Verifying identity…" : "Enter Lab portal"}
                {!submitting ? (
                  <LogIn size={18} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
                ) : null}
              </button>
            </form>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-5 text-xs text-slate-400">
              <Link
                href="https://www.meetshawon.com"
                className="transition hover:text-white"
              >
                Return to portfolio
              </Link>
              <span>Meet Shawon Private Infrastructure</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}