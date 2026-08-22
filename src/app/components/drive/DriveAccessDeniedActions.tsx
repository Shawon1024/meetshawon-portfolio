"use client";

import Link from "next/link";

import {
  ArrowLeft,
  LogOut,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createClient,
} from "../../lib/supabase/client";

export default function DriveAccessDeniedActions() {
  const router =
    useRouter();

  const [
    signingOut,
    setSigningOut,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const handleSignOut =
    async () => {
      setError("");
      setSigningOut(true);

      try {
        const supabase =
          createClient();

        const {
          error:
            signOutError,
        } =
          await supabase.auth.signOut();

        if (signOutError) {
          console.warn(
            "Drive sign-out failed:",
            signOutError,
          );

          setError(
            "You could not be signed out. Please try again.",
          );

          return;
        }

        router.push(
          "/auth/sign-in?drive=1&next=%2Fdashboard",
        );

        router.refresh();
      } catch (
        unexpectedError
      ) {
        console.warn(
          "Unexpected Drive sign-out error:",
          unexpectedError,
        );

        setError(
          "You could not be signed out. Please try again.",
        );
      } finally {
        setSigningOut(false);
      }
    };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={
            handleSignOut
          }
          disabled={
            signingOut
          }
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut
            size={18}
          />

          {signingOut
            ? "Signing out..."
            : "Sign out and switch account"}
        </button>

        <Link
          href="https://www.meetshawon.com"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 font-medium text-white transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
        >
          <ArrowLeft
            size={18}
          />

          Return to portfolio
        </Link>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}
    </div>
  );
}