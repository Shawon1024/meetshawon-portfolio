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

  // --------------------------------------------------
  // RESPONSE / DRIVE ROUTING
  // --------------------------------------------------

  let response: NextResponse;

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
  // SUPABASE SESSION
  // --------------------------------------------------

  const supabase =
    createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookieOptions: {
          domain:
            ".meetshawon.com",
          path: "/",
          sameSite: "lax",
          secure: true,
        },

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

                    domain:
                      ".meetshawon.com",

                    path:
                      "/",

                    sameSite:
                      "lax",

                    secure:
                      true,
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