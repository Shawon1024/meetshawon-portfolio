import {
  NextResponse,
} from "next/server";
import {
  createClient as createAdminClient,
} from "@supabase/supabase-js";

import { createClient } from "../../../lib/supabase/server";

function jsonResponse(
  body: Record<
    string,
    unknown
  >,
  status: number,
) {
  return NextResponse.json(
    body,
    {
      status,

      headers: {
        "Cache-Control":
          "no-store",
      },
    },
  );
}

export async function DELETE() {
  try {
    // --------------------------------------------------
    // CHECK CURRENT AUTHENTICATED USER
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

    if (
      userError ||
      !user
    ) {
      return jsonResponse(
        {
          error:
            "You must be signed in to delete your account.",
        },
        401,
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

      return jsonResponse(
        {
          error:
            "Account deletion is currently unavailable.",
        },
        500,
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

            detectSessionInUrl:
              false,
          },
        },
      );

    // --------------------------------------------------
    // DELETE AUTH USER
    // --------------------------------------------------

    const {
      error:
        deleteError,
    } =
      await adminSupabase.auth.admin.deleteUser(
        user.id,
      );

    if (
      deleteError
    ) {
      console.error(
        "Supabase account deletion failed:",
        deleteError,
      );

      return jsonResponse(
        {
          error:
            "Your account could not be deleted.",
        },
        500,
      );
    }

    // --------------------------------------------------
    // SUCCESS
    // --------------------------------------------------

    return jsonResponse(
      {
        success:
          true,
      },
      200,
    );
  } catch (
    error
  ) {
    console.error(
      "Unexpected account deletion error:",
      error,
    );

    return jsonResponse(
      {
        error:
          "An unexpected error occurred while deleting your account.",
      },
      500,
    );
  }
}