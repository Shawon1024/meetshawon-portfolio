import {
  NextResponse,
} from "next/server";
import {
  createClient as createAdminClient,
} from "@supabase/supabase-js";

import { createClient } from "../../../lib/supabase/server";

export async function DELETE() {
  try {
    // --------------------------------------------------
    // CHECK CURRENT AUTHENTICATED USER
    // --------------------------------------------------

    const supabase =
      await createClient();

    const {
      data: { user },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (
      userError ||
      !user
    ) {
      return NextResponse.json(
        {
          error:
            "You must be signed in to delete your account.",
        },
        {
          status: 401,
        },
      );
    }

    // --------------------------------------------------
    // SERVER ENVIRONMENT VARIABLES
    // --------------------------------------------------

    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env
        .SUPABASE_SERVICE_ROLE_KEY;

    if (
      !supabaseUrl ||
      !serviceRoleKey
    ) {
      console.error(
        "Account deletion configuration is missing.",
      );

      return NextResponse.json(
        {
          error:
            "Account deletion is currently unavailable.",
        },
        {
          status: 500,
        },
      );
    }

    // --------------------------------------------------
    // CREATE SERVER-ONLY ADMIN CLIENT
    // --------------------------------------------------

    const adminSupabase =
      createAdminClient(
        supabaseUrl,
        serviceRoleKey,
        {
          auth: {
            autoRefreshToken:
              false,

            persistSession:
              false,
          },
        },
      );

    // --------------------------------------------------
    // DELETE AUTH USER
    // --------------------------------------------------

    const {
      error: deleteError,
    } =
      await adminSupabase.auth.admin.deleteUser(
        user.id,
      );

    if (deleteError) {
      console.error(
        "Supabase account deletion failed:",
        deleteError,
      );

      return NextResponse.json(
        {
          error:
            "Your account could not be deleted.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Unexpected account deletion error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while deleting your account.",
      },
      {
        status: 500,
      },
    );
  }
}