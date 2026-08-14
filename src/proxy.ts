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
    (
      request.headers.get(
        "x-forwarded-host",
      ) ??
      request.headers.get(
        "host",
      ) ??
      ""
    )
      .split(":")[0]
      .toLowerCase();

  const isMeetShawonDomain =
    hostname ===
      "meetshawon.com" ||
    hostname ===
      "www.meetshawon.com" ||
    hostname ===
      "drive.meetshawon.com";

  // --------------------------------------------------
  // INITIAL RESPONSE / DRIVE REWRITE
  // --------------------------------------------------

  let response:
    NextResponse;

  if (
    hostname ===
      "drive.meetshawon.com" &&
    request.nextUrl.pathname ===
      "/"
  ) {
    const url =
      request.nextUrl.clone();

    url.pathname =
      "/drive";

    response =
      NextResponse.rewrite(
        url,
      );
  } else {
    response =
      NextResponse.next({
        request,
      });
  }

  // --------------------------------------------------
  // SUPABASE ENVIRONMENT
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

  // --------------------------------------------------
  // SUPABASE SESSION REFRESH
  // --------------------------------------------------

  const supabase =
    createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        ...(isMeetShawonDomain
          ? {
              cookieOptions: {
                domain:
                  ".meetshawon.com",
                path: "/",
                sameSite:
                  "lax" as const,
                secure: true,
              },
            }
          : {}),

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
                  {
                    ...options,

                    ...(isMeetShawonDomain
                      ? {
                          domain:
                            ".meetshawon.com",
                          path: "/",
                          sameSite:
                            "lax" as const,
                          secure: true,
                        }
                      : {}),
                  },
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