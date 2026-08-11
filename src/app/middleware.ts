import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(
  request: NextRequest,
) {
  // --------------------------------------------------
  // DETERMINE HOSTNAME
  // --------------------------------------------------

  const hostname =
    request.headers
      .get("host")
      ?.split(":")[0]
      .toLowerCase() ??
    "";

  // --------------------------------------------------
  // CREATE INITIAL RESPONSE
  // --------------------------------------------------

  let response: NextResponse;

  // --------------------------------------------------
  // DRIVE SUBDOMAIN ROUTING
  // --------------------------------------------------

  if (
    hostname ===
    "drive.meetshawon.com"
  ) {
    const url =
      request.nextUrl.clone();

    /*
     * drive.meetshawon.com
     * internally serves /drive
     *
     * The browser URL remains:
     * https://drive.meetshawon.com
     */

    if (
      url.pathname ===
      "/"
    ) {
      url.pathname =
        "/drive";

      response =
        NextResponse.rewrite(
          url,
          {
            request: {
              headers:
                request.headers,
            },
          },
        );
    } else if (
      !url.pathname.startsWith(
        "/drive",
      ) &&
      !url.pathname.startsWith(
        "/_next",
      ) &&
      !url.pathname.startsWith(
        "/api",
      )
    ) {
      /*
       * Future support for:
       *
       * drive.meetshawon.com/example
       *
       * becoming internally:
       *
       * /drive/example
       */

      url.pathname =
        `/drive${url.pathname}`;

      response =
        NextResponse.rewrite(
          url,
          {
            request: {
              headers:
                request.headers,
            },
          },
        );
    } else {
      response =
        NextResponse.next({
          request,
        });
    }
  } else {
    // Normal meetshawon.com traffic.

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
  // SUPABASE AUTH SESSION REFRESH
  // --------------------------------------------------

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
            /*
             * Update the incoming request cookies.
             */

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

            /*
             * IMPORTANT:
             *
             * Do NOT create a new
             * NextResponse.next() here.
             *
             * We update the existing
             * response instead so a Drive
             * rewrite is not discarded.
             */

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

  // --------------------------------------------------
  // RETURN ORIGINAL RESPONSE
  // --------------------------------------------------

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};