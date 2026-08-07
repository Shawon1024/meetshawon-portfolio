"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "../../lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");

  const handleSignOut = async () => {
    setError("");

    try {
      setSigningOut(true);

      const supabase = createClient();

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      router.push("/auth/sign-in");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "You could not be signed out.",
      );
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-medium text-white transition hover:border-red-400 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {signingOut ? "Signing out..." : "Sign Out"}
        <LogOut size={18} />
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}