import type {
  Metadata,
} from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Cloud,
  Database,
  HardDrive,
  LockKeyhole,
  Network,
  PackageCheck,
  Server,
} from "lucide-react";

import Container from "../../components/Container";
import Badge from "../../components/ui/Badge";

export const metadata: Metadata = {
  title:
    "Self-Hosted Private Cloud Infrastructure",

  description:
    "An in-progress private-cloud and NAS project using dedicated HP hardware, mirrored Seagate Exos storage, TrueNAS SCALE, Nextcloud, secure remote access, and drive.meetshawon.com.",

  alternates: {
    canonical:
      "/projects/private-cloud-infrastructure",
  },

  openGraph: {
    title:
      "Self-Hosted Private Cloud Infrastructure",
    description:
      "Explore the planning, hardware, architecture, security decisions, and implementation roadmap for Shawon's private-cloud and NAS project.",
    url:
      "/projects/private-cloud-infrastructure",
    type:
      "article",
  },
};

const technologies = [
  "TrueNAS SCALE",
  "ZFS",
  "Nextcloud",
  "Cloudflare",
  "HTTPS",
  "Seagate Exos",
];

const objectives = [
  "Create a private-cloud service similar to Google Drive or OneDrive",
  "Provide separate user accounts and configurable storage quotas",
  "Use mirrored storage to maintain service after a single-drive failure",
  "Enable secure remote access through drive.meetshawon.com",
  "Document the planning, build, configuration, testing, and lessons learned",
];

const architecture = [
  {
    icon:
      Cloud,

    title:
      "Drive Web Gateway",

    status:
      "Live",

    description:
      "drive.meetshawon.com currently provides the web, authentication, and role-authorisation gateway while live NAS integration remains pending.",
  },
  {
    icon:
      Network,

    title:
      "Secure Remote Connection",

    status:
      "Planned",

    description:
      "A secure connection will link the public Drive gateway to the private-cloud service without unnecessary direct exposure.",
  },
  {
    icon:
      Server,

    title:
      "TrueNAS SCALE",

    status:
      "Planned",

    description:
      "TrueNAS SCALE will provide the operating platform, storage management, datasets, permissions, applications, and monitoring.",
  },
  {
    icon:
      Database,

    title:
      "Mirrored Storage",

    status:
      "Planned",

    description:
      "Two 2 TB Seagate Exos hard drives will form a mirror with approximately 2 TB of usable storage and single-drive fault tolerance.",
  },
  {
    icon:
      LockKeyhole,

    title:
      "Private-Cloud Application",

    status:
      "Planned",

    description:
      "Nextcloud is planned to provide browser-based file access, individual accounts, storage quotas, and private-cloud functionality.",
  },
];

const implementationStages = [
  {
    stage:
      "01",

    title:
      "Architecture & Hardware Planning",

    status:
      "Completed",

    description:
      "Defined the storage goals, remote-access model, user requirements, software approach, and suitable small-form-factor hardware.",
  },
  {
    stage:
      "02",

    title:
      "Parts Acquisition",

    status:
      "In Progress",

    description:
      "The project is currently awaiting the remaining hardware and components required for the physical build.",
  },
  {
    stage:
      "03",

    title:
      "Physical Assembly",

    status:
      "Planned",

    description:
      "Install the memory, boot SSD, application SSD, mirrored hard drives, data connections, and power connections.",
  },
  {
    stage:
      "04",

    title:
      "TrueNAS Deployment",

    status:
      "Planned",

    description:
      "Install TrueNAS SCALE on the dedicated operating-system SSD and complete the initial network and system configuration.",
  },
  {
    stage:
      "05",

    title:
      "Storage & Application Setup",

    status:
      "Planned",

    description:
      "Create the mirrored storage pool, datasets, permissions, snapshots, application storage, and private-cloud service.",
  },
  {
    stage:
      "06",

    title:
      "Secure Remote Integration",

    status:
      "Planned",

    description:
      "Connect the private-cloud service to the existing Drive gateway, test role-based access, and verify secure external use.",
  },
];

