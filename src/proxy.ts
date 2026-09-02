import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SITE_STATUS } from "./app/config/siteStatus";

const DRIVE_HOSTNAME = "drive.meetshawon.com";
const LAB_HOSTNAME = "lab.meetshawon.com";

function getHostname(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    ""
  )
    .split(":")[0]
    .toLowerCase();
}

function getDriveRewritePath(pathname: string) {
  if (pathname === "/") {
    return "/drive";
  }

  if (pathname === "/dashboard") {
    return "/drive/dashboard";
  }

  if (pathname === "/access-denied") {
    return "/drive/access-denied";
  }

  return null;
}

function getLabRewritePath(pathname: string) {
  if (pathname === "/") {
    return "/lab";
  }

  if (pathname === "/access-denied") {
    return "/lab/access-denied";
  }

  return null;
}

function pathMatches(pathname: string, allowedPath: string) {
  return (
    pathname === allowedPath || pathname.startsWith(`${allowedPath}/`)
  );
}

function mainMaintenancePathIsAllowed(pathname: string) {
  return (
    pathMatches(pathname, "/maintenance") ||
    pathMatches(pathname, "/contact") ||
    pathMatches(pathname, "/api/contact") ||
    pathMatches(pathname, "/api/health")
  );
}

function getRetryAfterValue() {
  const returnDate = new Date(
    SITE_STATUS.maintenance.expectedReturnAt,
  );

  if (Number.isNaN(returnDate.getTime())) {
    return "3600";
  }

  return returnDate.toUTCString();
}

function applyMaintenanceHeaders(response: NextResponse) {
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Retry-After", getRetryAfterValue());
  response.headers.set("X-Robots-Tag", "noindex, noarchive");

  return response;
}

function getMaintenanceMessage(
  scope: "website" | "drive" | "all",
) {
  if (scope === "all") {
    return "The website and Drive are temporarily unavailable for scheduled maintenance.";
  }

  if (scope === "drive") {
    return "Meet Shawon Drive is temporarily unavailable for scheduled maintenance.";
  }

  return "The website is temporarily unavailable for scheduled maintenance.";
}

function createMaintenanceResponse(
  request: NextRequest,
  scope: "website" | "drive" | "all",
) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const apiResponse = NextResponse.json(
      {
        error: getMaintenanceMessage(scope),
        maintenance: true,
        scope,
        expectedReturnAt: SITE_STATUS.maintenance.expectedReturnAt,
      },
      { status: 503 },
    );

    return applyMaintenanceHeaders(apiResponse);
  }

  const maintenanceUrl = request.nextUrl.clone();
  maintenanceUrl.pathname = "/maintenance";
  maintenanceUrl.search = "";

  const maintenanceResponse = NextResponse.rewrite(maintenanceUrl, {
    status: 503,
  });

  return applyMaintenanceHeaders(maintenanceResponse);
}

export async function proxy(request: NextRequest) {
  const hostname = getHostname(request);
  const pathname = request.nextUrl.pathname;

  const isDriveDomain =
    hostname === DRIVE_HOSTNAME || hostname === "drive.localhost";

  const isLabDomain =
    hostname === LAB_HOSTNAME || hostname === "lab.localhost";

  const isServiceDomain = isDriveDomain || isLabDomain;

  const mainWebsiteUnderMaintenance =
    SITE_STATUS.mode === "site_maintenance" ||
    SITE_STATUS.mode === "full_maintenance";

  const driveUnderMaintenance =
    SITE_STATUS.mode === "drive_maintenance" ||
    SITE_STATUS.mode === "full_maintenance";

  const currentServiceUnderMaintenance =
    isDriveDomain && driveUnderMaintenance;

  const usesSharedProductionCookies =
    hostname === "meetshawon.com" ||
    hostname === "www.meetshawon.com" ||
    hostname === DRIVE_HOSTNAME ||
    hostname === LAB_HOSTNAME;

  // --------------------------------------------------
  // HIDE THE MAINTENANCE PAGE WHEN THIS HOST IS LIVE
  // --------------------------------------------------

  if (
    pathMatches(pathname, "/maintenance") &&
    ((isServiceDomain && !currentServiceUnderMaintenance) ||
      (!isServiceDomain &&
        !mainWebsiteUnderMaintenance &&
        SITE_STATUS.mode !== "scheduled"))
  ) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    homeUrl.search = "";

    return NextResponse.redirect(homeUrl, { status: 307 });
  }

  // --------------------------------------------------
  // DRIVE OR LAB MAINTENANCE
  // --------------------------------------------------

  if (currentServiceUnderMaintenance) {
    const scope =
      SITE_STATUS.mode === "full_maintenance"
        ? "all"
        : "drive";

    return createMaintenanceResponse(request, scope);
  }

  // --------------------------------------------------
  // MAIN-WEBSITE MAINTENANCE
  // --------------------------------------------------

  if (
    mainWebsiteUnderMaintenance &&
    !isServiceDomain &&
    !mainMaintenancePathIsAllowed(pathname)
  ) {
    const scope =
      SITE_STATUS.mode === "full_maintenance" ? "all" : "website";

    return createMaintenanceResponse(request, scope);
  }

  // --------------------------------------------------
  // SERVICE-SUBDOMAIN REWRITES
  // --------------------------------------------------

  let response: NextResponse;

  const driveRewritePath = isDriveDomain
    ? getDriveRewritePath(pathname)
    : null;

  const labRewritePath = isLabDomain
    ? getLabRewritePath(pathname)
    : null;

  const serviceRewritePath = driveRewritePath ?? labRewritePath;

  if (serviceRewritePath) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = serviceRewritePath;

    response = NextResponse.rewrite(rewriteUrl);
  } else {
    response = NextResponse.next({ request });
  }

  // --------------------------------------------------
  // SUPABASE ENVIRONMENT
  // --------------------------------------------------

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  // --------------------------------------------------
  // SUPABASE SESSION REFRESH
  // --------------------------------------------------

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    ...(usesSharedProductionCookies
      ? {
          cookieOptions: {
            domain: ".meetshawon.com",
            path: "/",
            sameSite: "lax" as const,
            secure: true,
          },
        }
      : {}),

    cookies: {
      getAll() {
        return request.cookies.getAll();
      },

      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, {
            ...options,
            ...(usesSharedProductionCookies
              ? {
                  domain: ".meetshawon.com",
                  path: "/",
                  sameSite: "lax" as const,
                  secure: true,
                }
              : {}),
          });
        });
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
