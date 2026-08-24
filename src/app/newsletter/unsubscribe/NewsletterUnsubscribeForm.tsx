"use client";

import {
  useState,
} from "react";
import {
  CheckCircle2,
  LoaderCircle,
  MailX,
} from "lucide-react";

interface NewsletterUnsubscribeFormProps {
  token: string;
}

export default function NewsletterUnsubscribeForm({
  token,
}: NewsletterUnsubscribeFormProps) {
  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    success,
    setSuccess,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const handleUnsubscribe =
    async () => {
      setSubmitting(true);
      setError("");

      try {
        const response =
          await fetch(
            "/api/newsletter/unsubscribe",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  token,
                }),
            },
          );

        const result =
          (await response.json()) as {
            success?: boolean;
            error?: string;
          };

        if (
          !response.ok ||
          !result.success
        ) {
          setError(
            result.error ??
              "Your request could not be completed.",
          );

          return;
        }

        setSuccess(true);
      } catch {
        setError(
          "Your request could not be completed. Try again later.",
        );
      } finally {
        setSubmitting(false);
      }
    };

  if (success) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-green-400/20 bg-green-400/10 p-6"
      >
        <CheckCircle2
          className="mx-auto text-green-300"
          size={34}
          aria-hidden="true"
        />

        <h2 className="mt-4 text-xl font-semibold text-white">
          You&apos;ve been unsubscribed
        </h2>

        <p className="mt-3 leading-7 text-gray-300">
          You will no longer receive Meet Shawon newsletter emails.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
        <MailX
          size={30}
          aria-hidden="true"
        />
      </div>

      <p className="mt-7 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
        Email Preferences
      </p>

      <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">
        Unsubscribe from the newsletter
      </h1>

      <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-400">
        Confirm below to stop receiving occasional Meet Shawon newsletter
        updates.
      </p>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={
          handleUnsubscribe
        }
        disabled={
          submitting
        }
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-6 py-3 font-medium text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <LoaderCircle
              size={18}
              className="animate-spin"
              aria-hidden="true"
            />
            Processing
          </>
        ) : (
          <>
            <MailX
              size={18}
              aria-hidden="true"
            />
            Confirm Unsubscribe
          </>
        )}
      </button>
    </div>
  );
}