import type {
  Metadata,
} from "next";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Cloud,
  Database,
  ExternalLink,
  FileText,
  GitBranch,
  HardDrive,
  LayoutDashboard,
  LockKeyhole,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";

import Badge from "../../components/ui/Badge";
import Container from "../../components/Container";

function GitHubIcon({
  size = 18,
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
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 4.81c1.02 0 2.05.14 3.01.41 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.22.7.82.58A12 12 0 0 0 24 12C24 5.37 18.63 0 12 0Z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title:
    "Professional Portfolio Platform",

  description:
    "A production cybersecurity portfolio and community platform built with Next.js, TypeScript, Supabase, Vercel, Cloudflare, Sentry, authentication, moderation, monitoring, and secure operations.",

  alternates: {
    canonical:
      "/projects/professional-portfolio",
  },

  openGraph: {
    title:
      "Professional Portfolio Platform",

    description:
      "Explore the architecture, security controls, challenges, and operational practices behind meetshawon.com.",

    url:
      "/projects/professional-portfolio",

    type:
      "article",
  },
};

const technologies = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Supabase",
  "Vercel",
  "Cloudflare",
  "Sentry",
  "Resend",
];

const objectives = [
  "Create a professional platform for cybersecurity projects, qualifications, skills, and technical writing",
  "Build secure authentication, profiles, and role-based access",
  "Support blogging, community interaction, administration, and moderation",
  "Provide a secure, role-authorised gateway to the self-hosted private-cloud service",
  "Operate the platform with monitoring, backups, security controls, and documented maintenance",
];

const platformFeatures = [
  {
    icon:
      LayoutDashboard,

    title:
      "Professional Portfolio",

    description:
      "Responsive pages present my background, skills, projects, certifications, CV, contact information, and professional development.",
  },

  {
    icon:
      Users,

    title:
      "Accounts & Profiles",

    description:
      "Supabase authentication supports registration, sign-in, password recovery, user profiles, account settings, and public profile pages.",
  },

  {
    icon:
      BookOpen,

    title:
      "Blog & Community",

    description:
      "The platform includes articles, categories, tags, saved posts, reactions, comments, notifications, related content, and reading features.",
  },

  {
    icon:
      ShieldCheck,

    title:
      "Administration & Moderation",

    description:
      "Protected interfaces support post management, user administration, comment review, appeals, restrictions, and content moderation.",
  },

  {
    icon:
      HardDrive,

    title:
      "Private Drive Gateway",

    description:
      "The drive.meetshawon.com subdomain provides authenticated, role-authorised access to the operational self-hosted TrueNAS and Nextcloud service.",
  },

  {
    icon:
      MessageSquare,

    title:
      "Protected Contact System",

    description:
      "The contact workflow uses server-side validation, Cloudflare Turnstile, Resend, controlled error handling, and a verified custom-domain sender.",
  },
];

const architecture = [
  {
    step:
      "01",

    title:
      "Cloudflare",

    description:
      "Manages DNS for meetshawon.com and drive.meetshawon.com while supporting the wider domain and email-routing configuration.",
  },

  {
    step:
      "02",

    title:
      "Vercel",

    description:
      "Builds and hosts the production Next.js application, manages deployments, custom domains, runtime logs, and observability.",
  },

  {
    step:
      "03",

    title:
      "Next.js Application",

    description:
      "Provides App Router pages, server and client components, APIs, metadata, proxy routing, security headers, and application logic.",
  },

  {
    step:
      "04",

    title:
      "Supabase",

    description:
      "Provides authentication, PostgreSQL data, user profiles, role information, Storage, and application access controls.",
  },

  {
    step:
      "05",

    title:
      "Operational Services",

    description:
      "Sentry, UptimeRobot, Resend, GitHub security tooling, and backup routines support reliability and ongoing maintenance.",
  },
];

