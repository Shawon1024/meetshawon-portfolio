import {
  NextResponse,
} from "next/server";

export const dynamic =
  "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      status: "maintenance",
      service:
        "MeetShawon.Com",
      timestamp:
        new Date().toISOString(),
    },
    {
      status: 503,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate",
      },
    },
  );
}