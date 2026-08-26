import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { createClient } from "../../../../lib/supabase/server";

interface DeleteUserRequest {
  userId?: string;
  confirmationUsername?: string;
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user: currentUser },
      error: currentUserError,
    } = await supabase.auth.getUser();

    if (currentUserError || !currentUser) {
      return jsonResponse(
        {
          error: "You must be signed in to manage users.",
        },
        401,
      );
    }

    const { data: currentProfile, error: currentProfileError } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", currentUser.id)
        .single();

    if (currentProfileError || currentProfile?.role !== "admin") {
      return jsonResponse(
        {
          error: "Only administrators can delete users.",
        },
        403,
      );
    }

    let body: DeleteUserRequest;

    try {
      body = (await request.json()) as DeleteUserRequest;
    } catch {
      return jsonResponse(
        {
          error: "The deletion request is invalid.",
        },
        400,
      );
    }

    const userId = body.userId?.trim() ?? "";
    const confirmationUsername =
      body.confirmationUsername?.trim().toLowerCase() ?? "";

    if (!userId || !confirmationUsername) {
      return jsonResponse(
        {
          error: "The user ID and confirmation username are required.",
        },
        400,
      );
    }

    if (userId === currentUser.id) {
      return jsonResponse(
        {
          error: "You cannot delete your own administrator account here.",
        },
        400,
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey =
      process.env.SUPABASE_SECRET_KEY ??
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Admin user deletion configuration is missing.");

      return jsonResponse(
        {
          error: "User deletion is currently unavailable.",
        },
        500,
      );
    }

    const adminSupabase = createAdminClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      },
    );

    const { data: targetProfile, error: targetProfileError } =
      await adminSupabase
        .from("profiles")
        .select("id, username, role")
        .eq("id", userId)
        .single();

    if (targetProfileError || !targetProfile) {
      return jsonResponse(
        {
          error: "The selected user could not be found.",
        },
        404,
      );
    }

    const targetUsername = targetProfile.username?.trim().toLowerCase() ?? "";

    if (!targetUsername) {
      return jsonResponse(
        {
          error:
            "This account has no username and cannot be deleted through User Management.",
        },
        409,
      );
    }

    if (confirmationUsername !== targetUsername) {
      return jsonResponse(
        {
          error: "The confirmation username does not match.",
        },
        400,
      );
    }

    const [postsResult, driveAccountResult] = await Promise.all([
      adminSupabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("author_id", userId),
      adminSupabase
        .from("drive_accounts")
        .select("user_id, lifecycle_status")
        .eq("user_id", userId)
        .maybeSingle(),
    ]);

    if (postsResult.error) {
      console.error("User post ownership check failed:", postsResult.error);

      return jsonResponse(
        {
          error: "The user's article ownership could not be verified.",
        },
        500,
      );
    }

    if ((postsResult.count ?? 0) > 0) {
      return jsonResponse(
        {
          error:
            "This user owns blog posts. Reassign or delete those posts before deleting the account.",
        },
        409,
      );
    }

    if (driveAccountResult.error) {
      console.error("User Drive account check failed:", driveAccountResult.error);

      return jsonResponse(
        {
          error: "The user's Drive status could not be verified.",
        },
        500,
      );
    }

    if (driveAccountResult.data) {
      return jsonResponse(
        {
          error:
            "This user has a Drive account or retained Drive records. Complete the Drive retention and cleanup process before deleting the website account.",
        },
        409,
      );
    }

    if (targetProfile.role === "admin") {
      const { count: administratorCount, error: administratorCountError } =
        await adminSupabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "admin");

      if (administratorCountError) {
        console.error(
          "Administrator count check failed:",
          administratorCountError,
        );

        return jsonResponse(
          {
            error: "Administrator safety could not be verified.",
          },
          500,
        );
      }

      if ((administratorCount ?? 0) <= 1) {
        return jsonResponse(
          {
            error: "The final administrator account cannot be deleted.",
          },
          409,
        );
      }
    }

    const { error: deleteError } =
      await adminSupabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("Administrator user deletion failed:", deleteError);

      return jsonResponse(
        {
          error: "The user account could not be deleted.",
        },
        500,
      );
    }

    return jsonResponse(
      {
        success: true,
      },
      200,
    );
  } catch (error) {
    console.error("Unexpected administrator user deletion error:", error);

    return jsonResponse(
      {
        error: "An unexpected error occurred while deleting the user.",
      },
      500,
    );
  }
}
