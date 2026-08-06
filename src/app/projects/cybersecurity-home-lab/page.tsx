import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FlaskConical,
  Laptop,
  Network,
  Server,
  ShieldCheck,
  Terminal,
} from "lucide-react";

import Badge from "../../components/ui/Badge";
import Container from "../../components/Container";

const technologies = [
  "Kali Linux",
  "Virtual Machines",
  "Linux",
  "Networking",
  "Nmap",
  "Wireshark",
];

const objectives = [
  "Create an isolated environment for ethical hacking practice",
  "Develop practical Linux and command-line skills",
  "Learn network discovery and traffic analysis",
  "Practise vulnerability assessment safely and legally",
  "Document labs, findings, and technical learning",
];

const labComponents = [
  {
    icon: Laptop,
    title: "Host System",
    description:
      "The main computer provides the processing power, storage, and virtualisation platform for the lab.",
  },
  {
    icon: Terminal,
    title: "Kali Linux",
    description:
      "Used as the primary security-testing environment for authorised learning and lab exercises.",
  },
  {
    icon: Server,
    title: "Target Machines",
    description:
      "Purpose-built vulnerable or test systems provide safe environments for controlled exercises.",
  },
  {
    icon: Network,
    title: "Isolated Network",
    description:
      "Lab systems communicate through a controlled virtual network to reduce exposure to other devices.",
  },
  {
    icon: ShieldCheck,
    title: "Documentation",
    description:
      "Each exercise records objectives, tools, observations, findings, and lessons learned.",
  },
  {
    icon: FlaskConical,
    title: "Experiments",
    description:
      "The lab supports networking, Linux administration, packet analysis, and security-tool practice.",
  },
];

export default function CybersecurityHomeLabPage() {
  return (
    <main>
      {/* Project header */}
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
                Cybersecurity Lab Case Study
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Cybersecurity Home Lab
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-300">
              Building an isolated practical environment for Linux,
              networking, vulnerability assessment, packet analysis, and
              ethical hacking exercises.
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

      {/* Purpose and objectives */}
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
                The lab provides a controlled space for developing practical
                cybersecurity skills without testing against systems that I do
                not own or have permission to assess.
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

      {/* Lab structure */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Lab Structure
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              How the environment is organised
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              The environment separates the host, security-testing machine,
              target systems, networking, and documentation into clear parts.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {labComponents.map((item) => {
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
                Hardware and virtualisation
                </h2>

                <p className="mt-5 leading-7 text-gray-400">
                The lab uses dedicated desktop hardware to run multiple isolated
                virtual machines for security testing, Linux administration, and
                networking exercises.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <article className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
                <p className="text-sm text-gray-400">
                    Lab workstation
                </p>

                <h3 className="mt-2 text-xl font-semibold text-white">
                    Lenovo V50s-07IMB
                </h3>

                <ul className="mt-5 space-y-3 text-gray-400">
                    <li>Intel Core i5-10400</li>
                    <li>RAM upgrade planned for virtual machines</li>
                    <li>512 GB NVMe storage</li>
                    <li>Dedicated cybersecurity practice system</li>
                </ul>
                </article>

                <article className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
                <p className="text-sm text-gray-400">
                    Virtual environment
                </p>

                <h3 className="mt-2 text-xl font-semibold text-white">
                    Isolated Virtual Machines
                </h3>

                <ul className="mt-5 space-y-3 text-gray-400">
                    <li>Kali Linux attacker machine</li>
                    <li>Purpose-built vulnerable targets</li>
                    <li>Private virtual network</li>
                    <li>Snapshots for safe recovery</li>
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
                Practical Work
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
                Planned lab exercises
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
                The lab will support structured exercises that build technical
                confidence while remaining inside a controlled and authorised
                environment.
            </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[
                {
                title: "Network Discovery",
                description:
                    "Identify lab hosts, open ports, and available services using authorised scanning tools.",
                },
                {
                title: "Packet Analysis",
                description:
                    "Capture and inspect network traffic to understand protocols, conversations, and unusual behaviour.",
                },
                {
                title: "Linux Administration",
                description:
                    "Practise users, permissions, services, logs, package management, and command-line workflows.",
                },
                {
                title: "Vulnerability Assessment",
                description:
                    "Identify and document weaknesses on purpose-built vulnerable systems.",
                },
                {
                title: "Web Security Labs",
                description:
                    "Explore common web application vulnerabilities in safe training platforms.",
                },
                {
                title: "Security Documentation",
                description:
                    "Record objectives, commands, evidence, findings, mitigations, and lessons learned.",
                },
            ].map((exercise) => (
                <article
                key={exercise.title}
                className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6"
                >
                <h3 className="text-lg font-semibold text-white">
                    {exercise.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                    {exercise.description}
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
                Responsible Practice
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white">
                Ethical and safety boundaries
                </h2>

                <p className="mt-5 leading-7 text-gray-400">
                All testing is restricted to systems I own, purpose-built training
                platforms, or environments where explicit permission has been
                granted.
                </p>
            </div>

            <div className="space-y-4">
                {[
                "No testing against public systems without written permission",
                "Use of isolated virtual networks where practical",
                "Snapshots before potentially disruptive experiments",
                "No real personal data stored inside vulnerable targets",
                "Clear documentation of scope, purpose, and outcomes",
                ].map((boundary) => (
                <div
                    key={boundary}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-black/10 p-5"
                >
                    <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-green-400"
                    />

                    <p className="leading-7 text-gray-300">
                    {boundary}
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
                Reflection
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
                Skills and learning outcomes
            </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-black/10 p-6">
                <h3 className="text-xl font-semibold text-white">
                Technical development
                </h3>

                <ul className="mt-5 space-y-3 leading-7 text-gray-400">
                <li>Linux and command-line administration</li>
                <li>Network discovery and service identification</li>
                <li>Packet capture and traffic analysis</li>
                <li>Virtualisation and lab isolation</li>
                <li>Security-tool configuration and usage</li>
                </ul>
            </article>

            <article className="rounded-2xl border border-white/10 bg-black/10 p-6">
                <h3 className="text-xl font-semibold text-white">
                Professional development
                </h3>

                <ul className="mt-5 space-y-3 leading-7 text-gray-400">
                <li>Defining clear scope and objectives</li>
                <li>Recording repeatable technical steps</li>
                <li>Writing concise findings and mitigations</li>
                <li>Applying ethical and legal boundaries</li>
                <li>Reflecting on failures and improvements</li>
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
                An evolving practical learning environment
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-400">
                This case study will grow as I complete new labs, document findings,
                add target systems, and expand the environment with monitoring and
                defensive-security tools.
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