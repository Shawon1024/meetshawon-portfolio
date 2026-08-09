"use client";

import {
  CheckCircle2,
  Send,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import { createClient } from "../../lib/supabase/client";

interface BlockAppealFormProps {
  hasPendingAppeal:
    boolean;
}

export default function BlockAppealForm({
  hasPendingAppeal,
}: BlockAppealFormProps) {
  const supabase =
    useMemo(
      () =>
        createClient(),
      [],
    );

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    pending,
    setPending,
  ] =
    useState(
      hasPendingAppeal,
    );

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState(false);

  const submitAppeal =
    async () => {
      setError("");
      setSuccess(false);

      if (
        message
          .trim()
          .length <
        10
      ) {
        setError(
          "Please explain your request in a little more detail.",
        );

        return;
      }

      try {
        setSubmitting(
          true,
        );

        const {
          error:
            appealError,
        } =
          await supabase.rpc(
            "submit_block_appeal",
            {
              appeal_message:
                message.trim(),
            },
          );

        if (
          appealError
        ) {
          throw appealError;
        }

        setPending(
          true,
        );

        setSuccess(
          true,
        );

        setMessage("");
      } catch (
        submitError
      ) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Your appeal could not be submitted.",
        );
      } finally {
        setSubmitting(
          false,
        );
      }
    };

  if (
    pending
  ) {
    return (
      <div className="rounded-2xl border border-green-400/20 bg-green-400/[0.06] p-5">
        <div className="flex gap-3">
          <CheckCircle2
            size={21}
            className="mt-0.5 shrink-0 text-green-300"
          />

          <div>
            <p className="font-medium text-white">
              Review requested
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Your appeal has been submitted and is waiting for administrator
              review.
            </p>

            {success && (
              <p className="mt-2 text-sm text-green-300">
                Your request was submitted successfully.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
      <p className="font-medium text-white">
        Request a review
      </p>

      <p className="mt-2 text-sm leading-6 text-gray-400">
        Explain why you believe your account block should be reviewed.
      </p>

      <textarea
        value={
          message
        }
        onChange={(
          event,
        ) =>
          setMessage(
            event.target
              .value,
          )
        }
        maxLength={2000}
        rows={6}
        placeholder="Explain your situation..."
        className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-400/40"
      />

      <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
        <span>
          Minimum 10 characters
        </span>

        <span>
          {
            message.length
          }
          /2000
        </span>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {
            error
          }
        </div>
      )}

      <button
        type="button"
        disabled={
          submitting
        }
        onClick={() => {
          void submitAppeal();
        }}
        className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send
          size={16}
        />

        {submitting
          ? "Submitting..."
          : "Submit Review Request"}
      </button>
    </div>
  );
}