const securityDesign = [
  {
    title:
      "Encrypted Remote Access",

    description:
      "All external access will use HTTPS or another encrypted connection to protect credentials and file transfers.",
  },
  {
    title:
      "Individual User Accounts",

    description:
      "Each authorised user will receive an individual identity rather than sharing one administrator account.",
  },
  {
    title:
      "Storage Separation & Quotas",

    description:
      "Datasets, folders, permissions, and quotas will be used to separate user storage and control capacity usage.",
  },
  {
    title:
      "Reduced Public Exposure",

    description:
      "The design will avoid exposing unnecessary management interfaces or storage services directly to the internet.",
  },
  {
    title:
      "Snapshots & Recovery",

    description:
      "Snapshots will provide recovery points for accidental deletion or unwanted changes, while separate backups will still be required.",
  },
  {
    title:
      "Role-Protected Gateway",

    description:
      "The existing Drive gateway permits only admin and partner roles before users can proceed toward the private-cloud service.",
  },
];

const planningLessons = [
  {
    title:
      "Specifications are not enough",

    description:
      "A system may appear suitable by processor, memory, and storage specifications while still lacking the required physical bays, clearance, cabling, or power connections.",
  },
  {
    title:
      "Storage design requires trade-offs",

    description:
      "Mirroring improves availability after a drive failure but reduces usable capacity and does not replace a separate backup.",
  },
  {
    title:
      "Separate workloads deliberately",

    description:
      "Dedicated storage for the operating system, applications, and user data simplifies maintenance and reduces unnecessary competition between workloads.",
  },
  {
    title:
      "Remote access must be designed early",

    description:
      "DNS, authentication, encryption, routing, user roles, and attack-surface reduction must be considered before exposing a private service remotely.",
  },
];

const statusStyles: Record<
  string,
  string
> = {
  Live:
    "border-green-400/20 bg-green-400/10 text-green-300",

  Completed:
    "border-green-400/20 bg-green-400/10 text-green-300",

  "In Progress":
    "border-blue-400/20 bg-blue-400/10 text-blue-300",

  Planned:
    "border-amber-400/20 bg-amber-400/10 text-amber-300",
};