const securityControls = [
  {
    title:
      "Server-Side Authentication",

    description:
      "Protected routes verify the authenticated user on the server instead of relying only on browser state.",
  },

  {
    title:
      "Role-Based Access",

    description:
      "Administrative, moderation, and Drive functionality is restricted according to profile roles and server-side authorisation checks.",
  },

  {
    title:
      "Security Headers",

    description:
      "Content Security Policy, frame protection, content-type protection, referrer rules, permissions restrictions, and HTTPS upgrading reduce browser-side risk.",
  },

  {
    title:
      "Contact Protection",

    description:
      "Cloudflare Turnstile, validation, controlled error responses, and limited logging protect the public contact endpoint.",
  },

  {
    title:
      "Dependency & Repository Security",

    description:
      "Dependabot, CodeQL, Secret Protection, Push Protection, npm audit, and controlled dependency updates support repository security.",
  },

  {
    title:
      "Backups & Recovery Planning",

    description:
      "Supabase database and Storage backups are created through documented CLI procedures and kept outside the Git repository.",
  },
];

const monitoringTools = [
  {
    icon:
      Activity,

    title:
      "Sentry",

    description:
      "Captures production exceptions, stack traces, performance information, logs, and error notifications.",
  },

  {
    icon:
      Cloud,

    title:
      "UptimeRobot",

    description:
      "Monitors the application health endpoint and provides failure and recovery alerts.",
  },

  {
    icon:
      Database,

    title:
      "Supabase Monitoring",

    description:
      "Reports and service logs provide visibility across authentication, database, API, Storage, and Realtime services.",
  },

  {
    icon:
      GitBranch,

    title:
      "GitHub Security",

    description:
      "Dependency, code-scanning, secret, and push-protection controls monitor the source repository.",
  },
];

const challenges = [
  {
    title:
      "Drive Subdomain Routing",

    problem:
      "The Drive subdomain originally failed to reach the intended application route.",

    solution:
      "Hostname-aware proxy routing was implemented and the Next.js 16 proxy convention was applied correctly.",
  },

  {
    title:
      "Cross-Domain Authentication",

    problem:
      "Users entering through the Drive subdomain needed to authenticate on the main domain and return safely.",

    solution:
      "The sign-in flow was updated to allow a controlled Drive return destination while rejecting unsafe redirect values.",
  },

  {
    title:
      "Role-Based Drive Access",

    problem:
      "Authenticated users needed different outcomes according to their assigned role.",

    solution:
      "Server-side profile checks now permit only admin and partner roles while other users return to the main site.",
  },

  {
    title:
      "Production Error Monitoring",

    problem:
      "Application failures required reliable reporting without exposing temporary testing routes permanently.",

    solution:
      "Sentry was integrated, tested in production, connected to deployment monitoring, and the temporary validation routes were removed.",
  },

  {
    title:
      "Database & Storage Backups",

    problem:
      "The current Supabase configuration did not provide the required managed-backup workflow.",

    solution:
      "Documented database and Storage backup procedures were created using the Supabase CLI and an isolated Docker-based dump process.",
  },

  {
    title:
      "Production Code Quality",

    problem:
      "The final readiness audit identified navigation and image-optimisation warnings.",

    solution:
      "Navigation was moved to the Next.js router, image handling was corrected, and the project reached zero lint errors and warnings.",
  },
];

const outcomes = [
  "Production deployment at meetshawon.com",
  "Dedicated Drive gateway at drive.meetshawon.com",
  "Authentication, profiles, and account security",
  "Role-based administration and moderation",
  "Full blog and community functionality",
  "Contact protection and custom-domain email",
  "Production exception and uptime monitoring",
  "Documented database and Storage backups",
  "Automated repository security controls",
  "Clean production build and lint results",
];

const futureDevelopment = [
  "Add more documented cybersecurity projects and technical case studies",
  "Expand technical writing and practical project evidence",
  "Continue accessibility and performance reviews",
  "Strengthen monitoring and recovery procedures",
  "Review individual dependencies before major upgrades",
  "Continue improving security controls and operational documentation",
];

