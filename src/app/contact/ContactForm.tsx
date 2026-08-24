"use client";

import Script from "next/script";
import type { FormEvent } from "react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { Send } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const [formData, setFormData] =
    useState<FormData>(initialFormData);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);

  const turnstileContainerRef =
    useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  const updateField = (
    field: keyof FormData,
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError("");
    }

    if (submitted) {
      setSubmitted(false);
    }
  };

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

    widgetIdRef.current = window.turnstile.render(
      turnstileContainerRef.current,
      {
        sitekey: siteKey,
        theme: "dark",
        size: "flexible",

        callback: (token) => {
          setTurnstileToken(token);
          setError("");
        },

        "expired-callback": () => {
          setTurnstileToken("");
          setError(
            "Human verification expired. Please complete it again.",
          );
        },

        "error-callback": () => {
          setTurnstileToken("");
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
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, turnstileReady]);

  const resetTurnstile = () => {
    setTurnstileToken("");

    if (
      widgetIdRef.current &&
      window.turnstile
    ) {
      window.turnstile.reset(widgetIdRef.current);
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setSubmitted(false);

    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!name || !email || !subject || !message) {
      setError("Please complete every field.");
      return;
    }

    if (name.length < 2) {
      setError("Please enter your name.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (subject.length < 3) {
      setError("Please enter a more descriptive subject.");
      return;
    }

    if (message.length < 10) {
      setError(
        "Please provide a little more information in your message.",
      );
      return;
    }

    if (!turnstileToken) {
      setError(
        "Please complete the human verification before sending your message.",
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          turnstileToken,
        }),
      });

      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error ?? "The message could not be sent.",
        );
      }

      setSubmitted(true);
      setFormData(initialFormData);
      resetTurnstile();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The message could not be sent.",
      );

      resetTurnstile();
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyles =
    "mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400 focus:ring-1 focus:ring-green-400/30 disabled:cursor-not-allowed disabled:opacity-60";

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
        onReady={() => {
          setTurnstileReady(true);
        }}
        onError={() => {
          setTurnstileReady(false);
          setError(
            "Human verification could not be loaded. Please refresh the page and try again.",
          );
        }}
      />

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
        aria-busy={submitting}
        noValidate
      >
        <div className="grid gap-6 md:grid-cols-2">
          <label
            htmlFor="contact-name"
            className="text-sm font-medium text-gray-300"
          >
            Name

            <input
              id="contact-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
              placeholder="Your name"
              className={inputStyles}
              autoComplete="name"
              minLength={2}
              maxLength={100}
              required
              disabled={submitting}
            />
          </label>

          <label
            htmlFor="contact-email"
            className="text-sm font-medium text-gray-300"
          >
            Email address

            <input
              id="contact-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(event) =>
                updateField("email", event.target.value)
              }
              placeholder="you@example.com"
              className={inputStyles}
              autoComplete="email"
              inputMode="email"
              maxLength={254}
              required
              disabled={submitting}
            />
          </label>
        </div>

        <label
          htmlFor="contact-subject"
          className="block text-sm font-medium text-gray-300"
        >
          Subject

          <input
            id="contact-subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={(event) =>
              updateField("subject", event.target.value)
            }
            placeholder="What would you like to discuss?"
            className={inputStyles}
            minLength={3}
            maxLength={150}
            required
            disabled={submitting}
          />
        </label>

        <label
          htmlFor="contact-message"
          className="block text-sm font-medium text-gray-300"
        >
          Message

          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={(event) =>
              updateField("message", event.target.value)
            }
            placeholder="Tell me about the opportunity, project, or reason for getting in touch."
            rows={8}
            className={`${inputStyles} resize-y`}
            minLength={10}
            maxLength={5000}
            required
            disabled={submitting}
          />
        </label>

        <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-medium text-white">
                Security verification
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Protected by Cloudflare Turnstile to help prevent automated
                spam.
              </p>
            </div>

            {!siteKey ? (
              <p
                role="alert"
                className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-300"
              >
                Human verification is not configured.
              </p>
            ) : (
              <div className="flex justify-center overflow-hidden rounded-xl">
                <div
                  ref={turnstileContainerRef}
                  className="w-full max-w-[420px]"
                />
              </div>
            )}
          </div>
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
          <div
            role="status"
            className="rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-4 text-sm text-green-300"
          >
            <p className="font-medium">
              Your message has been sent successfully.
            </p>

            <p className="mt-1 text-green-200/80">
              Thank you for getting in touch. I&apos;ll respond as soon as
              possible.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={
            submitting ||
            !siteKey ||
            !turnstileToken
          }
          className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send Message"}

          <Send size={18} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}