import type {
  Metadata,
} from "next";
import Link from "next/link";
import {
  Clock3,
  Database,
  Globe2,
  LockKeyhole,
  Mail,
  Scale,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import Container from "../components/Container";

export const metadata: Metadata = {
  title:
    "Privacy Notice",

  description:
    "Learn how Meet Shawon collects, uses, protects, and manages personal information across the website, accounts, contact form, and newsletter.",

  alternates: {
    canonical:
      "/privacy",
  },

  openGraph: {
    title:
      "Privacy Notice",
    description:
      "How Meet Shawon manages personal information, website accounts, contact messages, security data, and newsletter subscriptions.",
    url:
      "/privacy",
    type:
      "website",
  },
};

const privacySections = [
  {
    icon:
      UserRound,

    title:
      "Who manages your information",

    content: (
      <>
        <p>
          This website is operated by Md Samsudduha Shawon under the Meet
          Shawon name. For questions about this privacy notice or your personal
          information, email{" "}
          <a
            href="mailto:contact@meetshawon.com"
            className="text-green-300 transition hover:text-green-200"
          >
            contact@meetshawon.com
          </a>
          .
        </p>
      </>
    ),
  },

  {
    icon:
      Database,

    title:
      "Information that may be collected",

    content: (
      <>
        <p>
          Depending on how you use the website, information may include:
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>
            Account details, profile information, authentication records, and
            account preferences.
          </li>

          <li>
            Information submitted through the contact form, including your
            name, email address, subject, and message.
          </li>

          <li>
            Newsletter email address, consent record, confirmation status, and
            unsubscribe status.
          </li>

          <li>
            Comments, reactions, saved articles, moderation records, and other
            community activity.
          </li>

          <li>
            Technical and security information such as browser details, request
            information, error reports, service logs, and authentication
            events.
          </li>
        </ul>
      </>
    ),
  },

  {
    icon:
      Scale,

    title:
      "Why information is used",

    content: (
      <>
        <p>
          Personal information is used only where there is an appropriate
          reason, including:
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>
            Providing website accounts, profiles, security controls, community
            features, and requested services.
          </li>

          <li>
            Responding to contact messages and professional enquiries.
          </li>

          <li>
            Sending newsletter emails after explicit consent and confirmation.
          </li>

          <li>
            Protecting the website, preventing abuse, investigating errors, and
            maintaining reliable operations.
          </li>

          <li>
            Meeting applicable legal, security, and record-keeping
            responsibilities.
          </li>
        </ul>

        <p className="mt-4">
          Newsletter emails rely on consent. Website security, abuse
          prevention, service reliability, and appropriate administrative
          records may rely on legitimate interests or legal obligations.
        </p>
      </>
    ),
  },

  {
    icon:
      Mail,

    title:
      "Newsletter and marketing emails",

    content: (
      <>
        <p>
          Newsletter subscriptions use a double-confirmation process. Entering
          an email address does not complete the subscription until the
          confirmation link is opened.
        </p>

        <p className="mt-4">
          Newsletter messages cover occasional cybersecurity projects,
          technical articles, qualifications, and platform-development
          updates. Every newsletter will provide an unsubscribe option.
        </p>

        <p className="mt-4">
          Unsubscribed addresses may be retained on a suppression record where
          necessary to ensure that the opt-out continues to be respected.
        </p>
      </>
    ),
  },

  {
    icon:
      LockKeyhole,

    title:
      "Security and service providers",

    content: (
      <>
        <p>
          Appropriate technical and organisational safeguards are used to
          protect information. The website uses specialist service providers
          for hosting, authentication, database services, security, email,
          monitoring, and infrastructure operations.
        </p>

        <p className="mt-4">
          These services may include Vercel, Supabase, Cloudflare, Resend,
          Sentry, and uptime-monitoring providers. They process information only
          as required to provide or secure their respective services.
        </p>

        <p className="mt-4">
          Some providers may process information outside the United Kingdom.
          Where applicable, information is handled using the provider&apos;s
          relevant contractual and transfer safeguards.
        </p>
      </>
    ),
  },

  {
    icon:
      Clock3,

    title:
      "How long information is retained",

    content: (
      <>
        <p>
          Information is kept only for as long as reasonably necessary for the
          purpose for which it was collected, website security, dispute
          resolution, or applicable legal requirements.
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>
            Account information is generally retained while the account remains
            active and is removed or anonymised through applicable account
            deletion processes.
          </li>

          <li>
            Contact messages are retained only while they remain relevant to the
            enquiry or professional relationship.
          </li>

          <li>
            Confirmed newsletter records remain active until the subscriber
            unsubscribes.
          </li>

          <li>
            Unconfirmed newsletter records may be removed when they are no
            longer operationally necessary.
          </li>

          <li>
            Security, moderation, backup, and operational records may be kept
            for an appropriate limited period.
          </li>
        </ul>
      </>
    ),
  },

  {
    icon:
      Globe2,

    title:
      "Cookies and local storage",

    content: (
      <>
        <p>
          The website may use cookies or browser storage that are necessary for
          authentication, account sessions, preferences, security, and core
          website functionality.
        </p>

        <p className="mt-4">
          Browser settings can be used to restrict cookies, although blocking
          essential storage may prevent sign-in and account features from
          working correctly.
        </p>
      </>
    ),
  },

  {
    icon:
      ShieldCheck,

    title:
      "Your rights",

    content: (
      <>
        <p>
          Depending on the circumstances, you may have rights to request access,
          correction, deletion, restriction, objection, portability, or
          withdrawal of consent concerning your personal information.
        </p>

        <p className="mt-4">
          To make a request, email{" "}
          <a
            href="mailto:contact@meetshawon.com"
            className="text-green-300 transition hover:text-green-200"
          >
            contact@meetshawon.com
          </a>
          . You may also have the right to raise a concern with the UK
          Information Commissioner&apos;s Office.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main>
      <section className="px-6 pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Privacy & Data Protection
          </p>

          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Privacy{" "}
            <span className="text-green-400">
              Notice
            </span>
          </h1>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-green-400" />

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-300">
            This notice explains how personal information is collected, used,
            protected, and managed when you use Meet Shawon.
          </p>

          <p className="mt-5 text-sm text-gray-500">
            Last updated: 24 August 2026
          </p>
        </div>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-6">
            {privacySections.map(
              (section) => {
                const Icon =
                  section.icon;

                return (
                  <article
                    key={
                      section.title
                    }
                    className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-7 md:p-8"
                  >
                    <div className="flex items-start gap-4">
                      <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                        <Icon
                          size={21}
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0">
                        <h2 className="text-xl font-semibold text-white md:text-2xl">
                          {section.title}
                        </h2>

                        <div className="mt-4 leading-7 text-gray-400">
                          {section.content}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>

          <div className="mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400"
            >
              Contact Me
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-white/15 px-6 py-3 font-medium text-white transition hover:border-green-400 hover:text-green-300"
            >
              Return Home
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}