import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Download,
  FileText,
  GraduationCap,
  Mail,
  ShieldCheck,
} from "lucide-react";

import Container from "../components/Container";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "View Md Samsudduha Shawon's cybersecurity resume, education, verified credentials, technical skills, infrastructure projects, and professional development.",

  alternates: {
    canonical: "/resume",
  },

  openGraph: {
    title: "Resume & Career Overview",
    description:
      "Md Samsudduha Shawon's cybersecurity education, verified credentials, technical projects, skills, and professional development.",
    url: "/resume",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Resume & Career Overview",
    description:
      "Cybersecurity education, verified credentials, technical projects, skills, and professional development.",
  },
};

const education = [
  {
    title: "MSc Cyber Security Management",
    qualification: "with Professional Practice",
    institution: "The University of Law",
    period: "2026–2028",
    status: "Current",
  },
  {
    title: "BSc Computer Science",
    qualification: "First-Class Honours",
    institution: "University of East London",
    period: "Completed in 2024",
    status: "Completed",
  },
];

const focusAreas = [
  "Ethical hacking",
  "Network security",
  "Linux and Windows",
  "Secure infrastructure",
  "TrueNAS and ZFS",
  "Nextcloud and self-hosting",
  "Cloudflare and secure access",
  "TypeScript and Next.js",
  "Supabase and PostgreSQL",
];

const credentialSummary = [
  {
    title: "Verified credentials",
    detail: "Three Cisco Networking Academy courses",
    status: "Completed",
  },
  {
    title: "Current technical study",
    detail: "Networking Basics and Ethical Hacker",
    status: "In Progress",
  },
  {
    title: "Professional certification plan",
    detail: "CompTIA Network+ and CompTIA Security+",
    status: "Planned",
  },
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
            <span className="text-green-400">Career Overview</span>
          </h1>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-green-400" />

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-300">
            An overview of my cybersecurity education, verified credentials,
            technical skills, infrastructure projects, and continued
            professional development.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/Shawon-CV.pdf"
              download="Shawon-CV.pdf"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400"
            >
              Download CV
              <Download size={18} aria-hidden="true" />
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 font-medium text-white transition hover:border-green-400 hover:text-green-300"
            >
              Contact Me
              <Mail size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Professional summary */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <article className="h-full rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                <BriefcaseBusiness size={22} aria-hidden="true" />
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-white">
                Professional Summary
              </h2>

              <p className="mt-4 leading-8 text-gray-400">
                I am a First-Class Computer Science graduate currently
                pursuing an MSc in Cyber Security Management with Professional
                Practice. I am developing practical capability across network
                security, secure infrastructure, self-hosted services, and
                ethical hacking through structured study and documented
                technical projects.
              </p>
            </article>

            <article className="h-full rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                <ShieldCheck size={22} aria-hidden="true" />
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-white">
                Career Direction
              </h2>

              <p className="mt-4 leading-8 text-gray-400">
                Ethical hacking, network security, offensive-security
                development, secure infrastructure, and practical
                cybersecurity.
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
                My education combines a First-Class computing foundation with
                postgraduate cybersecurity management and professional
                practice.
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
                      <GraduationCap size={22} aria-hidden="true" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold text-white">
                          {item.title}
                        </h3>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${
                            item.status === "Current"
                              ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                              : "border-green-400/20 bg-green-400/10 text-green-300"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-gray-300">
                        {item.qualification}
                      </p>

                      <p className="mt-2 font-medium text-green-300">
                        {item.institution}
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        {item.period}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Technical focus */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Technical Focus
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Skills and development areas
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              Technologies and security areas developed through academic
              study, independent learning, and practical projects.
            </p>
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
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Credentials */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Professional Development
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Credential overview
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              A transparent summary of my completed credentials, current
              technical study, and planned professional certifications.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {credentialSummary.map((item) => (
              <article
                key={item.title}
                className="h-full rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6"
              >
              <div className="flex items-start justify-between gap-4">
                <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                  <Award size={22} aria-hidden="true" />
                </div>

                <span
                  className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${
                    item.status === "Completed"
                      ? "border-green-400/20 bg-green-400/10 text-green-300"
                      : item.status === "In Progress"
                        ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                        : "border-white/10 bg-white/5 text-gray-300"
                  }`}
                >
                  {item.status}
                </span>
              </div>

                <h3 className="mt-4 text-xl font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/certifications"
              className="inline-flex items-center gap-2 font-medium text-green-400 transition hover:text-green-300"
            >
              View certifications and credentials
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>

      {/* CV document */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Full Document
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              View or download my CV
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              Open the complete CV in your browser or download a PDF copy for
              offline review.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-8 md:p-10">
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="flex items-start gap-5">
                <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-400/10 text-green-300">
                  <FileText size={28} aria-hidden="true" />
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white">
                    Md Samsudduha Shawon — CV
                  </h3>

                  <p className="mt-2 max-w-2xl leading-7 text-gray-400">
                    Cybersecurity, infrastructure, technical projects,
                    education, and professional development.
                  </p>

                  <p className="mt-3 text-sm text-gray-500">
                    PDF document · Two pages
                  </p>
                </div>
              </div>

              <div className="flex w-full flex-wrap gap-4 md:w-auto md:shrink-0 md:justify-end">
                <a
                  href="/Shawon-CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-3 font-medium text-white transition hover:border-green-400 hover:text-green-300"
                >
                  Open CV
                  <ArrowRight size={18} aria-hidden="true" />
                </a>

                <a
                  href="/Shawon-CV.pdf"
                  download="Shawon-CV.pdf"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400"
                >
                  Download CV
                  <Download size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}