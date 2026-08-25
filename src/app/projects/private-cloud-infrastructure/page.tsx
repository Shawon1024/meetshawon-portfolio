import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  BookOpenCheck,
  CheckCircle2,
  Cloud,
  Database,
  Gauge,
  HardDrive,
  LockKeyhole,
  Network,
  RefreshCcw,
  Server,
  ShieldCheck,
  TriangleAlert,
  Wrench,
} from "lucide-react";

import Container from "../../components/Container";
import Badge from "../../components/ui/Badge";

export const metadata: Metadata = {
  title: "Self-Hosted Private Cloud Infrastructure",
  description:
    "A completed NAS and private-cloud case study covering hardware selection, TrueNAS SCALE, mirrored ZFS storage, secure user access, automated provisioning, testing, and lessons learned.",

  alternates: {
    canonical:
      "/projects/private-cloud-infrastructure",
  },

  openGraph: {
    title:
      "Self-Hosted Private Cloud Infrastructure",

    description:
      "Explore the full journey from planning and hardware challenges to a tested, operational NAS and private-cloud platform.",

    url:
      "/projects/private-cloud-infrastructure",

    type:
      "article",

    images: [
      {
        url:
          "/projects/private-cloud-infrastructure/build-ready.png",

        width:
          1672,

        height:
          941,

        alt:
          "NAS and private-cloud project case study",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Self-Hosted Private Cloud Infrastructure",

    description:
      "A completed NAS and private-cloud project covering storage, secure access, automation, testing, and operational learning.",

    images: [
      "/projects/private-cloud-infrastructure/build-ready.png",
    ],
  },
};

const technologies = [
  "TrueNAS SCALE",
  "ZFS",
  "Next.js",
  "Supabase",
  "Cloudflare",
  "HTTPS",
  "Linux",
];

const projectFacts = [
  {
    label:
      "Status",

    value:
      "Operational",
  },

  {
    label:
      "Usable storage",

    value:
      "Approximately 1.76 TiB",
  },

  {
    label:
      "Resilience",

    value:
      "Two-drive ZFS mirror",
  },

  {
    label:
      "Access model",

    value:
      "Authorised users only",
  },
];

const objectives = [
  "Create a private file-storage service with a familiar web experience",
  "Provide separate authorised accounts and configurable storage quotas",
  "Use mirrored storage to tolerate a single data-drive failure",
  "Enable encrypted remote access without publishing the NAS administration interface",
  "Automate user-storage provisioning and document the complete build",
];

const hardware = [
  {
    icon:
      Server,

    label:
      "Dedicated NAS system",

    title:
      "HP EliteDesk 800 G3 SFF",

    details: [
      "Intel Core i5-7500 processor",
      "16 GB DDR4-2666 memory (4 × 4 GB)",
      "Dedicated storage and remote-access role",
      "Selected after physical compatibility checks",
    ],
  },

  {
    icon:
      HardDrive,

    label:
      "Primary data storage",

    title:
      "Two-drive ZFS mirror",

    details: [
      "2 × 2 TB Seagate Exos SATA HDDs",
      "Approximately 1.76 TiB usable capacity",
      "Single-drive fault tolerance",
      "Health checks and scheduled maintenance",
    ],
  },

  {
    icon:
      Database,

    label:
      "Separated workloads",

    title:
      "Dedicated solid-state storage",

    details: [
      "128 GB NVMe SSD for TrueNAS boot",
      "Separate 128 GB SATA SSD for applications",
      "User data isolated from system workloads",
      "System and application I/O kept off the data mirror",
    ],
  },
];

const architecture = [
  {
    icon:
      Cloud,

    title:
      "Portfolio Drive Gateway",

    description:
      "The public web application provides sign-in, account checks, and the user-facing Drive experience without exposing the TrueNAS interface.",
  },

  {
    icon:
      LockKeyhole,

    title:
      "Authorisation Layer",

    description:
      "Role and account checks restrict the service to approved users before any storage operation is permitted.",
  },

  {
    icon:
      Network,

    title:
      "Provisioning Workflow",

    description:
      "A controlled background workflow processes approved requests and provisions isolated user storage without manual service reloads.",
  },

  {
    icon:
      Server,

    title:
      "TrueNAS SCALE",

    description:
      "TrueNAS manages the storage pools, datasets, permissions, applications, monitoring, and maintenance tasks.",
  },

  {
    icon:
      Database,

    title:
      "Mirrored User Storage",

    description:
      "ZFS datasets provide separated storage areas, capacity controls, and a resilient two-drive mirror for user data.",
  },
];

const stages = [
  {
    stage:
      "01",

    title:
      "Idea & Requirements",

    description:
      "Defined the need for private storage, remote use, individual accounts, quotas, resilience, and portfolio integration.",
  },

  {
    stage:
      "02",

    title:
      "Research & Hardware Selection",

    description:
      "Compared systems, drive technologies, physical bays, SATA connections, power availability, cooling, and expansion limits.",
  },

  {
    stage:
      "03",

    title:
      "Compatibility Correction",

    description:
      "Replaced the original computer after discovering that its internal layout could not reliably support the planned storage design.",
  },

  {
    stage:
      "04",

    title:
      "Assembly & TrueNAS Deployment",

    description:
      "Installed the selected components, deployed TrueNAS SCALE, verified every drive, and completed the initial system configuration.",
  },

  {
    stage:
      "05",

    title:
      "Storage & Access Configuration",

    description:
      "Created the ZFS mirror, datasets, permissions, quotas, application storage, authenticated access, and provisioning workflow.",
  },

  {
    stage:
      "06",

    title:
      "Testing & Operation",

    description:
      "Validated storage health, user separation, provisioning, file operations, remote access, backup tasks, and monitoring before launch.",
  },
];

const securityControls = [
  {
    icon:
      LockKeyhole,

    title:
      "Encrypted access",

    description:
      "External sessions use HTTPS so credentials and file transfers are encrypted in transit.",
  },

  {
    icon:
      ShieldCheck,

    title:
      "Separated administration",

    description:
      "The user-facing service remains separate from the NAS management interface and internal configuration.",
  },

  {
    icon:
      Database,

    title:
      "Isolated user storage",

    description:
      "Individual datasets, permissions, and quotas restrict users to their assigned storage areas.",
  },

  {
    icon:
      Network,

    title:
      "Controlled provisioning",

    description:
      "Approved requests are processed through a restricted workflow rather than granting direct administrative access.",
  },

  {
    icon:
      RefreshCcw,

    title:
      "Recovery planning",

    description:
      "Replication and recovery tasks support resilience, while an independent backup remains a separate requirement.",
  },

  {
    icon:
      BookOpenCheck,

    title:
      "Sanitised documentation",

    description:
      "Public documentation explains the design without exposing addresses, credentials, identifiers, or private paths.",
  },
];

const results = [
  "Operational TrueNAS system with healthy storage pools",
  "Two-drive ZFS mirror with no reported disk errors during final validation",
  "Authenticated, role-protected access for approved users",
  "Automated creation of isolated user storage and quotas",
  "Successful remote file access through the portfolio Drive experience",
  "Backup tasks, resource monitoring, and storage-health visibility",
];

const lessons = [
  {
    title:
      "Specifications do not prove compatibility",

    description:
      "Processor and memory specifications looked suitable on the first system, but drive bays, clearance, cabling, power, and airflow determined whether it could actually become a reliable NAS.",
  },

  {
    title:
      "Redundancy and backup solve different problems",

    description:
      "A mirror improves availability after one drive fails. It does not protect against deletion, corruption, theft, or every system-level failure, so independent backups are still necessary.",
  },

  {
    title:
      "Access design must start with security",

    description:
      "Authentication, authorisation, encryption, user isolation, and administrative separation were treated as architecture requirements rather than additions after deployment.",
  },

  {
    title:
      "Automation needs repeatable testing",

    description:
      "Provisioning was tested across the complete workflow so new approved users could receive storage without manual reloads or inconsistent permissions.",
  },
];

const improvements = [
  {
    icon:
      RefreshCcw,

    title:
      "Independent backups",

    description:
      "Strengthen off-system backups and test restoration regularly rather than assuming stored copies are recoverable.",
  },

  {
    icon:
      Bell,

    title:
      "Automated alerts",

    description:
      "Expand notifications for disk health, storage capacity, failed jobs, service availability, and unusual conditions.",
  },

  {
    icon:
      Gauge,

    title:
      "Operational monitoring",

    description:
      "Develop clearer long-term visibility into performance, capacity growth, temperatures, and service health.",
  },

  {
    icon:
      ShieldCheck,

    title:
      "Periodic security reviews",

    description:
      "Review accounts, permissions, updates, recovery procedures, and external exposure on a defined schedule.",
  },

  {
    icon:
      Wrench,

    title:
      "Power-loss protection",

    description:
      "Add UPS integration and verify graceful shutdown and restart behaviour during power interruption tests.",
  },

  {
    icon:
      BookOpenCheck,

    title:
      "Recovery documentation",

    description:
      "Keep build, maintenance, restoration, and incident procedures accurate as the platform evolves.",
  },
];

export default function PrivateCloudProjectPage() {
  return (
    <main>
      <section className="px-6 pb-14 pt-16 md:pb-20 md:pt-24">
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
                Completed &amp; Live
              </span>

              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Infrastructure Case Study
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Self-Hosted Private Cloud Infrastructure
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-300">
              A dedicated NAS and private-cloud platform with mirrored storage,
              controlled user access, automated provisioning, secure remote
              connectivity, and a portfolio-integrated Drive experience.
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

            <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {projectFacts.map(
                (
                  fact,
                ) => (
                  <div
                    key={
                      fact.label
                    }
                    className="bg-[var(--background)]/95 px-5 py-4"
                  >
                    <dt className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
                      {
                        fact.label
                      }
                    </dt>

                    <dd className="mt-2 text-sm font-semibold text-white">
                      {
                        fact.value
                      }
                    </dd>
                  </div>
                ),
              )}
            </dl>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-2 shadow-2xl shadow-black/20">
          <Image
            src="/projects/private-cloud-infrastructure/build-ready.png"
            alt="The completed NAS and private-cloud hardware project"
            width={1672}
            height={941}
            priority
            sizes="(min-width: 1200px) 1152px, 100vw"
            className="h-auto w-full rounded-2xl object-cover"
          />
        </div>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="rounded-3xl border border-green-400/15 bg-green-400/[0.05] p-7 md:p-9">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 text-green-300">
                  <CheckCircle2
                    size={21}
                    aria-hidden="true"
                  />

                  <p className="text-sm font-medium uppercase tracking-[0.22em]">
                    Final Outcome
                  </p>
                </div>

                <h2 className="mt-4 text-2xl font-bold text-white md:text-3xl">
                  Tested, operational, and serving authorised users
                </h2>

                <p className="mt-4 leading-7 text-gray-300">
                  The physical build, mirrored storage, user access,
                  provisioning workflow, remote connectivity, and operational
                  checks have been completed. The service is live and working
                  against the original project requirements.
                </p>
              </div>

              <span className="inline-flex shrink-0 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-medium text-green-300">
                Operational
              </span>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Project Overview
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                From a storage idea to a live service
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                The project began with a simple goal: create a private,
                Google Drive-like environment under my control. It became a
                complete infrastructure exercise covering hardware, ZFS,
                identity, automation, networking, security, monitoring, and
                recovery planning.
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

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Hardware Design
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                Purpose-selected storage hardware
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-gray-400">
                The completed physical build uses a compact business-class
                system configured specifically for storage. The operating
                system, applications, and user data are separated, while two
                dedicated data drives provide mirrored capacity and
                single-drive fault tolerance.
              </p>

              <div className="mt-8 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04] p-5">
                <p className="font-semibold text-white">
                  Physical compatibility was treated as a design requirement
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Drive bays, mounting points, SATA connectivity, power,
                  clearance, cooling, and serviceability were verified before
                  the final platform was commissioned.
                </p>
              </div>
            </div>

            <figure className="overflow-hidden rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-2 shadow-xl shadow-black/20">
              <Image
                src="/projects/private-cloud-infrastructure/hardware.jpeg"
                alt="Open HP EliteDesk NAS chassis showing the internal components and two installed data drives"
                width={480}
                height={607}
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="aspect-[4/5] w-full rounded-2xl object-cover object-center"
              />

              <figcaption className="px-4 py-4 text-sm leading-6 text-gray-400">
                The completed internal hardware layout, with two dedicated data
                drives installed for the mirrored ZFS storage pool. Identifying
                labels have been obscured for public presentation.
              </figcaption>
            </figure>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {hardware.map(
              (
                item,
              ) => {
                const Icon =
                  item.icon;

                return (
                  <article
                    key={
                      item.title
                    }
                    className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6"
                  >
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                      <Icon
                        size={22}
                        aria-hidden="true"
                      />
                    </div>

                    <p className="mt-5 text-sm text-gray-400">
                      {
                        item.label
                      }
                    </p>

                    <h3 className="mt-2 text-xl font-semibold text-white">
                      {
                        item.title
                      }
                    </h3>

                    <ul className="mt-5 space-y-3 text-gray-400">
                      {item.details.map(
                        (
                          detail,
                        ) => (
                          <li
                            key={
                              detail
                            }
                            className="flex gap-2"
                          >
                            <span
                              className="text-green-400"
                              aria-hidden="true"
                            >
                              •
                            </span>

                            <span>
                              {
                                detail
                              }
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  </article>
                );
              },
            )}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="grid gap-8 rounded-3xl border border-amber-400/15 bg-amber-400/[0.04] p-7 md:grid-cols-[auto_1fr] md:p-9">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
              <TriangleAlert
                size={24}
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-amber-300">
                The Costliest Mistake
              </p>

              <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
                Good specifications did not mean suitable hardware
              </h2>

              <p className="mt-4 max-w-4xl leading-7 text-gray-300">
                My first computer looked capable by processor, memory, and
                advertised storage specifications. A physical inspection
                revealed limitations in drive bays, clearance, mounting,
                power, SATA connectivity, airflow, and expansion. Replacing it
                added time and cost, but prevented an unreliable build and
                became one of the project&apos;s most valuable lessons.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              System Architecture
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Public experience, private infrastructure
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              The public application handles the user experience while the NAS
              and administration services remain separated behind controlled
              access and provisioning layers.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {architecture.map(
              (
                item,
              ) => {
                const Icon =
                  item.icon;

                return (
                  <article
                    key={
                      item.title
                    }
                    className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6"
                  >
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                      <Icon
                        size={22}
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {
                        item.title
                      }
                    </h3>

                    <p className="mt-3 leading-7 text-gray-400">
                      {
                        item.description
                      }
                    </p>
                  </article>
                );
              },
            )}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Implementation Journey
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                From planning to operation
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                Each stage was completed and validated before the system was
                treated as operational.
              </p>
            </div>

            <div className="space-y-4">
              {stages.map(
                (
                  item,
                ) => (
                  <article
                    key={
                      item.stage
                    }
                    className="flex gap-5 rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5"
                  >
                    <span className="text-lg font-semibold text-green-400">
                      {
                        item.stage
                      }
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-semibold text-white">
                          {
                            item.title
                          }
                        </h3>

                        <span className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs font-medium text-green-300">
                          Completed
                        </span>
                      </div>

                      <p className="mt-3 leading-7 text-gray-400">
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

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Security Approach
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Reducing exposure by design
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              Public documentation remains intentionally high level. Internal
              addresses, identities, paths, credentials, and configuration
              details are excluded.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {securityControls.map(
              (
                control,
              ) => {
                const Icon =
                  control.icon;

                return (
                  <article
                    key={
                      control.title
                    }
                    className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6"
                  >
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                      <Icon
                        size={22}
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {
                        control.title
                      }
                    </h3>

                    <p className="mt-3 leading-7 text-gray-400">
                      {
                        control.description
                      }
                    </p>
                  </article>
                );
              },
            )}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Operational Evidence
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                Healthy, monitored, and in use
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                The sanitised dashboard records the final operating state while
                removing administrative identity, software-version, hostname,
                and network-address information.
              </p>

              <ul className="mt-7 space-y-3">
                {results.map(
                  (
                    result,
                  ) => (
                    <li
                      key={
                        result
                      }
                      className="flex gap-3 text-gray-300"
                    >
                      <CheckCircle2
                        size={19}
                        className="mt-0.5 shrink-0 text-green-400"
                        aria-hidden="true"
                      />

                      <span>
                        {
                          result
                        }
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-2">
              <Image
                src="/projects/private-cloud-infrastructure/dashboard.jpg"
                alt="Sanitised TrueNAS dashboard showing healthy storage and system monitoring"
                width={2048}
                height={791}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="h-auto w-full rounded-xl"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Learning Outcomes
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              The project was more valuable because it was not straightforward
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {lessons.map(
              (
                lesson,
              ) => (
                <article
                  key={
                    lesson.title
                  }
                  className="rounded-2xl border border-white/10 bg-black/10 p-6"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {
                      lesson.title
                    }
                  </h3>

                  <p className="mt-4 leading-7 text-gray-400">
                    {
                      lesson.description
                    }
                  </p>
                </article>
              ),
            )}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Continuous Improvement
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Live does not mean finished forever
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              The platform is operational, but reliability and security require
              continued testing, maintenance, and documentation.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {improvements.map(
              (
                item,
              ) => {
                const Icon =
                  item.icon;

                return (
                  <article
                    key={
                      item.title
                    }
                    className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6"
                  >
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                      <Icon
                        size={22}
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {
                        item.title
                      }
                    </h3>

                    <p className="mt-3 leading-7 text-gray-400">
                      {
                        item.description
                      }
                    </p>
                  </article>
                );
              },
            )}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-8 text-center md:p-12">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
              <CheckCircle2
                size={23}
                aria-hidden="true"
              />
            </div>

            <p className="mt-5 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Project Complete
            </p>

            <h2 className="mt-4 text-3xl font-bold text-white">
              A working service and a reusable home-lab platform
            </h2>

            <p className="mx-auto mt-5 max-w-3xl leading-7 text-gray-400">
              The most important outcome is not simply the storage capacity. It
              is the practical experience of researching, correcting mistakes,
              integrating systems, validating security boundaries, automating
              operations, and moving an infrastructure idea into reliable use.
              Future work will build on this foundation through stronger
              recovery testing, monitoring, power protection, and additional
              controlled self-hosted services.
            </p>

            <Link
              href="/projects"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400"
            >
              View All Projects

              <ArrowLeft
                className="rotate-180"
                size={18}
                aria-hidden="true"
              />
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}