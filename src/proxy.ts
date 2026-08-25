import {
  createServerClient,
} from "@supabase/ssr";

import {
  NextResponse,
} from "next/server";

import type {
  NextRequest,
} from "next/server";

import {
  SITE_STATUS,
} from "./app/config/siteStatus";

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
  if (
    pathname ===
    "/"
  ) {
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

function pathMatches(
  pathname: string,
  allowedPath: string,
) {
  return (
    pathname ===
      allowedPath ||
    pathname.startsWith(
      `${allowedPath}/`,
    )
  );
}

function maintenancePathIsAllowed(
  pathname: string,
) {
  return (
    pathMatches(
      pathname,
      "/maintenance",
    ) ||
    pathMatches(
      pathname,
      "/contact",
    ) ||
    pathMatches(
      pathname,
      "/api/contact",
    ) ||
    pathMatches(
      pathname,
      "/api/health",
    )
  );
}

function getRetryAfterValue() {
  const returnDate =
    new Date(
      SITE_STATUS
        .maintenance
        .expectedReturnAt,
    );

  if (
    Number.isNaN(
      returnDate.getTime(),
    )
  ) {
    return "3600";
  }

  return returnDate.toUTCString();
}

function applyMaintenanceHeaders(
  response: NextResponse,
) {
  response.headers.set(
    "Cache-Control",
    "no-store",
  );

  response.headers.set(
    "Retry-After",
    getRetryAfterValue(),
  );

  response.headers.set(
    "X-Robots-Tag",
    "noindex, noarchive",
  );

  return response;
}

export async function proxy(
  request: NextRequest,
) {
  const hostname =
    getHostname(
      request,
    );

  const pathname =
    request.nextUrl
      .pathname;

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
  // HIDE MAINTENANCE PAGE DURING NORMAL OPERATION
  // --------------------------------------------------
  //
  // When the website is operating normally, visitors
  // should not be able to open /maintenance directly.
  //
  // Proxy performs a real HTTP 307 redirect to the
  // homepage before the maintenance page is rendered.
  // --------------------------------------------------

  if (
    SITE_STATUS.mode ===
      "normal" &&
    !isDriveDomain &&
    pathMatches(
      pathname,
      "/maintenance",
    )
  ) {
    const homeUrl =
      request.nextUrl.clone();

    homeUrl.pathname =
      "/";

    homeUrl.search =
      "";

    return NextResponse.redirect(
      homeUrl,
      {
        status:
          307,
      },
    );
  }

  // --------------------------------------------------
  // FULL WEBSITE MAINTENANCE
  // --------------------------------------------------
  //
  // This block operates only when:
  //
  //   SITE_STATUS.mode === "maintenance"
  //
  // Drive is excluded because it uses a separate
  // subdomain and separate infrastructure.
  //
  // Contact and health checks remain available.
  //
  // Newsletter routes, account routes, content pages
  // and all other main-site features are unavailable.
  // --------------------------------------------------

  if (
    SITE_STATUS.mode ===
      "maintenance" &&
    !isDriveDomain &&
    !maintenancePathIsAllowed(
      pathname,
    )
  ) {
    // API requests receive a structured maintenance
    // response instead of maintenance-page HTML.

    if (
      pathname.startsWith(
        "/api/",
      )
    ) {
      const apiResponse =
        NextResponse.json(
          {
            error:
              "The website is temporarily unavailable for scheduled maintenance.",

            maintenance:
              true,

            expectedReturnAt:
              SITE_STATUS
                .maintenance
                .expectedReturnAt,
          },
          {
            status:
              503,
          },
        );

      return applyMaintenanceHeaders(
        apiResponse,
      );
    }

    // Website pages are internally rewritten to the
    // maintenance page while keeping a 503 response.

    const maintenanceUrl =
      request.nextUrl.clone();

    maintenanceUrl.pathname =
      "/maintenance";

    maintenanceUrl.search =
      "";

    const maintenanceResponse =
      NextResponse.rewrite(
        maintenanceUrl,
        {
          status:
            503,
        },
      );

    return applyMaintenanceHeaders(
      maintenanceResponse,
    );
  }

  // --------------------------------------------------
  // INITIAL RESPONSE
  // --------------------------------------------------

  let response:
    NextResponse;

  const driveRewritePath =
    isDriveDomain
      ? getDriveRewritePath(
          pathname,
        )
      : null;

  if (
    driveRewritePath
  ) {
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

                path:
                  "/",

                sameSite:
                  "lax" as const,

                secure:
                  true,
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

                          path:
                            "/",

                          sameSite:
                            "lax" as const,

                          secure:
                            true,
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