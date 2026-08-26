"use client";

import Link from "next/link";
import {
  LogOut,
  Mail,
  RotateCcw,
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

interface LabAccountActionsProps {
  denied?: boolean;
}

export default function LabAccountActions({
  denied = false,
}: LabAccountActionsProps) {
  const router =
    useRouter();

  const [
    signingOut,
    setSigningOut,
  ] =
    useState(false);

  const handleSignOut =
    async () => {
      try {
        setSigningOut(
          true,
        );

        const supabase =
          createClient();

        const {
          error,
        } =
          await supabase.auth.signOut();

        if (error) {
          console.warn(
            "Lab sign-out failed:",
            error,
          );

          return;
        }

        router.replace(
          "/auth/sign-in?lab=1&next=%2F",
        );

        router.refresh();
      } finally {
        setSigningOut(
          false,
        );
      }
    };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {denied ? (
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#061b18]"
        >
          <RotateCcw
            size={17}
            aria-hidden="true"
          />

          Check access again
        </Link>
      ) : null}

      <a
        href="mailto:contact@meetshawon.com?subject=Meet%20Shawon%20Lab%20access"
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
      >
        <Mail
          size={17}
          aria-hidden="true"
        />

        Contact administrator
      </a>

      <button
        type="button"
        disabled={
          signingOut
        }
        onClick={() => {
          void handleSignOut();
        }}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-red-300/30 hover:bg-red-300/[0.07] hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
      >
        <LogOut
          size={17}
          aria-hidden="true"
        />

        {signingOut
          ? "Signing out…"
          : "Sign out"}
      </button>
    </div>
  );
}