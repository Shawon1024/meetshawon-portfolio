import {
  redirect,
} from "next/navigation";

import {
  createClient,
} from "../lib/supabase/server";


export default async function DrivePage() {
  // --------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------

  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
    error:
      userError,
  } =
    await supabase.auth.getUser();

  // --------------------------------------------------
  // NOT SIGNED IN
  // --------------------------------------------------

  if (
    userError ||
    !user
  ) {
    redirect(
  "/auth/sign-in?drive=1&next=%2Fdashboard",
);
  }

  // --------------------------------------------------
  // LOAD USER ROLE
  // --------------------------------------------------

  const {
    data:
      profile,
    error:
      profileError,
  } =
    await supabase
      .from("profiles")
      .select("role")
      .eq(
        "id",
        user.id,
      )
      .single();

  // --------------------------------------------------
  // PROFILE COULD NOT BE VERIFIED
  // --------------------------------------------------

  if (
    profileError ||
    !profile
  ) {
    redirect(
      "/access-denied?reason=profile",
    );
  }

  // --------------------------------------------------
  // ROLE CHECK
  // --------------------------------------------------

  const canAccessDrive =
    profile.role ===
      "admin" ||
    profile.role ===
      "partner";

  if (!canAccessDrive) {
    redirect(
      "/access-denied?reason=role",
    );
  }

  // --------------------------------------------------
  // AUTHORISED USER
  // --------------------------------------------------

  redirect(
    "/dashboard",
  );
}