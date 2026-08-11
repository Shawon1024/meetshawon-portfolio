import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(
  request: NextRequest,
) {
  let response = NextResponse.next({
    request,
  });

  // --------------------------------------------------
  // SUBDOMAIN ROUTING
  // --------------------------------------------------

  const hostname =
    request.headers
      .get("host")
      ?.split(":")[0]
      .toLowerCase();

  if (
    hostname ===
    "drive.meetshawon.com"
  ) {
    const url =
      request.nextUrl.clone();

    /*
     * Avoid rewriting assets and Next.js internals.
     * The matcher below already excludes common image files,
     * but this keeps the Drive routing explicit and safe.
     */

    if (
      !url.pathname.startsWith(
        "/_next",
      ) &&
      !url.pathname.startsWith(
        "/api",
      ) &&
      !url.pathname.startsWith(
        "/drive",
      )
    ) {
      url.pathname =
        `/drive${url.pathname === "/" ? "" : url.pathname}`;

      response =
        NextResponse.rewrite(
          url,
        );
    }
  }

  // --------------------------------------------------
  // SUPABASE AUTH SESSION REFRESH
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

            const refreshedResponse =
              NextResponse.next({
                request,
              });

            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                refreshedResponse.cookies.set(
                  name,
                  value,
                  options,
                );
              },
            );

            response =
              refreshedResponse;
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