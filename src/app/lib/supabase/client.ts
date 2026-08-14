import {
  createBrowserClient,
} from "@supabase/ssr";

export function createClient() {
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
      "Missing Supabase browser environment variables.",
    );
  }

  const hostname =
    typeof window !==
    "undefined"
      ? window.location.hostname
      : "";

  const isMeetShawonDomain =
    hostname ===
      "meetshawon.com" ||
    hostname ===
      "www.meetshawon.com" ||
    hostname ===
      "drive.meetshawon.com";

  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
    isMeetShawonDomain
      ? {
          cookieOptions: {
            domain:
              ".meetshawon.com",
            path: "/",
            sameSite: "lax",
            secure: true,
          },
        }
      : undefined,
  );
}