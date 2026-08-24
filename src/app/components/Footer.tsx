"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUp,
  Mail,
  Newspaper,
} from "lucide-react";

import Container from "./Container";
import NewsletterForm from "./newsletter/NewsletterForm";
import IconButton from "./ui/IconButton";

const footerLinks = [
  {
    name:
      "About",

    href:
      "/about",
  },
  {
    name:
      "Skills",

    href:
      "/skills",
  },
  {
    name:
      "Projects",

    href:
      "/projects",
  },
  {
    name:
      "Certifications",

    href:
      "/certifications",
  },
  {
    name:
      "Resume",

    href:
      "/resume",
  },
  {
    name:
      "Blog",

    href:
      "/blog",
  },
  {
    name:
      "Contact",

    href:
      "/contact",
  },
];

function GitHubIcon({
  size = 19,
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
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.426 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.866-.014-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.071 1.531 1.031 1.531 1.031.892 1.53 2.341 1.088 2.91.832.091-.647.349-1.088.635-1.338-2.221-.253-4.555-1.112-4.555-4.947 0-1.093.39-1.987 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.295 2.748-1.026 2.748-1.026.546 1.378.203 2.397.1 2.65.64.701 1.028 1.595 1.028 2.688 0 3.845-2.337 4.691-4.566 4.94.359.31.678.921.678 1.856 0 1.34-.012 2.421-.012 2.75 0 .268.18.58.688.481A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function LinkedInIcon({
  size = 19,
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
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.049c.475-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286h-.004ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

export default function Footer() {
  const scrollToTop =
    () => {
      window.scrollTo({
        top:
          0,

        behavior:
          "smooth",
      });
    };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#071c18]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
      >
        <div className="absolute -left-32 top-12 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />

        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <Container>
        <div className="relative grid gap-12 py-16 lg:grid-cols-12 lg:gap-10 lg:py-20">
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex"
              aria-label="Meet Shawon home"
            >
              <Image
                src="/logo.png"
                alt="Meet Shawon"
                width={190}
                height={60}
                className="h-14 w-auto object-contain"
              />
            </Link>

            <p className="mt-6 max-w-md leading-7 text-gray-400">
              Cybersecurity postgraduate student and infrastructure builder
              focused on ethical hacking, secure systems, self-hosting, and
              practical technology projects.
            </p>

            <div className="mt-7 flex gap-3">
              <IconButton
                href="https://github.com/shawon1024"
                newTab
                label="Open Md Samsudduha Shawon's GitHub profile"
              >
                <GitHubIcon/>
              </IconButton>

              <IconButton
                href="https://www.linkedin.com/in/shawon1024/"
                newTab
                label="Open Md Samsudduha Shawon's LinkedIn profile"
              >
                <LinkedInIcon/>
              </IconButton>

              <IconButton
                href="mailto:contact@meetshawon.com"
                label="Email Md Samsudduha Shawon"
              >
                <Mail
                  size={19}
                  aria-hidden="true"
                />
              </IconButton>
            </div>

            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-green-300 transition hover:text-green-200"
            >
              Available for professional opportunities
              <span aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          <div className="lg:col-span-2 lg:pl-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-400">
              Explore
            </p>

            <nav
              className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-1"
              aria-label="Footer navigation"
            >
              {footerLinks.map(
                (link) => (
                  <Link
                    key={
                      link.name
                    }
                    href={
                      link.href
                    }
                    className="w-fit text-gray-400 transition hover:translate-x-1 hover:text-green-300"
                  >
                    {link.name}
                  </Link>
                ),
              )}
            </nav>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur-sm md:p-8">
              <div className="flex items-start gap-4">
                <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                  <Newspaper
                    size={21}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-400">
                    Professional Newsletter
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Follow the work behind the portfolio
                  </h2>
                </div>
              </div>

              <p className="mt-5 max-w-2xl leading-7 text-gray-400">
                Receive occasional updates about cybersecurity projects,
                technical articles, new qualifications, and infrastructure
                development. No unnecessary emails.
              </p>

              <div className="mt-6">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col gap-5 border-t border-white/10 py-7 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <p>
              Copyright ©{" "}
              {new Date().getFullYear()}{" "}
              Md Samsudduha Shawon. All rights reserved.
            </p>

            <div className="flex gap-4">
              <Link
                href="/privacy"
                className="transition hover:text-green-300"
              >
                Privacy
              </Link>

              <Link
                href="/contact"
                className="transition hover:text-green-300"
              >
                Contact
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={
              scrollToTop
            }
            className="inline-flex w-fit items-center gap-2 transition hover:text-green-300"
            aria-label="Back to top"
          >
            Back to top

            <ArrowUp
              size={16}
              aria-hidden="true"
            />
          </button>
        </div>
      </Container>
    </footer>
  );
}