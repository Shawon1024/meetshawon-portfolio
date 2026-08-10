"use client";

import Script from "next/script";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Send,
} from "lucide-react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme?: "light" | "dark" | "auto";
      size?: "normal" | "compact" | "flexible";
      callback?: (
        token: string,
      ) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    },
  ) => string;

  reset: (
    widgetId?: string,
  ) => void;

  remove: (
    widgetId: string,
  ) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const initialFormData: FormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const [
    formData,
    setFormData,
  ] =
    useState(
      initialFormData,
    );

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

  const updateField = (
    field:
      keyof FormData,
    value: string,
  ) => {
    setFormData(
      (
        current,
      ) => ({
        ...current,
        [field]:
          value,
      }),
    );
  };

  // --------------------------------------------------
  // RENDER TURNSTILE
  // --------------------------------------------------

  useEffect(() => {
    if (
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
                "Human verification could not be completed. Please try again.",
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
    turnstileReady,
  ]);

  // --------------------------------------------------
  // RESET TURNSTILE
  // --------------------------------------------------

  const resetTurnstile =
    () => {
      setTurnstileToken(
        "",
      );

      if (
        widgetIdRef.current &&
        window.turnstile
      ) {
        window.turnstile.reset(
          widgetIdRef.current,
        );
      }
    };

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const handleSubmit =
    async (
      event:
        FormEvent,
    ) => {
      event.preventDefault();

      setError("");
      setSubmitted(
        false,
      );

      const {
        name,
        email,
        subject,
        message,
      } =
        formData;

      if (
        !name.trim() ||
        !email.trim() ||
        !subject.trim() ||
        !message.trim()
      ) {
        setError(
          "Please complete every field.",
        );

        return;
      }

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailPattern.test(
          email.trim(),
        )
      ) {
        setError(
          "Please enter a valid email address.",
        );

        return;
      }

      if (
        !turnstileToken
      ) {
        setError(
          "Please complete the human verification before sending your message.",
        );

        return;
      }

      try {
        setSubmitting(
          true,
        );

        const response =
          await fetch(
            "/api/contact",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  {
                    name:
                      name.trim(),

                    email:
                      email.trim(),

                    subject:
                      subject.trim(),

                    message:
                      message.trim(),

                    turnstileToken,
                  },
                ),
            },
          );

        const result =
          (await response.json()) as {
            success?:
              boolean;

            error?:
              string;
          };

        if (
          !response.ok
        ) {
          throw new Error(
            result.error ??
              "The message could not be sent.",
          );
        }

        setSubmitted(
          true,
        );

        setFormData(
          initialFormData,
        );

        resetTurnstile();
      } catch (
        caughtError
      ) {
        setError(
          caughtError instanceof
            Error
            ? caughtError.message
            : "The message could not be sent.",
        );

        resetTurnstile();
      } finally {
        setSubmitting(
          false,
        );
      }
    };

  const inputStyles =
    "mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
        Send a Message
      </p>

      <h2 className="mt-3 text-3xl font-bold text-white">
        Contact form
      </h2>

      <p className="mt-4 leading-7 text-gray-400">
        Complete the form below and I&apos;ll respond as soon as possible.
      </p>

      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => {
          setTurnstileReady(
            true,
          );
        }}
      />

      <form
        onSubmit={
          handleSubmit
        }
        className="mt-8 space-y-6"
        noValidate
      >
        <div className="grid gap-6 md:grid-cols-2">
          <label className="text-sm font-medium text-gray-300">
            Name

            <input
              type="text"
              value={
                formData.name
              }
              onChange={(
                event,
              ) =>
                updateField(
                  "name",
                  event.target
                    .value,
                )
              }
              placeholder="Your name"
              className={
                inputStyles
              }
              autoComplete="name"
              maxLength={
                100
              }
              disabled={
                submitting
              }
            />
          </label>

          <label className="text-sm font-medium text-gray-300">
            Email

            <input
              type="email"
              value={
                formData.email
              }
              onChange={(
                event,
              ) =>
                updateField(
                  "email",
                  event.target
                    .value,
                )
              }
              placeholder="you@example.com"
              className={
                inputStyles
              }
              autoComplete="email"
              maxLength={
                254
              }
              disabled={
                submitting
              }
            />
          </label>
        </div>

        <label className="block text-sm font-medium text-gray-300">
          Subject

          <input
            type="text"
            value={
              formData.subject
            }
            onChange={(
              event,
            ) =>
              updateField(
                "subject",
                event.target
                  .value,
              )
            }
            placeholder="What would you like to discuss?"
            className={
              inputStyles
            }
            maxLength={
              150
            }
            disabled={
              submitting
            }
          />
        </label>

        <label className="block text-sm font-medium text-gray-300">
          Message

          <textarea
            value={
              formData.message
            }
            onChange={(
              event,
            ) =>
              updateField(
                "message",
                event.target
                  .value,
              )
            }
            placeholder="Write your message here..."
            rows={
              7
            }
            className={`${inputStyles} resize-y`}
            maxLength={
              5000
            }
            disabled={
              submitting
            }
          />
        </label>

        {/* TURNSTILE */}

        <div>
          <p className="mb-2 text-sm font-medium text-gray-300">
            Human verification
          </p>

          {!siteKey ? (
            <p className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-300">
              Human verification is not configured.
            </p>
          ) : (
            <div
              ref={
                turnstileContainerRef
              }
              className="min-h-[65px] overflow-hidden rounded-xl"
            />
          )}
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        {submitted && (
          <p
            role="status"
            className="rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm text-green-300"
          >
            Your message has been sent successfully. I&apos;ll respond as soon
            as possible.
          </p>
        )}

        <button
          type="submit"
          disabled={
            submitting ||
            !siteKey
          }
          className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Sending..."
            : "Send Message"}

          <Send
            size={
              18
            }
          />
        </button>
      </form>
    </div>
  );
}