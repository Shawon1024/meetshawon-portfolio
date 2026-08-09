import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { redirect } from "next/navigation";
import { requireAccountNotBlocked } from "../../lib/accountRestriction";
import AccountSecurity from "../../components/account/AccountSecurity";
import Container from "../../components/Container";
import { createClient } from "../../lib/supabase/server";

export default async function AccountSecurityPage() {
    await requireAccountNotBlocked();
    
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/auth/sign-in?next=/account/security",
    );
  }

  return (
    <main>
      <section className="px-6 pb-12 pt-16 md:pt-24">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-green-400"
          >
            <ArrowLeft
              size={16}
            />

            Back to Account
          </Link>

          <div className="mt-8 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
            <ShieldCheck
              size={24}
            />
          </div>

          <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Account Security
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
            Security
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-gray-400">
            Manage your password and active sign-in sessions.
          </p>
        </div>
      </section>

      <section className="border-t border-white/5 py-16">
        <Container>
          <div className="mx-auto max-w-4xl">
            <AccountSecurity
              email={
                user.email ??
                null
              }
            />
          </div>
        </Container>
      </section>
    </main>
  );
}