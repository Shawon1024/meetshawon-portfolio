"use client";

import Script from "next/script";
import type {
  FormEvent,
} from "react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function NewsletterForm() {
  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    consent,
    setConsent,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    submitted,
    setSubmitted,
  ] =
    useState(false);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    turnstileToken,
    setTurnstileToken,
  ] =
    useState("");

  const [
    turnstileReady,
    setTurnstileReady,
  ] =
    useState(false);

  const turnstileContainerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const widgetIdRef =
    useRef<string | null>(
      null,
    );

  const siteKey =
    process.env
      .NEXT_PUBLIC_TURNSTILE_SITE_KEY ??
    "";

  useEffect(() => {
    if (
      submitted ||
      !turnstileReady ||
      !siteKey ||
      !turnstileContainerRef.current ||
      !window.turnstile ||
      widgetIdRef.current
    ) {
      return;
    }

    widgetIdRef.current =
      window.turnstile.render(
        turnstileContainerRef.current,
        {
          sitekey:
            siteKey,

          theme:
            "dark",

          size:
            "flexible",

          appearance:
            "interaction-only",

          callback: (
            token,
          ) => {
            setTurnstileToken(
              token,
            );

            setError("");
          },

          "expired-callback":
            () => {
              setTurnstileToken(
                "",
              );
            },

          "error-callback":
            () => {
              setTurnstileToken(
                "",
              );

              setError(
                "Human verification could not be completed.",
              );
            },
        },
      );

    return () => {
      if (
        widgetIdRef.current &&
        window.turnstile
      ) {
        window.turnstile.remove(
          widgetIdRef.current,
        );

        widgetIdRef.current =
          null;
      }
    };
  }, [
    siteKey,
    submitted,
    turnstileReady,
  ]);

  const resetTurnstile =
    () => {
      setTurnstileToken("");

      if (
        widgetIdRef.current &&
        window.turnstile
      ) {
        window.turnstile.reset(
          widgetIdRef.current,
        );
      }
    };

  const handleSubmit =
    async (
      event: FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      setError("");
      setSubmitted(false);

      const cleanEmail =
        email.trim().toLowerCase();

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailPattern.test(
          cleanEmail,
        )
      ) {
        setError(
          "Enter a valid email address.",
        );

        return;
      }

      if (!consent) {
        setError(
          "Confirm that you agree to receive newsletter emails.",
        );

        return;
      }

      if (!turnstileToken) {
        setError(
          "Complete human verification before subscribing.",
        );

        return;
      }

      try {
        setSubmitting(true);

        const response =
          await fetch(
            "/api/newsletter/subscribe",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  email:
                    cleanEmail,

                  consent:
                    true,

                  turnstileToken,
                }),
            },
          );

        const result =
          (await response.json()) as {
            success?: boolean;
            message?: string;
            error?: string;
          };

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.error ??
              "Your subscription could not be processed.",
          );
        }

        if (
          widgetIdRef.current &&
          window.turnstile
        ) {
          window.turnstile.remove(
            widgetIdRef.current,
          );

          widgetIdRef.current =
            null;
        }

        setTurnstileToken("");
        setEmail("");
        setConsent(false);
        setSubmitted(true);
        
      } catch (
        caughtError
      ) {
        setError(
          caughtError instanceof
            Error
            ? caughtError.message
            : "Your subscription could not be processed.",
        );

        resetTurnstile();
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <div>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => {
          setTurnstileReady(
            true,
          );
        }}
        onError={() => {
          setTurnstileReady(
            false,
          );

          setError(
            "Human verification could not be loaded.",
          );
        }}
      />

      {submitted ? (
        <div
          role="status"
          className="rounded-2xl border border-green-400/20 bg-green-400/10 p-5"
        >
          <CheckCircle2
            size={26}
            className="text-green-300"
            aria-hidden="true"
          />

          <p className="mt-3 font-semibold text-white">
            Check your inbox
          </p>

          <p className="mt-2 text-sm leading-6 text-green-100/70">
            Open the confirmation email to complete your subscription.
          </p>

          <button
            type="button"
            onClick={() => {
              setSubmitted(
                false,
              );
            }}
            className="mt-4 text-sm font-medium text-green-300 transition hover:text-green-200"
          >
            Subscribe another email
          </button>
        </div>
      ) : (
        <form
          onSubmit={
            handleSubmit
          }
          aria-busy={
            submitting
          }
          noValidate
        >
          <label
            htmlFor="newsletter-email"
            className="sr-only"
          >
            Email address
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="newsletter-email"
              name="newsletter-email"
              type="email"
              value={email}
              onChange={(
                event,
              ) => {
                setEmail(
                  event.target.value,
                );

                setError("");
              }}
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              maxLength={254}
              required
              disabled={
                submitting
              }
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400 focus:ring-1 focus:ring-green-400/30 disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={
                submitting ||
                !siteKey ||
                !turnstileToken
              }
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3.5 font-semibold text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  Subscribing
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                  />
                </>
              )}
            </button>
          </div>

          <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-6 text-gray-400">
            <input
              type="checkbox"
              checked={
                consent
              }
              onChange={(
                event,
              ) => {
                setConsent(
                  event.target.checked,
                );

                setError("");
              }}
              required
              disabled={
                submitting
              }
              className="mt-1 h-4 w-4 shrink-0 accent-green-500"
            />

            <span>
              I agree to receive occasional emails about cybersecurity
              projects, technical articles, qualifications, and platform
              development. See the{" "}
              <Link
                href="/privacy"
                className="text-green-300 transition hover:text-green-200"
              >
                privacy notice
              </Link>
              .
            </span>
          </label>

          <div className="mt-4">
            {!siteKey ? (
              <p
                role="alert"
                className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-300"
              >
                Newsletter verification is not configured.
              </p>
            ) : (
              <>
                <div
                  ref={
                    turnstileContainerRef
                  }
                  className="w-full overflow-hidden"
                />

                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-gray-500">
                  <ShieldCheck
                    size={13}
                    aria-hidden="true"
                  />
                  Protected by Cloudflare Turnstile
                </p>
              </>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}