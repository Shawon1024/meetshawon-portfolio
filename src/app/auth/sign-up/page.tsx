import {
  redirect,
} from "next/navigation";

import SignUpForm from "../../components/auth/SignUpForm";
import { createClient } from "../../lib/supabase/server";

export default async function SignUpPage() {
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
        <SignUpForm />
      </div>
    </main>
  );
}