export default function ProfessionalPortfolioPage() {
  return (
    <main>
      {/* Project header */}

      <section className="px-6 pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition hover:text-green-400"
          >
            <ArrowLeft
              size={16}
              aria-hidden="true"
            />

            Back to Projects
          </Link>

          <div className="mt-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs font-medium text-green-300">
                Active
              </span>

              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Full-Stack Platform Case Study
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Professional Portfolio Platform
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-300">
              A production-deployed cybersecurity portfolio and community
              platform combining professional content, authentication,
              role-based access, blogging, moderation, monitoring, backups, and
              an operational private-cloud Drive gateway.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {technologies.map(
                (
                  technology,
                ) => (
                  <Badge
                    key={
                      technology
                    }
                  >
                    {
                      technology
                    }
                  </Badge>
                ),
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://meetshawon.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-medium text-black transition hover:bg-green-400"
              >
                View Live Platform

                <ExternalLink
                  size={17}
                  aria-hidden="true"
                />
              </a>

              <a
                href="https://github.com/shawon1024/meetshawon-portfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-medium text-white transition hover:border-green-400 hover:text-green-300"
              >
                View Source on GitHub

                <GitHubIcon
                  size={18}
                />
              </a>

              <a
                href="/documents/professional-portfolio-platform-documentation.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] px-5 py-3 font-medium text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-100"
              >
                View Technical Documentation

                <FileText
                  size={17}
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Project overview */}

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Project Overview
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                Purpose and objectives
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                What began as a personal portfolio developed into a broader
                production platform. It now demonstrates web development,
                secure authentication, application architecture,
                infrastructure integration, operational monitoring, and
                long-term technical maintenance.
              </p>
            </div>

            <div className="space-y-4">
              {objectives.map(
                (
                  objective,
                ) => (
                  <div
                    key={
                      objective
                    }
                    className="flex gap-3 rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5"
                  >
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 shrink-0 text-green-400"
                      aria-hidden="true"
                    />

                    <p className="leading-7 text-gray-300">
                      {
                        objective
                      }
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Platform features */}

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Platform Capabilities
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              More than a static portfolio
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              The application combines public professional content with
              authenticated community features, protected management tools, and
              operational infrastructure.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {platformFeatures.map(
              (
                feature,
              ) => {
                const Icon =
                  feature.icon;

                return (
                  <article
                    key={
                      feature.title
                    }
                    className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6 transition hover:-translate-y-1 hover:border-green-400/40"
                  >
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                      <Icon
                        size={22}
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {
                        feature.title
                      }
                    </h3>

                    <p className="mt-3 leading-7 text-gray-400">
                      {
                        feature.description
                      }
                    </p>
                  </article>
                );
              },
            )}
          </div>
        </Container>
      </section>

      {/* Architecture */}

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Architecture
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                From domain to application services
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                The platform separates domain management, hosting, application
                logic, backend services, and operational tooling into clear
                layers.
              </p>
            </div>

            <div className="space-y-4">
              {architecture.map(
                (
                  item,
                ) => (
                  <article
                    key={
                      item.step
                    }
                    className="flex gap-5 rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5"
                  >
                    <span className="text-lg font-semibold text-green-400">
                      {
                        item.step
                      }
                    </span>

                    <div>
                      <h3 className="font-semibold text-white">
                        {
                          item.title
                        }
                      </h3>

                      <p className="mt-2 leading-7 text-gray-400">
                        {
                          item.description
                        }
                      </p>
                    </div>
                  </article>
                ),
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Security */}

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Security Engineering
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Controls designed into the platform
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              Security is treated as part of application design, deployment,
              repository management, and ongoing operations rather than as a
              final visual feature.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {securityControls.map(
              (
                control,
              ) => (
                <article
                  key={
                    control.title
                  }
                  className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6"
                >
                  <div className="flex items-center gap-3">
                    <LockKeyhole
                      size={20}
                      className="text-green-300"
                      aria-hidden="true"
                    />

                    <h3 className="text-lg font-semibold text-white">
                      {
                        control.title
                      }
                    </h3>
                  </div>

                  <p className="mt-4 leading-7 text-gray-400">
                    {
                      control.description
                    }
                  </p>
                </article>
              ),
            )}
          </div>
        </Container>
      </section>

      {/* Monitoring */}

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Operations
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Monitoring and maintenance
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              Production readiness includes visibility into application errors,
              uptime, deployments, backend services, dependencies, and recovery
              procedures.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {monitoringTools.map(
              (
                tool,
              ) => {
                const Icon =
                  tool.icon;

                return (
                  <article
                    key={
                      tool.title
                    }
                    className="rounded-2xl border border-white/10 bg-black/10 p-6"
                  >
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                      <Icon
                        size={22}
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {
                        tool.title
                      }
                    </h3>

                    <p className="mt-3 leading-7 text-gray-400">
                      {
                        tool.description
                      }
                    </p>
                  </article>
                );
              },
            )}
          </div>
        </Container>
      </section>

      {/* Challenges */}

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Problem Solving
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Challenges and solutions
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              Several production issues required investigation across routing,
              authentication, deployment, monitoring, backup, and code quality.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {challenges.map(
              (
                challenge,
              ) => (
                <article
                  key={
                    challenge.title
                  }
                  className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {
                      challenge.title
                    }
                  </h3>

                  <div className="mt-5">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-300">
                      Challenge
                    </p>

                    <p className="mt-2 leading-7 text-gray-400">
                      {
                        challenge.problem
                      }
                    </p>
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-5">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-300">
                      Solution
                    </p>

                    <p className="mt-2 leading-7 text-gray-300">
                      {
                        challenge.solution
                      }
                    </p>
                  </div>
                </article>
              ),
            )}
          </div>
        </Container>
      </section>

      {/* Outcomes */}

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Current Outcome
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                A live, operational platform
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                The result is a deployed platform that supports professional
                presentation, authenticated interaction, protected management,
                operational monitoring, and continued development.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {outcomes.map(
                (
                  outcome,
                ) => (
                  <div
                    key={
                      outcome
                    }
                    className="flex gap-3 rounded-xl border border-white/10 bg-black/10 p-4"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-green-400"
                      aria-hidden="true"
                    />

                    <p className="text-sm leading-6 text-gray-300">
                      {
                        outcome
                      }
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Public documentation */}

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="overflow-hidden rounded-3xl border border-cyan-400/15 bg-cyan-400/[0.04]">
            <div className="grid gap-8 p-8 md:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
              <div className="max-w-3xl">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <FileText
                    size={24}
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                  Public Technical Documentation
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white">
                  Explore the platform in greater technical depth
                </h2>

                <p className="mt-5 leading-7 text-gray-300">
                  The public documentation provides a structured overview of
                  the project objectives, platform capabilities, architecture,
                  technology decisions, identity and access controls,
                  publishing workflows, security engineering, deployment,
                  monitoring, testing, lessons learned, and future roadmap.
                </p>

                <p className="mt-4 text-sm leading-6 text-gray-500">
                  Sensitive credentials, private infrastructure details,
                  internal paths, and operational secrets are intentionally
                  excluded from the public edition.
                </p>
              </div>

              <div className="lg:text-right">
                <a
                  href="/documents/Professional-Portfolio-Platform-Documentation.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-[#06211d] transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                >
                  Read Documentation

                  <ExternalLink
                    size={17}
                    aria-hidden="true"
                  />
                </a>

                <p className="mt-3 text-xs text-gray-500">
                  PDF · 20 pages · Public edition
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Future development */}

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-8 md:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                  Future Development
                </p>

                <h2 className="mt-4 text-3xl font-bold text-white">
                  Continuing improvements
                </h2>

                <p className="mt-5 leading-7 text-gray-400">
                  The platform is active rather than permanently finished. New
                  content, project evidence, technical writing, and
                  infrastructure integrations will continue to be added.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {futureDevelopment.map(
                  (
                    item,
                  ) => (
                    <div
                      key={
                        item
                      }
                      className="rounded-xl border border-white/10 bg-black/10 p-4 text-gray-300"
                    >
                      {
                        item
                      }
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400"
              >
                View All Projects

                <ArrowLeft
                  className="rotate-180"
                  size={18}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}