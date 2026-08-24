import type {
  Metadata,
} from "next";
import Link from "next/link";
import {
  FileText,
  Mail,
  Scale,
  ShieldCheck,
} from "lucide-react";

import Container from "../components/Container";

export const metadata: Metadata = {
  title:
    "Terms of Use",

  description:
    "Terms governing access to and use of the Meet Shawon website, community features, newsletter, content, and restricted services.",

  alternates: {
    canonical:
      "/terms",
  },

  openGraph: {
    title:
      "Terms of Use | Meet Shawon",

    description:
      "Terms governing access to and use of the Meet Shawon website and its services.",

    url:
      "/terms",

    type:
      "website",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Terms of Use | Meet Shawon",

    description:
      "Terms governing access to and use of the Meet Shawon website and its services.",
  },
};

const sections = [
  {
    title:
      "1. About these terms",

    paragraphs: [
      "These Terms of Use govern access to and use of meetshawon.com, including its public pages, accounts, profiles, blog interactions, newsletter, community features, and any restricted services made available through the platform.",

      "The website is operated by Md Samsudduha Shawon under the Meet Shawon name. References to “Meet Shawon”, “the website”, “I”, “me”, or “my” in these terms refer to the website and its operator as appropriate.",

      "By accessing or using the website, you agree to follow these terms. If you do not agree with them, you should stop using the website and any associated services.",
    ],
  },

  {
    title:
      "2. Purpose of the website",

    paragraphs: [
      "Meet Shawon is a professional portfolio and technical platform used to present education, qualifications, projects, cybersecurity development, technical writing, and professional experience.",

      "The website may also provide community functionality, user accounts, comments, reactions, saved content, newsletters, and controlled access to selected private services.",

      "Unless expressly stated otherwise, the website does not sell products or provide paid professional, legal, financial, or cybersecurity consulting services.",
    ],
  },

  {
    title:
      "3. Accounts and account security",

    paragraphs: [
      "Some functionality requires an account. You must provide accurate information and keep your sign-in credentials secure. You are responsible for activity carried out through your account unless the activity resulted from a security failure under the website operator’s control.",

      "You must not share credentials, impersonate another person, create accounts for deceptive purposes, or attempt to obtain access to another user’s account.",

      "If you believe your account has been accessed without permission, contact me promptly and change your credentials where possible.",

      "Accounts may be restricted, suspended, or removed when reasonably necessary to protect the platform, its users, its infrastructure, or to address a material breach of these terms.",
    ],
  },

  {
    title:
      "4. Acceptable use",

    paragraphs: [
      "You may use the website only for lawful purposes and in a way that does not harm the website, its users, its infrastructure, or any third party.",
    ],

    items: [
      "Attempt to gain unauthorised access to accounts, systems, storage, APIs, administrative areas, or private services.",
      "Probe, scan, test, exploit, or attack the website or connected infrastructure without prior written permission.",
      "Upload, publish, transmit, or link to malware, malicious code, fraudulent material, or unlawfully obtained information.",
      "Use automated tools to scrape, overload, disrupt, abuse, or interfere with the website.",
      "Circumvent authentication, rate limits, moderation controls, security controls, or access restrictions.",
      "Harass, threaten, defame, deceive, impersonate, or unlawfully discriminate against another person.",
      "Publish content that infringes intellectual-property, privacy, confidentiality, or other legal rights.",
      "Use the website to facilitate unlawful activity or unauthorised cybersecurity activity.",
    ],
  },

  {
    title:
      "5. Cybersecurity content",

    paragraphs: [
      "Cybersecurity articles, projects, demonstrations, code, configurations, and learning materials are provided for education, professional development, and authorised defensive or testing purposes.",

      "Nothing on the website grants permission to access, test, monitor, interfere with, or exploit any system, network, account, application, or data that you do not own or have explicit authorisation to test.",

      "You are responsible for ensuring that your use of technical information is lawful, authorised, appropriately controlled, and suitable for your circumstances.",

      "Cybersecurity information changes over time. Although reasonable care is taken when presenting technical material, it should not be treated as a guarantee that a system will be secure or suitable for production use.",
    ],
  },

  {
    title:
      "6. User content and community features",

    paragraphs: [
      "The website may allow users to create profiles, publish comments, submit messages, react to posts, save content, or otherwise provide information and material.",

      "You retain ownership of content you submit. By submitting content intended for publication, you grant Meet Shawon a non-exclusive, worldwide, royalty-free licence to store, reproduce, display, format, and process that content only as reasonably necessary to operate, secure, moderate, and present the website.",

      "You confirm that you have the rights and permissions required to submit your content and that its publication does not breach any law or third-party rights.",

      "Content may be reviewed, limited, hidden, or removed where reasonably considered unlawful, abusive, misleading, unsafe, irrelevant, infringing, or inconsistent with these terms. Moderation decisions may also be taken to protect users or platform integrity.",
    ],
  },

  {
    title:
      "7. Private Drive and restricted services",

    paragraphs: [
      "A public website account does not automatically provide access to private Drive storage, infrastructure, administrative functionality, or any other restricted service.",

      "Access to restricted services is granted separately and may be subject to additional permissions, storage limits, security requirements, or individual arrangements.",

      "Users with authorised Drive access must use it only for the agreed purpose and must not attempt to access another user’s files, storage area, credentials, or permissions.",

      "Restricted access may be withdrawn when an arrangement ends, when access is no longer required, when security requires it, or when these terms are materially breached.",
    ],
  },

  {
    title:
      "8. Newsletter and communications",

    paragraphs: [
      "Newsletter subscriptions use a confirmation process. Emails are sent only after the subscriber confirms the address using the confirmation link.",

      "Subscribers can unsubscribe using the link included in newsletter emails. Unsubscribe requests are applied to future newsletter communications, subject to reasonable technical processing time.",

      "Service-related or security-related communications may still be sent when necessary to operate an account or respond to an enquiry. More information about personal information and email processing is available in the Privacy Notice.",
    ],
  },

  {
    title:
      "9. Intellectual property",

    paragraphs: [
      "Unless otherwise stated, the website’s original text, design, branding, project documentation, graphics, code examples, and other original material belong to Md Samsudduha Shawon.",

      "You may view the website and share links to its public pages for personal, educational, recruitment, and professional-reference purposes.",

      "You must not reproduce, republish, sell, present as your own, or commercially exploit substantial parts of the website without prior written permission, except where applicable law or an expressly stated licence permits it.",

      "Third-party names, trademarks, logos, platforms, libraries, and services remain the property of their respective owners. Their appearance does not imply endorsement or affiliation unless expressly stated.",
    ],
  },

  {
    title:
      "10. External links and services",

    paragraphs: [
      "The website may link to external platforms such as GitHub, LinkedIn, Credly, Cisco Networking Academy, educational providers, hosting providers, or other third-party services.",

      "External websites are controlled by their respective operators. Meet Shawon is not responsible for their availability, content, security, privacy practices, or terms.",

      "You should review the applicable terms and privacy information before using an external service.",
    ],
  },

  {
    title:
      "11. Availability and changes",

    paragraphs: [
      "Reasonable efforts are made to keep the website secure and available, but uninterrupted or error-free operation cannot be guaranteed.",

      "Features may be updated, replaced, restricted, suspended, or removed when reasonably necessary for maintenance, security, legal compliance, platform development, or operational reasons.",

      "Planned projects, qualifications, learning goals, and development timelines shown on the website may change and should not be treated as binding commitments.",
    ],
  },

  {
    title:
      "12. Disclaimers",

    paragraphs: [
      "The website and its free informational content are provided on an “as available” basis. Content is intended for general information, education, portfolio presentation, and professional discussion.",

      "Information on the website is not a substitute for professional legal, financial, medical, employment, or specialised cybersecurity advice.",

      "You should independently assess technical instructions, configurations, software, and security recommendations before relying on them or applying them to an important system.",
    ],
  },

  {
    title:
      "13. Responsibility and liability",

    paragraphs: [
      "Nothing in these terms excludes or limits responsibility where doing so would be unlawful, including responsibility for fraud, fraudulent misrepresentation, or death or personal injury caused by negligence.",

      "Subject to the paragraph above, Meet Shawon is not responsible for losses caused by unauthorised use of information from the website, external services outside my control, user-supplied content, or circumstances that could not reasonably have been prevented.",

      "Nothing in these terms affects any statutory rights that cannot legally be excluded or restricted.",
    ],
  },

  {
    title:
      "14. Privacy and security",

    paragraphs: [
      "Personal information is handled as described in the Privacy Notice. The Privacy Notice explains what information is collected, why it is used, service providers involved, retention, and available rights.",

      "Although appropriate safeguards are used, no internet service can guarantee absolute security. You should avoid submitting confidential, highly sensitive, or unnecessary personal information through public forms or community features.",
    ],
  },

  {
    title:
      "15. Changes to these terms",

    paragraphs: [
      "These terms may be updated to reflect changes to the website, its functionality, applicable law, security requirements, or operating practices.",

      "The latest version will be published on this page with an updated revision date. Material changes may also be communicated through the website or relevant account functionality where appropriate.",

      "Continued use of the website after updated terms take effect means the updated terms will apply to subsequent use.",
    ],
  },

  {
    title:
      "16. Governing law",

    paragraphs: [
      "These terms are governed by the laws of England and Wales, subject to any mandatory protections or rights that apply under the law of the country in which you live.",

      "Any dispute should first be raised using the contact details below so that a reasonable attempt can be made to resolve it informally.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main>
      <section className="px-6 pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Website Information
          </p>

          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Terms of{" "}
            <span className="text-green-400">
              Use
            </span>
          </h1>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-green-400" />

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-300">
            The terms governing access to and use of the Meet Shawon website,
            its community features, newsletter, content, and restricted
            services.
          </p>

          <p className="mt-5 text-sm text-gray-500">
            Last updated: 24 August 2026
          </p>
        </div>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <aside>
              <div className="sticky top-28 rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                  <Scale
                    size={22}
                    aria-hidden="true"
                  />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-white">
                  Clear and responsible use
                </h2>

                <p className="mt-4 leading-7 text-gray-400">
                  These terms help protect visitors, registered users, the
                  platform, and the technical infrastructure supporting it.
                </p>

                <div className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm">
                  <Link
                    href="/privacy"
                    className="flex items-center gap-3 text-gray-300 transition hover:text-green-300"
                  >
                    <ShieldCheck
                      size={17}
                      aria-hidden="true"
                    />
                    Privacy Notice
                  </Link>

                  <Link
                    href="/contact"
                    className="flex items-center gap-3 text-gray-300 transition hover:text-green-300"
                  >
                    <Mail
                      size={17}
                      aria-hidden="true"
                    />
                    Contact
                  </Link>
                </div>
              </div>
            </aside>

            <div className="space-y-6">
              <div className="rounded-2xl border border-green-400/15 bg-green-400/5 p-6">
                <div className="flex items-start gap-4">
                  <FileText
                    size={22}
                    className="mt-1 shrink-0 text-green-300"
                    aria-hidden="true"
                  />

                  <p className="leading-7 text-gray-300">
                    Please read these terms before using an account, community
                    feature, newsletter, or restricted service. They should be
                    read together with the{" "}
                    <Link
                      href="/privacy"
                      className="font-medium text-green-300 transition hover:text-green-200"
                    >
                      Privacy Notice
                    </Link>
                    .
                  </p>
                </div>
              </div>

              {sections.map((section) => (
                <article
                  key={section.title}
                  className="rounded-2xl border border-white/10 bg-[var(--surface)]/60 p-6 md:p-8"
                >
                  <h2 className="text-xl font-semibold text-white md:text-2xl">
                    {section.title}
                  </h2>

                  <div className="mt-5 space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="leading-8 text-gray-400"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {section.items && (
                    <ul className="mt-5 space-y-3">
                      {section.items.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 leading-7 text-gray-400"
                        >
                          <span
                            className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400"
                            aria-hidden="true"
                          />

                          <span>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}

              <article className="rounded-2xl border border-green-400/20 bg-green-400/5 p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-white">
                  Contact
                </h2>

                <p className="mt-4 leading-8 text-gray-400">
                  Questions, concerns, permission requests, or notices relating
                  to these terms can be sent to:
                </p>

                <a
                  href="mailto:contact@meetshawon.com"
                  className="mt-5 inline-flex items-center gap-2 font-medium text-green-300 transition hover:text-green-200"
                >
                  <Mail
                    size={18}
                    aria-hidden="true"
                  />
                  contact@meetshawon.com
                </a>
              </article>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}