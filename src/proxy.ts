import {
  createServerClient,
} from "@supabase/ssr";

import {
  NextResponse,
} from "next/server";

import type {
  NextRequest,
} from "next/server";

export async function proxy(
  request: NextRequest,
) {
  const hostname =
    request.headers
      .get("host")
      ?.split(":")[0]
      .toLowerCase() ??
    "";

  let response =
    NextResponse.next({
      request,
    });

  // --------------------------------------------------
  // DRIVE SUBDOMAIN
  // --------------------------------------------------

  if (
    hostname ===
    "drive.meetshawon.com"
  ) {
    const url =
      request.nextUrl.clone();

    if (
      url.pathname === "/"
    ) {
      url.pathname =
        "/drive";

      response =
        NextResponse.rewrite(
          url,
        );
    }
  }

  // --------------------------------------------------
  // SUPABASE SESSION REFRESH
  // --------------------------------------------------

  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const supabaseKey =
    process.env
      .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (
    !supabaseUrl ||
    !supabaseKey
  ) {
    return response;
  }

  const supabase =
    createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(
            cookiesToSet,
          ) {
            cookiesToSet.forEach(
              ({
                name,
                value,
              }) => {
                request.cookies.set(
                  name,
                  value,
                );
              },
            );

            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                response.cookies.set(
                  name,
                  value,
                  options,
                );
              },
            );
          },
        },
      },
    );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};