export default function PrivateCloudProjectPage() {
  return (
    <main>
      {/* Project header */}
      <section className="px-6 pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition hover:text-green-400"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>

          <div className="mt-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-300">
                In Progress
              </span>

              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Infrastructure Case Study
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Self-Hosted Private Cloud Infrastructure
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-300">
              Planning and building a dedicated NAS and private-cloud platform
              with mirrored storage, individual user access, secure remote
              connectivity, and integration with drive.meetshawon.com.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {technologies.map(
                (technology) => (
                  <Badge
                    key={technology}
                  >
                    {technology}
                  </Badge>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Current status */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="rounded-3xl border border-blue-400/15 bg-blue-400/[0.05] p-7 md:p-9">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 text-blue-300">
                  <Clock3 size={21} />

                  <p className="text-sm font-medium uppercase tracking-[0.22em]">
                    Current Position
                  </p>
                </div>

                <h2 className="mt-4 text-2xl font-bold text-white md:text-3xl">
                  Awaiting parts before the physical build
                </h2>

                <p className="mt-4 leading-7 text-gray-300">
                  The architecture and hardware plan are established. The next
                  milestone is to receive the remaining components, assemble
                  the system, and begin the TrueNAS deployment.
                </p>
              </div>

              <div className="shrink-0">
                <span className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-300">
                  Procurement stage
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Overview */}
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
                The project is intended to provide practical personal storage
                and controlled access for selected external users while
                developing hands-on knowledge of storage, networking, identity,
                security, and self-hosted infrastructure.
              </p>
            </div>

            <div className="space-y-4">
              {objectives.map(
                (objective) => (
                  <div
                    key={objective}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5"
                  >
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 shrink-0 text-green-400"
                    />

                    <p className="leading-7 text-gray-300">
                      {objective}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Hardware */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Hardware Design
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Selected system and storage
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              The design separates the operating system, application storage,
              mirrored user data, and a spare SSD reserved for future needs.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                <Server size={22} />
              </div>

              <p className="mt-5 text-sm text-gray-400">
                NAS computer
              </p>

              <h3 className="mt-2 text-xl font-semibold text-white">
                HP EliteDesk 800 G3 SFF
              </h3>

              <ul className="mt-5 space-y-3 text-gray-400">
                <li>7th-generation Intel Core i5</li>
                <li>16 GB DDR4 2666 MHz</li>
                <li>Small-form-factor business desktop</li>
                <li>Dedicated storage and remote-access role</li>
              </ul>
            </article>

            <article className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                <HardDrive size={22} />
              </div>

              <p className="mt-5 text-sm text-gray-400">
                Primary storage
              </p>

              <h3 className="mt-2 text-xl font-semibold text-white">
                2 × 2 TB Seagate Exos
              </h3>

              <ul className="mt-5 space-y-3 text-gray-400">
                <li>3.5-inch enterprise SATA drives</li>
                <li>Planned mirrored configuration</li>
                <li>Approximately 2 TB usable capacity</li>
                <li>Single-drive fault tolerance</li>
              </ul>
            </article>

            <article className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                <Database size={22} />
              </div>

              <p className="mt-5 text-sm text-gray-400">
                Solid-state storage
              </p>

              <h3 className="mt-2 text-xl font-semibold text-white">
                Dedicated SSD roles
              </h3>

              <ul className="mt-5 space-y-3 text-gray-400">
                <li>256 GB SSD for the operating system</li>
                <li>256 GB SSD for applications</li>
                <li>500 GB Samsung 870 EVO reserved</li>
                <li>Future expansion kept separate</li>
              </ul>
            </article>
          </div>
        </Container>
      </section>

      {/* Architecture */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Planned Architecture
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              How the system will fit together
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              Status labels distinguish the live web gateway from infrastructure
              components that remain planned.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {architecture.map(
              (item) => {
                const Icon =
                  item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                        <Icon size={22} />
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {item.title}
                    </h3>

                    <p className="mt-3 leading-7 text-gray-400">
                      {item.description}
                    </p>
                  </article>
                );
              },
            )}
          </div>
        </Container>
      </section>

      {/* Roadmap */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Implementation Roadmap
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                From planning to operation
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                The project is divided into verifiable stages so planned
                features are not presented as completed work.
              </p>
            </div>

            <div className="space-y-4">
              {implementationStages.map(
                (item) => (
                  <article
                    key={item.stage}
                    className="flex gap-5 rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5"
                  >
                    <span className="text-lg font-semibold text-green-400">
                      {item.stage}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-semibold text-white">
                          {item.title}
                        </h3>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[item.status]}`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <p className="mt-3 leading-7 text-gray-400">
                        {item.description}
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
              Security Design
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Controls planned before exposure
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              These controls form the intended design and will be validated
              individually during implementation and testing.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {securityDesign.map(
              (control) => (
                <article
                  key={control.title}
                  className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {control.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-400">
                    {control.description}
                  </p>
                </article>
              ),
            )}
          </div>
        </Container>
      </section>

      {/* Planning lessons */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Learning So Far
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Lessons from planning and hardware selection
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              The project has already produced practical lessons before the
              physical build begins.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {planningLessons.map(
              (lesson) => (
                <article
                  key={lesson.title}
                  className="rounded-2xl border border-white/10 bg-black/10 p-6"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {lesson.title}
                  </h3>

                  <p className="mt-4 leading-7 text-gray-400">
                    {lesson.description}
                  </p>
                </article>
              ),
            )}
          </div>
        </Container>
      </section>

      {/* Status */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-8 text-center md:p-12">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
              <PackageCheck size={23} />
            </div>

            <p className="mt-5 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Next Milestone
            </p>

            <h2 className="mt-4 text-3xl font-bold text-white">
              Receive the remaining parts and begin the build
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-400">
              This case study will be updated with real photographs,
              configuration details, storage tests, security validation, and
              operational results as each stage is completed.
            </p>

            <Link
              href="/projects"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400"
            >
              View All Projects
              <ArrowLeft
                className="rotate-180"
                size={18}
              />
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}