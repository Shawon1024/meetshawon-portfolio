import {
  createServerClient,
} from "@supabase/ssr";

import {
  cookies,
} from "next/headers";

export async function createClient() {
  const cookieStore =
    await cookies();

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
      cookieOptions: {
        domain:
          ".meetshawon.com",
        path: "/",
        sameSite: "lax",
        secure: true,
      },

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