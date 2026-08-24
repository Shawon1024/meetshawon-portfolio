import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  MailCheck,
} from "lucide-react";

import Container from "../../components/Container";

export const metadata: Metadata = {
  title:
    "Newsletter Confirmation",

  robots: {
    index:
      false,

    follow:
      false,
  },
};

interface NewsletterConfirmedPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

const results = {
  success: {
    icon:
      CheckCircle2,

    title:
      "Subscription confirmed",

    description:
      "Welcome to the Meet Shawon newsletter. Your email address has been confirmed successfully.",

    style:
      "bg-green-400/10 text-green-300",
  },

  "already-confirmed": {
    icon:
      MailCheck,

    title:
      "Already subscribed",

    description:
      "This email address has already been confirmed for the Meet Shawon newsletter.",

    style:
      "bg-cyan-400/10 text-cyan-300",
  },

  invalid: {
    icon:
      AlertTriangle,

    title:
      "Confirmation link unavailable",

    description:
      "This confirmation link is invalid or has expired. Submit your email address again to request a new link.",

    style:
      "bg-amber-400/10 text-amber-300",
  },

  error: {
    icon:
      AlertTriangle,

    title:
      "Confirmation could not be completed",

    description:
      "An unexpected problem prevented confirmation. Please try again later.",

    style:
      "bg-red-400/10 text-red-300",
  },
};

export default async function NewsletterConfirmedPage({
  searchParams,
}: NewsletterConfirmedPageProps) {
  const params =
    await searchParams;

  const status =
    params.status &&
    params.status in results
      ? (params.status as keyof typeof results)
      : "invalid";

  const result =
    results[status];

  const Icon =
    result.icon;

  return (
    <main>
      <section className="border-t border-white/5 px-6 py-24 md:py-32">
        <Container>
          <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-8 text-center shadow-2xl shadow-black/20 md:p-12">
            <div
              className={`mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl ${result.style}`}
            >
              <Icon
                size={30}
                aria-hidden="true"
              />
            </div>

            <p className="mt-7 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Meet Shawon Newsletter
            </p>

            <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">
              {result.title}
            </h1>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-400">
              {result.description}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400"
              >
                Return Home
              </Link>

              <Link
                href="/blog"
                className="rounded-xl border border-white/15 px-6 py-3 font-medium text-white transition hover:border-green-400 hover:text-green-300"
              >
                Explore the Blog
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}