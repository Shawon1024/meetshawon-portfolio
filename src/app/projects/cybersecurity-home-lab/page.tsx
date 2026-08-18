import type {
  Metadata,
} from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  FlaskConical,
  Laptop,
  Network,
  Search,
  Server,
  ShieldCheck,
  Terminal,
} from "lucide-react";

import Badge from "../../components/ui/Badge";
import Container from "../../components/Container";

export const metadata: Metadata = {
  title:
    "Cybersecurity Home Lab",

  description:
    "An in-progress Windows 11 Pro cybersecurity lab using dedicated hardware, virtualisation research, Kali Linux planning, isolated networks, and authorised security exercises.",

  alternates: {
    canonical:
      "/projects/cybersecurity-home-lab",
  },

  openGraph: {
    title:
      "Cybersecurity Home Lab",
    description:
      "Explore the hardware, research, planned architecture, safety boundaries, and learning roadmap behind Shawon's cybersecurity home lab.",
    url:
      "/projects/cybersecurity-home-lab",
    type:
      "article",
  },
};

const technologies = [
  "Windows 11 Pro",
  "Virtual Machines",
  "Kali Linux",
  "Linux",
  "Networking",
  "Nmap",
  "Wireshark",
];

const objectives = [
  "Create an isolated environment for authorised ethical-hacking practice",
  "Develop practical Linux and command-line administration skills",
  "Learn network discovery, service identification, and packet analysis",
  "Practise vulnerability assessment against purpose-built targets",
  "Document objectives, procedures, evidence, findings, and lessons",
];

const virtualisationOptions = [
  {
    title:
      "Hyper-V",

    description:
      "Included with Windows 11 Pro and capable of creating isolated virtual machines, virtual switches, checkpoints, and controlled lab networks.",

    consideration:
      "Strong Windows integration and a suitable option for structured network isolation.",
  },
  {
    title:
      "VMware Workstation",

    description:
      "A mature desktop virtualisation platform commonly used for technical labs, snapshots, cloned machines, and flexible virtual networking.",

    consideration:
      "Well suited to multi-machine lab environments, subject to final compatibility and licensing review.",
  },
  {
    title:
      "VirtualBox",

    description:
      "A widely used virtualisation platform supporting snapshots, multiple operating systems, and configurable virtual-network modes.",

    consideration:
      "Accessible for initial learning, although the final platform should be selected after practical comparison.",
  },
];

const labArchitecture = [
  {
    icon:
      Laptop,

    title:
      "Windows 11 Pro Host",

    status:
      "Operational",

    description:
      "The dedicated workstation currently runs Windows 11 Pro and provides the processing, memory, and storage resources for the future lab.",
  },
  {
    icon:
      Server,

    title:
      "Virtualisation Platform",

    status:
      "Researching",

    description:
      "Hyper-V, VMware Workstation, and VirtualBox are being compared before selecting the platform for the lab.",
  },
  {
    icon:
      Terminal,

    title:
      "Kali Linux Machine",

    status:
      "Planned",

    description:
      "A Kali Linux virtual machine will provide the primary environment for authorised security-tool practice.",
  },
  {
    icon:
      FlaskConical,

    title:
      "Vulnerable Targets",

    status:
      "Planned",

    description:
      "Purpose-built vulnerable machines and legal training platforms will provide controlled targets for exercises.",
  },
  {
    icon:
      Network,

    title:
      "Isolated Lab Network",

    status:
      "Planned",

    description:
      "Virtual-network isolation will limit lab traffic and reduce exposure to household devices and public systems.",
  },
  {
    icon:
      FileText,

    title:
      "Technical Documentation",

    status:
      "Planned",

    description:
      "Each exercise will record scope, objectives, commands, evidence, findings, mitigations, and reflection.",
  },
];

const implementationStages = [
  {
    stage:
      "01",

    title:
      "Dedicated Hardware",

    status:
      "Completed",

    description:
      "Prepared a dedicated Lenovo workstation with upgraded memory and storage for cybersecurity learning.",
  },
  {
    stage:
      "02",

    title:
      "Platform Research",

    status:
      "In Progress",

    description:
      "Compare virtualisation platforms, network modes, resource allocation, snapshots, and compatibility.",
  },
  {
    stage:
      "03",

    title:
      "Virtualisation Setup",

    status:
      "Planned",

    description:
      "Install or enable the selected platform and configure secure defaults, storage locations, and virtual networking.",
  },
  {
    stage:
      "04",

    title:
      "Kali Linux Deployment",

    status:
      "Planned",

    description:
      "Create, update, snapshot, and test the Kali Linux security-learning machine.",
  },
  {
    stage:
      "05",

    title:
      "Target Environment",

    status:
      "Planned",

    description:
      "Add purpose-built vulnerable machines and keep them isolated from public and personal systems.",
  },
  {
    stage:
      "06",

    title:
      "Structured Exercises",

    status:
      "Planned",

    description:
      "Begin documented exercises in Linux, networking, discovery, packet analysis, and vulnerability assessment.",
  },
];

const plannedExercises = [
  {
    icon:
      Search,

    title:
      "Network Discovery",

    description:
      "Identify authorised lab hosts, open ports, and available services while documenting scope and results.",
  },
  {
    icon:
      Network,

    title:
      "Packet Analysis",

    description:
      "Capture and inspect lab traffic to understand protocols, conversations, filtering, and unusual behaviour.",
  },
  {
    icon:
      Terminal,

    title:
      "Linux Administration",

    description:
      "Practise users, groups, permissions, services, logs, package management, filesystems, and command-line workflows.",
  },
  {
    icon:
      ShieldCheck,

    title:
      "Vulnerability Assessment",

    description:
      "Identify, validate, prioritise, and document weaknesses on purpose-built vulnerable systems.",
  },
  {
    icon:
      FlaskConical,

    title:
      "Web Security Labs",

    description:
      "Explore common web-application weaknesses using legal training platforms and isolated targets.",
  },
  {
    icon:
      FileText,

    title:
      "Security Reporting",

    description:
      "Record evidence, explain impact, recommend mitigations, and reflect on technical and procedural lessons.",
  },
];

