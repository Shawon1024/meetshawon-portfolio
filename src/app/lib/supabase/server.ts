import {
  createServerClient,
} from "@supabase/ssr";

import {
  cookies,
  headers,
} from "next/headers";

export async function createClient() {
  const cookieStore =
    await cookies();

  const headerStore =
    await headers();

  const hostname =
    (
      headerStore.get(
        "x-forwarded-host",
      ) ??
      headerStore.get(
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
    throw new Error(
      "Missing Supabase server environment variables.",
    );
  }

  return createServerClient(
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
          return cookieStore.getAll();
        },

        setAll(
          cookiesToSet,
        ) {
          try {
            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                cookieStore.set(
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
          } catch {
            /*
             * Server Components may
             * not be allowed to write
             * cookies.
             *
             * src/proxy.ts handles
             * session refresh.
             */
          }
        },
      },
    },
  );
}