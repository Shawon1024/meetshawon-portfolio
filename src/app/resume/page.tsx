import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Download,
  GraduationCap,
  Mail,
  ShieldCheck,
} from "lucide-react";

import Container from "../components/Container";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "View Shawon's resume, education, cybersecurity skills, technical projects, professional development, and career direction.",

  alternates: {
    canonical: "/resume",
  },

  openGraph: {
    title: "Resume & Career Overview",
    description:
      "Shawon's education, cybersecurity skills, technical projects, professional development, and career direction.",
    url: "/resume",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Resume & Career Overview",
    description:
      "Education, cybersecurity skills, technical projects, professional development, and career direction.",
  },
};

const education = [
  {
    title: "MSc Cyber Security Management",
    subtitle: "With Professional Practice",
    status: "Current",
  },
  {
    title: "BSc Computer Science",
    subtitle: "Undergraduate Degree",
    status: "Completed",
  },
];

const focusAreas = [
  "Ethical hacking",
  "Network security",
  "Linux administration",
  "Secure infrastructure",
  "Cloud and self-hosting",
  "Technical documentation",
];

export default function ResumePage() {
  return (
    <main>
      {/* Page header */}
      <section className="px-6 pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Professional Profile
          </p>

          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Resume &{" "}
            <span className="text-green-400">
              Career Overview
            </span>
          </h1>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-green-400" />

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-300">
            A concise overview of my education, technical development,
            cybersecurity interests, projects, and professional direction.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/Shawon-CV.pdf"
              download="Shawon-CV.pdf"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400"
            >
              Download CV
              <Download size={18} />
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 font-medium text-white transition hover:border-green-400 hover:text-green-300"
            >
              Contact Me
              <Mail size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Professional summary */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6 lg:col-span-2">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                <BriefcaseBusiness size={22} />
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-white">
                Professional Summary
              </h2>

              <p className="mt-4 leading-8 text-gray-400">
                I am a Computer Science graduate currently pursuing an MSc in
                Cyber Security Management with Professional Practice. My career
                goal is to develop into an ethical hacking and cybersecurity
                professional through structured study, hands-on labs,
                infrastructure projects, and continuous technical development.
              </p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                <ShieldCheck size={22} />
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-white">
                Career Direction
              </h2>

              <p className="mt-4 leading-7 text-gray-400">
                Ethical hacking, offensive security, secure infrastructure,
                and practical cybersecurity.
              </p>
            </article>
          </div>
        </Container>
      </section>

      {/* Education */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Education
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                Academic background
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                My education combines a broad computing foundation with
                postgraduate cybersecurity management development.
              </p>
            </div>

            <div className="space-y-5">
              {education.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                      <GraduationCap size={22} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold text-white">
                          {item.title}
                        </h3>

                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                          {item.status}
                        </span>
                      </div>

                      <p className="mt-2 text-green-300">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Focus areas */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Focus Areas
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Technical and professional development
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {focusAreas.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/10 bg-black/10 p-5 text-gray-300"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 font-medium text-green-400 transition hover:text-green-300"
            >
              Explore my project case studies
              <ArrowRight size={17} />
            </Link>
          </div>
        </Container>
      </section>

      {/* PDF preview */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Full Document
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              View my CV
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              Preview the document below or download a copy for offline review.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white">
            <iframe
              src="/Shawon-CV.pdf"
              title="Shawon CV"
              loading="lazy"
              className="h-[600px] w-full md:h-[800px]"
            >
              <p>
                Your browser cannot display this PDF.{" "}
                <a href="/Shawon-CV.pdf">
                  Open the CV directly
                </a>
                .
              </p>
            </iframe>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/Shawon-CV.pdf"
              download="Shawon-CV.pdf"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400"
            >
              Download CV
              <Download size={18} />
            </a>
          </div>
        </Container>
      </section>
    </main>
  );
}