import { redirect } from "next/navigation";

import { createClient } from "./supabase/server";

export async function requireAccountNotBlocked() {
  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const {
    data: restriction,
  } = await supabase
    .from(
      "account_restrictions",
    )
    .select(`
      status
    `)
    .eq(
      "user_id",
      user.id,
    )
    .maybeSingle();

  if (
    restriction?.status ===
    "blocked"
  ) {
    redirect(
      "/account/blocked",
    );
  }
}