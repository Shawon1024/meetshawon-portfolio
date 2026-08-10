import {
  redirect,
} from "next/navigation";

import SignInForm from "../../components/auth/SignInForm";
import { createClient } from "../../lib/supabase/server";

export default async function SignInPage() {
  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  if (user) {
    redirect(
      "/",
    );
  }

  return (
    <main className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-lg">
        <SignInForm />
      </div>
    </main>
  );
}