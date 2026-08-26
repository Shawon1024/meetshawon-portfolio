import { headers } from "next/headers";
import { redirect } from "next/navigation";

import SignInForm from "../../components/auth/SignInForm";
import DriveSignInForm from "../../components/drive/DriveSignInForm";
import LabSignInForm from "../../components/lab/LabSignInForm";
import { createClient } from "../../lib/supabase/server";

interface SignInPageProps {
  searchParams: Promise<{
    drive?: string;
    lab?: string;
  }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const [resolvedSearchParams, headerStore] = await Promise.all([
    searchParams,
    headers(),
  ]);

  const hostname = (
    headerStore.get("x-forwarded-host") ??
    headerStore.get("host") ??
    ""
  )
    .split(":")[0]
    .toLowerCase();

  const isDriveSignIn =
    resolvedSearchParams.drive === "1" ||
    hostname === "drive.meetshawon.com" ||
    hostname === "drive.localhost";

  const isLabSignIn =
    !isDriveSignIn &&
    (resolvedSearchParams.lab === "1" ||
      hostname === "lab.meetshawon.com" ||
      hostname === "lab.localhost");

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(isDriveSignIn || isLabSignIn ? "/" : "/account");
  }

  if (isDriveSignIn) {
    return (
      <main className="px-5 py-10 sm:px-6 md:py-16">
        <div className="mx-auto max-w-6xl">
          <DriveSignInForm />
        </div>
      </main>
    );
  }

  if (isLabSignIn) {
    return (
      <main
        data-service-shell="lab"
        className="min-h-dvh px-5 py-10 sm:px-6 md:py-16"
      >
        <div className="mx-auto max-w-6xl">
          <LabSignInForm />
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-lg">
        <SignInForm />
      </div>
    </main>
  );
}