const safetyBoundaries = [
  "Testing only systems I own, authorised labs, or platforms designed for security training",
  "No scanning or testing of public systems without explicit written permission",
  "Isolation of vulnerable machines from personal and household devices",
  "Use of snapshots or checkpoints before potentially disruptive exercises",
  "No real personal or confidential data stored inside vulnerable targets",
  "Clear documentation of scope, purpose, methods, findings, and outcomes",
];

const statusStyles: Record<
  string,
  string
> = {
  Operational:
    "border-green-400/20 bg-green-400/10 text-green-300",

  Completed:
    "border-green-400/20 bg-green-400/10 text-green-300",

  Researching:
    "border-blue-400/20 bg-blue-400/10 text-blue-300",

  "In Progress":
    "border-blue-400/20 bg-blue-400/10 text-blue-300",

  Planned:
    "border-amber-400/20 bg-amber-400/10 text-amber-300",
};

export default function CybersecurityHomeLabPage() {
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
                Cybersecurity Lab Case Study
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Cybersecurity Home Lab
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-300">
              Researching and developing an isolated virtual environment for
              Linux, networking, security-tool practice, packet analysis, and
              authorised ethical-hacking exercises.
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
                  Comparing virtualisation platforms
                </h2>

                <p className="mt-4 leading-7 text-gray-300">
                  The dedicated Windows 11 Pro workstation is ready. Current
                  work is focused on selecting the most suitable virtualisation
                  platform before creating Kali Linux and vulnerable-target
                  machines.
                </p>
              </div>

              <span className="inline-flex w-fit shrink-0 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-300">
                Research stage
              </span>
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
                The lab will provide a controlled environment for converting
                cybersecurity theory into repeatable practical experience
                without interacting with systems outside an authorised scope.
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
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Lab Hardware
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                Dedicated practice workstation
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                The workstation has been upgraded to support multiple virtual
                machines, lab snapshots, security tools, and future technical
                experiments.
              </p>
            </div>

            <article className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-7">
              <div className="flex items-start gap-4">
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                  <Laptop size={24} />
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Host system
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Lenovo V50s-07IMB
                  </h3>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {[
                  "Intel Core i5-10400",
                  "32 GB DDR4 3200 MHz",
                  "1 TB NVMe storage",
                  "Windows 11 Pro host",
                  "Dedicated cybersecurity system",
                  "Virtualisation platform under review",
                ].map(
                  (specification) => (
                    <div
                      key={
                        specification
                      }
                      className="flex gap-3 rounded-xl border border-white/10 bg-black/10 p-4"
                    >
                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-green-400"
                      />

                      <span className="text-sm leading-6 text-gray-300">
                        {
                          specification
                        }
                      </span>
                    </div>
                  ),
                )}
              </div>
            </article>
          </div>
        </Container>
      </section>

      {/* Virtualisation research */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Platform Research
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Virtualisation options being considered
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              No final platform is being claimed yet. The choice will follow
              research and practical comparison of isolation, networking,
              snapshots, usability, and compatibility.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {virtualisationOptions.map(
              (option) => (
                <article
                  key={option.title}
                  className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {option.title}
                  </h3>

                  <p className="mt-4 leading-7 text-gray-400">
                    {option.description}
                  </p>

                  <div className="mt-5 border-t border-white/10 pt-5">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-400">
                      Consideration
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-300">
                      {
                        option.consideration
                      }
                    </p>
                  </div>
                </article>
              ),
            )}
          </div>
        </Container>
      </section>

      {/* Architecture */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Lab Architecture
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Current and planned components
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              Status labels distinguish the operational host from components
              that remain under research or planned.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {labArchitecture.map(
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
                From research to practical labs
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                The project separates completed preparation from planned
                technical exercises and future learning outcomes.
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

      {/* Exercises */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Planned Practical Work
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Initial lab exercises
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              These exercises describe the intended learning roadmap and will
              be updated with evidence only after they are completed.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {plannedExercises.map(
              (exercise) => {
                const Icon =
                  exercise.icon;

                return (
                  <article
                    key={exercise.title}
                    className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6"
                  >
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                      <Icon size={22} />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {exercise.title}
                    </h3>

                    <p className="mt-3 leading-7 text-gray-400">
                      {
                        exercise.description
                      }
                    </p>
                  </article>
                );
              },
            )}
          </div>
        </Container>
      </section>

      {/* Safety */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Responsible Practice
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                Ethical and safety boundaries
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                The lab is intended only for legal, controlled, and authorised
                security learning.
              </p>
            </div>

            <div className="space-y-4">
              {safetyBoundaries.map(
                (boundary) => (
                  <div
                    key={boundary}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-black/10 p-5"
                  >
                    <ShieldCheck
                      size={20}
                      className="mt-0.5 shrink-0 text-green-400"
                    />

                    <p className="leading-7 text-gray-300">
                      {boundary}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Status */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-8 text-center md:p-12">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Next Milestone
            </p>

            <h2 className="mt-4 text-3xl font-bold text-white">
              Select and configure the virtualisation platform
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-400">
              The next update will document the platform decision, virtual
              network design, Kali Linux deployment, target-machine setup, and
              the first controlled lab exercise.
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