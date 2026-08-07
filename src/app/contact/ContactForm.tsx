"use client";

import { FormEvent, useState } from "react";
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

  const updateField = (
    field: keyof FormData,
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setSubmitted(false);

    const {
      name,
      email,
      subject,
      message,
    } = formData;

    if (
      !name.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      setError("Please complete every field.");
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address.");
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
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
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
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "The message could not be sent.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyles =
    "mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 shadow-2xl md:p-8">
      <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
        Send a Message
      </p>

      <h2 className="mt-3 text-3xl font-bold text-white">
        Contact form
      </h2>

      <p className="mt-4 leading-7 text-gray-400">
        Complete the form below and I&apos;ll respond as soon as possible.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
        noValidate
      >
        <div className="grid gap-6 md:grid-cols-2">
          <label className="text-sm font-medium text-gray-300">
            Name

            <input
              type="text"
              value={formData.name}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
              placeholder="Your name"
              className={inputStyles}
              autoComplete="name"
              maxLength={100}
              disabled={submitting}
            />
          </label>

          <label className="text-sm font-medium text-gray-300">
            Email

            <input
              type="email"
              value={formData.email}
              onChange={(event) =>
                updateField("email", event.target.value)
              }
              placeholder="you@example.com"
              className={inputStyles}
              autoComplete="email"
              maxLength={254}
              disabled={submitting}
            />
          </label>
        </div>

        <label className="block text-sm font-medium text-gray-300">
          Subject

          <input
            type="text"
            value={formData.subject}
            onChange={(event) =>
              updateField("subject", event.target.value)
            }
            placeholder="What would you like to discuss?"
            className={inputStyles}
            maxLength={150}
            disabled={submitting}
          />
        </label>

        <label className="block text-sm font-medium text-gray-300">
          Message

          <textarea
            value={formData.message}
            onChange={(event) =>
              updateField("message", event.target.value)
            }
            placeholder="Write your message here..."
            rows={7}
            className={`${inputStyles} resize-y`}
            maxLength={5000}
            disabled={submitting}
          />
        </label>

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
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send Message"}
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
