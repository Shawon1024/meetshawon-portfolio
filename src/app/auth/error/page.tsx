import Link from "next/link";
import { CircleAlert } from "lucide-react";

interface AuthErrorPageProps {
  searchParams: Promise<{
    message?: string;
  }>;
}

export default async function AuthErrorPage({
  searchParams,
}: AuthErrorPageProps) {
  const params = await searchParams;

  return (
    <main className="px-6 py-24">
      <div className="mx-auto max-w-lg rounded-3xl border border-red-400/20 bg-red-400/10 p-8 text-center">
        <CircleAlert
          size={40}
          className="mx-auto text-red-300"
        />

        <h1 className="mt-5 text-3xl font-bold text-white">
          Authentication error
        </h1>

        <p className="mt-4 leading-7 text-red-200">
          {params.message ??
            "Something went wrong during authentication."}
        </p>

        <Link
          href="/auth/sign-in"
          className="mt-7 inline-flex rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400"
        >
          Return to Sign In
        </Link>
      </div>
    </main>
  );
}