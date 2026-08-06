import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Cloud,
  Database,
  LockKeyhole,
  Network,
  Server,
} from "lucide-react";

import Container from "../../components/Container";
import Badge from "../../components/ui/Badge";

const technologies = [
  "TrueNAS SCALE",
  "ZFS",
  "Nextcloud",
  "Cloudflare",
  "HTTPS",
  "Reverse Proxy",
];

const objectives = [
  "Create a private cloud similar to Google Drive or OneDrive",
  "Provide separate user accounts and storage quotas",
  "Use mirrored storage for redundancy",
  "Enable secure remote access through a custom subdomain",
  "Document the system as a professional infrastructure project",
];

const architecture = [
  {
    icon: Cloud,
    title: "Cloudflare DNS",
    description:
      "Routes the drive subdomain and supports secure external access.",
  },
  {
    icon: Network,
    title: "Reverse Proxy",
    description:
      "Receives HTTPS traffic and forwards it to the Nextcloud service.",
  },
  {
    icon: Server,
    title: "TrueNAS SCALE",
    description:
      "Provides the operating platform, storage management, and application hosting.",
  },
  {
    icon: Database,
    title: "ZFS Mirror",
    description:
      "Uses two drives to provide approximately 2 TB of redundant usable storage.",
  },
  {
    icon: LockKeyhole,
    title: "Nextcloud",
    description:
      "Provides user accounts, file access, quotas, and private cloud functionality.",
  },
];

export default function PrivateCloudProjectPage() {
  return (
    <main>
      <section className="px-6 pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-green-400"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>

          <div className="mt-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs font-medium text-green-300">
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
              Designing a production-style private cloud using TrueNAS SCALE,
              ZFS, Nextcloud, Cloudflare DNS, HTTPS, and secure remote access.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {technologies.map((technology) => (
                <Badge key={technology}>
                  {technology}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

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
                The goal is to build a secure, practical, and scalable home
                cloud environment that demonstrates real-world knowledge of
                storage, networking, identity management, DNS, HTTPS, and
                self-hosted infrastructure.
              </p>
            </div>

            <div className="space-y-4">
              {objectives.map((objective) => (
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
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Architecture
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              How the system fits together
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              Each layer has a clear responsibility, from public DNS and secure
              traffic handling to storage, identity, and file access.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {architecture.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-400">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Infrastructure
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white">
                Hardware and storage design
                </h2>

                <p className="mt-5 leading-7 text-gray-400">
                The system uses compact business hardware and a mirrored ZFS storage
                layout to provide practical redundancy, snapshots, and reliable
                self-hosted storage.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <article className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
                <p className="text-sm text-gray-400">
                    Server
                </p>

                <h3 className="mt-2 text-xl font-semibold text-white">
                    Dell OptiPlex 7060 SFF
                </h3>

                <ul className="mt-5 space-y-3 text-gray-400">
                    <li>Intel Core i5-8500</li>
                    <li>16 GB DDR4 planned</li>
                    <li>256 GB NVMe boot drive</li>
                    <li>Compact low-power form factor</li>
                </ul>
                </article>

                <article className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
                <p className="text-sm text-gray-400">
                    Storage pool
                </p>

                <h3 className="mt-2 text-xl font-semibold text-white">
                    ZFS Mirror
                </h3>

                <ul className="mt-5 space-y-3 text-gray-400">
                    <li>2 TB 3.5-inch HDD</li>
                    <li>2 TB 2.5-inch HDD</li>
                    <li>Approximately 2 TB usable capacity</li>
                    <li>Single-drive fault tolerance</li>
                </ul>
                </article>
            </div>
            </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
            <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Security
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
                Security controls and design decisions
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
                The project is being designed as a small production-style environment,
                with controls intended to reduce exposure, protect data, and separate
                user access.
            </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
            {[
                {
                title: "HTTPS Encryption",
                description:
                    "All remote access will use HTTPS to protect credentials and data in transit.",
                },
                {
                title: "Individual User Accounts",
                description:
                    "Each user receives a separate account and can only access their own files.",
                },
                {
                title: "Storage Quotas",
                description:
                    "Per-user storage limits prevent one account from consuming all available capacity.",
                },
                {
                title: "Reduced Attack Surface",
                description:
                    "The preferred design avoids exposing unnecessary services directly to the public internet.",
                },
                {
                title: "Snapshots and Recovery",
                description:
                    "ZFS snapshots provide a recovery mechanism for accidental deletion and unwanted changes.",
                },
                {
                title: "DNS and Access Control",
                description:
                    "Cloudflare DNS and secure routing provide controlled access through a dedicated subdomain.",
                },
            ].map((control) => (
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
            ))}
            </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Identity & Access
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white">
                User accounts and quotas
                </h2>

                <p className="mt-5 leading-7 text-gray-400">
                The platform is intended to support multiple users while maintaining
                clear separation between personal storage areas.
                </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
                <div className="grid grid-cols-3 bg-[var(--surface)] px-5 py-4 text-sm font-medium text-gray-300">
                <span>User</span>
                <span>Quota</span>
                <span>Access</span>
                </div>

                <div className="divide-y divide-white/10">
                <div className="grid grid-cols-3 px-5 py-4 text-gray-400">
                    <span>Shawon</span>
                    <span>Flexible</span>
                    <span>Private files</span>
                </div>

                <div className="grid grid-cols-3 px-5 py-4 text-gray-400">
                    <span>Friend 1</span>
                    <span>100 GB</span>
                    <span>Private files</span>
                </div>

                <div className="grid grid-cols-3 px-5 py-4 text-gray-400">
                    <span>Friend 2</span>
                    <span>Custom</span>
                    <span>Private files</span>
                </div>
                </div>
            </div>
            </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
            <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Reflection
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
                Challenges and learning outcomes
            </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-black/10 p-6">
                <h3 className="text-xl font-semibold text-white">
                Key challenges
                </h3>

                <ul className="mt-5 space-y-3 leading-7 text-gray-400">
                <li>Designing remote access without unnecessary port exposure</li>
                <li>Balancing redundancy, capacity, and available hardware</li>
                <li>Planning user isolation and storage quotas</li>
                <li>Choosing a maintainable deployment architecture</li>
                <li>Documenting the system clearly for future expansion</li>
                </ul>
            </article>

            <article className="rounded-2xl border border-white/10 bg-black/10 p-6">
                <h3 className="text-xl font-semibold text-white">
                Skills developed
                </h3>

                <ul className="mt-5 space-y-3 leading-7 text-gray-400">
                <li>DNS and subdomain planning</li>
                <li>ZFS storage and redundancy concepts</li>
                <li>Identity and access management</li>
                <li>HTTPS and reverse-proxy architecture</li>
                <li>Infrastructure documentation and threat awareness</li>
                </ul>
            </article>
            </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
            <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-8 text-center md:p-12">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Project Status
            </p>

            <h2 className="mt-4 text-3xl font-bold text-white">
                Currently in development
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-400">
                This case study will be updated as the hardware, TrueNAS environment,
                Nextcloud deployment, secure remote access, and monitoring setup are
                completed.
            </p>

            <Link
                href="/projects"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400"
            >
                View All Projects
                <ArrowLeft className="rotate-180" size={18} />
            </Link>
            </div>
        </Container>
      </section>
    </main>
  );
}