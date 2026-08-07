"use client";

import {
  Check,
  Copy,
  Mail,
  Share2,
} from "lucide-react";
import { useState } from "react";

interface ArticleShareProps {
  title: string;
  slug: string;
}

/* --------------------------------------------------
   LINKEDIN ICON
-------------------------------------------------- */

function LinkedInIcon({
  size = 17,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5.2 3.5A2.2 2.2 0 1 1 5.2 7.9a2.2 2.2 0 0 1 0-4.4ZM3.3 9.4h3.8V21H3.3V9.4ZM9.3 9.4h3.6V11h.1c.5-.9 1.7-2 3.6-2 3.9 0 4.6 2.5 4.6 5.8V21h-3.8v-5.5c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21H9.3V9.4Z" />
    </svg>
  );
}

/* --------------------------------------------------
   X ICON
-------------------------------------------------- */

function XIcon({
  size = 17,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.9-6.4L6.5 22H3.4l7.2-8.2L2.8 2h6.4l4.4 5.8L18.9 2Zm-1.1 17.9h1.7L8.3 4H6.5l11.3 15.9Z" />
    </svg>
  );
}

/* --------------------------------------------------
   FACEBOOK ICON
-------------------------------------------------- */

function FacebookIcon({
  size = 17,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.6 22v-9h3l.5-3.5h-3.5V7.3c0-1 .3-1.7 1.8-1.7h1.9V2.5c-.3 0-1.5-.1-2.8-.1-2.8 0-4.7 1.7-4.7 4.8v2.3H6.7V13h3.1v9h3.8Z" />
    </svg>
  );
}

export default function ArticleShare({
  title,
  slug,
}: ArticleShareProps) {
  const [copied, setCopied] =
    useState(false);

  // --------------------------------------------------
  // ARTICLE URL
  // --------------------------------------------------

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const cleanSiteUrl =
    siteUrl.replace(/\/$/, "");

  const pageUrl =
    `${cleanSiteUrl}/blog/${slug}`;

  // --------------------------------------------------
  // COPY LINK
  // --------------------------------------------------

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        pageUrl,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Could not copy article link:",
        error,
      );

      setCopied(false);
    }
  };

  // --------------------------------------------------
  // SHARE URLS
  // --------------------------------------------------

  const encodedUrl =
    encodeURIComponent(pageUrl);

  const encodedTitle =
    encodeURIComponent(title);

  const linkedInUrl =
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const xUrl =
    `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;

  const facebookUrl =
    `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  const emailUrl =
    `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(
      `${title}\n\n${pageUrl}`,
    )}`;

  // --------------------------------------------------
  // OPEN SHARE WINDOW
  // --------------------------------------------------

  const openShareWindow = (
    url: string,
  ) => {
    window.open(
      url,
      "_blank",
      "noopener,noreferrer,width=700,height=600",
    );
  };

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <section className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
      {/* Header */}

      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
          <Share2 size={19} />
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
            Share
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Share this article
          </h2>
        </div>
      </div>

      {/* Share buttons */}

      <div className="mt-6 flex flex-wrap gap-3">
        {/* Copy */}

        <button
          type="button"
          onClick={() => {
            void copyLink();
          }}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
            copied
              ? "border-green-400/30 bg-green-400/10 text-green-300"
              : "border-white/10 bg-black/10 text-gray-300 hover:border-green-400/30 hover:text-white"
          }`}
        >
          {copied ? (
            <Check size={17} />
          ) : (
            <Copy size={17} />
          )}

          {copied
            ? "Copied"
            : "Copy Link"}
        </button>

        {/* LinkedIn */}

        <button
          type="button"
          onClick={() => {
            openShareWindow(
              linkedInUrl,
            );
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-blue-400/30 hover:text-blue-300"
        >
          <LinkedInIcon />
          LinkedIn
        </button>

        {/* X */}

        <button
          type="button"
          onClick={() => {
            openShareWindow(
              xUrl,
            );
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-white/30 hover:text-white"
        >
          <XIcon />
          X
        </button>

        {/* Facebook */}

        <button
          type="button"
          onClick={() => {
            openShareWindow(
              facebookUrl,
            );
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-blue-400/30 hover:text-blue-300"
        >
          <FacebookIcon />
          Facebook
        </button>

        {/* Email */}

        <a
          href={emailUrl}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-green-400/30 hover:text-green-300"
        >
          <Mail size={17} />
          Email
        </a>
      </div>

      {/* Copy confirmation */}

      {copied && (
        <div
          role="status"
          className="mt-5 flex items-center gap-2 rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm text-green-300"
        >
          <Check size={16} />

          Article link copied to your clipboard.
        </div>
      )}
    </section>
  );
}