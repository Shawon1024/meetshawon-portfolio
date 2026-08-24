import {
  createClient,
} from "@supabase/supabase-js";
import {
  NextResponse,
} from "next/server";

import {
  verifyNewsletterToken,
} from "../../../lib/newsletterTokens";

export const runtime = "nodejs";

interface UnsubscribeRequest {
  token?: string;
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control":
        "no-store",
    },
  });
}

export async function POST(
  request: Request,
) {
  try {
    let body: UnsubscribeRequest;

    try {
      body =
        (await request.json()) as
          UnsubscribeRequest;
    } catch {
      return jsonResponse(
        {
          error:
            "The submitted request is invalid.",
        },
        400,
      );
    }

    const token =
      body.token?.trim() ??
      "";

    if (
      !token ||
      token.length > 4096
    ) {
      return jsonResponse(
        {
          error:
            "This unsubscribe link is invalid.",
        },
        400,
      );
    }

    const email =
      verifyNewsletterToken(
        token,
        "unsubscribe",
      );

    if (!email) {
      return jsonResponse(
        {
          error:
            "This unsubscribe link is invalid.",
        },
        400,
      );
    }

    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    const supabaseSecret =
      process.env
        .SUPABASE_SECRET_KEY ??
      process.env
        .SUPABASE_SERVICE_ROLE_KEY;

    if (
      !supabaseUrl ||
      !supabaseSecret
    ) {
      console.error(
        "Newsletter unsubscribe configuration is incomplete.",
      );

      return jsonResponse(
        {
          error:
            "Your request could not be completed.",
        },
        500,
      );
    }

    const supabaseAdmin =
      createClient(
        supabaseUrl,
        supabaseSecret,
        {
          auth: {
            autoRefreshToken:
              false,

            persistSession:
              false,
          },
        },
      );

    const now =
      new Date().toISOString();

    const {
      error: updateError,
    } =
      await supabaseAdmin
        .from(
          "newsletter_subscribers",
        )
        .update({
          status:
            "unsubscribed",

          unsubscribed_at:
            now,

          updated_at:
            now,
        })
        .eq("email", email);

    if (updateError) {
      console.error(
        "Newsletter unsubscribe update failed:",
        updateError,
      );

      return jsonResponse(
        {
          error:
            "Your request could not be completed.",
        },
        500,
      );
    }

    return jsonResponse(
      {
        success:
          true,

        message:
          "You have been unsubscribed successfully.",
      },
      200,
    );
  } catch (error) {
    console.error(
      "Newsletter unsubscribe route error:",
      error,
    );

    return jsonResponse(
      {
        error:
          "An unexpected error occurred.",
      },
      500,
    );
  }
}