import type {
  Metadata,
} from "next";
import Link from "next/link";
import {
  AlertTriangle,
} from "lucide-react";

import Container from "../../components/Container";
import {
  verifyNewsletterToken,
} from "../../lib/newsletterTokens";
import NewsletterUnsubscribeForm from "./NewsletterUnsubscribeForm";

export const metadata: Metadata = {
  title:
    "Newsletter Preferences",

  robots: {
    index:
      false,

    follow:
      false,
  },
};

interface NewsletterUnsubscribePageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function NewsletterUnsubscribePage({
  searchParams,
}: NewsletterUnsubscribePageProps) {
  const params =
    await searchParams;

  const token =
    params.token?.trim() ??
    "";

  const email =
    token
      ? verifyNewsletterToken(
          token,
          "unsubscribe",
        )
      : null;

  return (
    <main>
      <section className="border-t border-white/5 px-6 py-24 md:py-32">
        <Container>
          <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-8 text-center shadow-2xl shadow-black/20 md:p-12">
            {email ? (
              <NewsletterUnsubscribeForm
                token={token}
              />
            ) : (
              <>
                <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">
                  <AlertTriangle
                    size={30}
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-7 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                  Email Preferences
                </p>

                <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">
                  Invalid unsubscribe link
                </h1>

                <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-400">
                  This unsubscribe link is invalid. Use the link from your
                  latest Meet Shawon newsletter email.
                </p>

                <Link
                  href="/"
                  className="mt-8 inline-flex rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400"
                >
                  Return Home
                </Link>
              </>
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}