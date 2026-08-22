import {
  createServerClient,
} from "@supabase/ssr";

import {
  NextResponse,
} from "next/server";

import type {
  NextRequest,
} from "next/server";

const DRIVE_HOSTNAME =
  "drive.meetshawon.com";

function getHostname(
  request: NextRequest,
) {
  return (
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
}

function getDriveRewritePath(
  pathname: string,
) {
  if (pathname === "/") {
    return "/drive";
  }

  if (
    pathname ===
    "/dashboard"
  ) {
    return "/drive/dashboard";
  }

  if (
    pathname ===
    "/access-denied"
  ) {
    return "/drive/access-denied";
  }

  return null;
}

export async function proxy(
  request: NextRequest,
) {
  const hostname =
    getHostname(request);

  const isDriveDomain =
    hostname ===
    DRIVE_HOSTNAME ||
      hostname ===
    "drive.localhost";

  const isMeetShawonDomain =
    hostname ===
      "meetshawon.com" ||
    hostname ===
      "www.meetshawon.com" ||
    isDriveDomain;

  // --------------------------------------------------
  // INITIAL RESPONSE
  // --------------------------------------------------

  let response:
    NextResponse;

  const driveRewritePath =
    isDriveDomain
      ? getDriveRewritePath(
          request.nextUrl
            .pathname,
        )
      : null;

  if (driveRewritePath) {
    const rewriteUrl =
      request.nextUrl.clone();

    rewriteUrl.pathname =
      driveRewritePath;

    response =
      NextResponse.rewrite(
        rewriteUrl,
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};