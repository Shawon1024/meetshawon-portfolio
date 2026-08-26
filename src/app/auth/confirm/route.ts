import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { createClient } from "../../lib/supabase/server";

function safeNextPath(value: string | null) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return "/account";
  }

  return value;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const next = safeNextPath(requestUrl.searchParams.get("next"));
  const supabase = await createClient();

  let confirmationSucceeded = false;

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    confirmationSucceeded = !error;

    if (error) {
      console.warn("Authentication OTP verification failed:", error);
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    confirmationSucceeded = !error;

    if (error) {
      console.warn("Authentication code exchange failed:", error);
    }
  }

  if (confirmationSucceeded) {
    return NextResponse.redirect(
      new URL(next, requestUrl.origin),
    );
  }

  return NextResponse.redirect(
    new URL(
      "/auth/error?message=The confirmation link is invalid or has expired.",
      requestUrl.origin,
    ),
  );
}
