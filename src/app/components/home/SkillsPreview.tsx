import Link from "next/link";
import {
  ArrowRight,
  CloudCog,
  Network,
  ShieldCheck,
} from "lucide-react";

import Container from "../Container";
import SectionHeading from "../ui/SectionHeading";

const capabilityGroups = [
  {
    title:
      "Security Foundations",

    description:
      "Developing structured knowledge of cybersecurity principles, ethical practice, system protection, and risk-aware thinking.",

    icon:
      ShieldCheck,

    accent:
      "green",

    skills: [
      "Cybersecurity",
      "Ethical Hacking",
      "Security Principles",
      "Risk Awareness",
    ],
  },

  {
    title:
      "Systems & Networks",

    description:
      "Building the technical foundation required to understand operating systems, networked environments, and secure administration.",

    icon:
      Network,

    accent:
      "cyan",

    skills: [
      "Linux",
      "Networking",
      "Python",
      "System Administration",
    ],
  },

  {
    title:
      "Infrastructure & Self-Hosting",

    description:
      "Applying infrastructure knowledge through storage, private cloud services, remote access, and documented deployment work.",

    icon:
      CloudCog,

    accent:
      "blue",

    skills: [
      "TrueNAS SCALE",
      "Nextcloud",
      "Cloudflare",
      "Secure Infrastructure",
    ],
  },
];

const accentStyles = {
  green: {
    icon:
      "border-green-400/20 bg-green-400/10 text-green-300",

    line:
      "from-green-400/70 to-green-400/5",

    hover:
      "hover:border-green-400/30",
  },

  cyan: {
    icon:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",

    line:
      "from-cyan-400/70 to-cyan-400/5",

    hover:
      "hover:border-cyan-400/30",
  },

  blue: {
    icon:
      "border-blue-400/20 bg-blue-400/10 text-blue-300",

    line:
      "from-blue-400/70 to-blue-400/5",

    hover:
      "hover:border-blue-400/30",
  },
};

export default function SkillsPreview() {
  return (
    <section className="relative overflow-hidden py-20 md:py-24 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-500/[0.035] blur-3xl" />
      </div>

      <Container>
        <div className="relative">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Technical Capabilities"
              title="Skills built through study and practical work"
              description="A growing technical foundation across cybersecurity, systems, networking, and self-hosted infrastructure."
            />

            <Link
              href="/skills"
              className="group mb-12 inline-flex w-fit shrink-0 items-center gap-2 text-sm font-semibold text-green-400 transition hover:text-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]"
            >
              Explore all skills

              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {capabilityGroups.map(
              (group) => {
                const Icon =
                  group.icon;

                const styles =
                  accentStyles[
                    group.accent as keyof typeof accentStyles
                  ];

                return (
                  <article
                    key={
                      group.title
                    }
                    className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-[var(--surface)]/65 p-6 transition duration-300 hover:-translate-y-1 hover:bg-[var(--surface)]/90 hover:shadow-2xl hover:shadow-black/10 md:p-7 ${styles.hover}`}
                  >
                    <div
                      className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${styles.line}`}
                      aria-hidden="true"
                    />

                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${styles.icon}`}
                    >
                      <Icon
                        size={23}
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="mt-6 text-xl font-semibold text-white">
                      {
                        group.title
                      }
                    </h3>

                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-400">
                      {
                        group.description
                      }
                    </p>

                    <div className="mt-6 border-t border-white/10 pt-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                        Focus areas
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {group.skills.map(
                          (skill) => (
                            <span
                              key={
                                skill
                              }
                              className="rounded-lg border border-white/10 bg-black/15 px-3 py-2 text-xs font-medium text-gray-300 transition duration-200 group-hover:border-white/15 group-hover:text-white"
                            >
                              {
                                skill
                              }
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <p className="max-w-3xl text-sm leading-6 text-gray-400">
              My capabilities continue to develop through postgraduate study,
              technical coursework, independent research, and practical
              infrastructure projects.
            </p>

            <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-xs font-semibold text-green-300">
              <span
                className="h-1.5 w-1.5 rounded-full bg-green-400"
                aria-hidden="true"
              />

              Continuous development
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}