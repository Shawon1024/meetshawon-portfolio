import {
  Cloud,
  Code2,
  Network,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import Container from "../../components/Container";

const interests = [
  {
    title: "Ethical Hacking",
    description:
      "Learning how vulnerabilities are identified, tested, and responsibly reported.",
    icon: Search,
  },
  {
    title: "Network Security",
    description:
      "Understanding how systems communicate and how networks can be monitored and protected.",
    icon: Network,
  },
  {
    title: "Secure Infrastructure",
    description:
      "Building practical systems with secure configuration, access control, and resilience in mind.",
    icon: ShieldCheck,
  },
  {
    title: "Cloud & Self-Hosting",
    description:
      "Exploring private cloud services, DNS, HTTPS, storage, and secure remote access.",
    icon: Cloud,
  },
  {
    title: "Security Automation",
    description:
      "Using scripts and tools to make repetitive security and administration tasks more efficient.",
    icon: Code2,
  },
  {
    title: "Hands-On Labs",
    description:
      "Developing practical skills through experiments, virtual machines, home labs, and projects.",
    icon: Wrench,
  },
];

const values = [
  {
    title: "Continuous Learning",
    description:
      "Cybersecurity changes constantly, so I treat learning as an ongoing professional responsibility.",
  },
  {
    title: "Ethical Responsibility",
    description:
      "Security knowledge should be used legally, responsibly, and with respect for privacy and trust.",
  },
  {
    title: "Practical Thinking",
    description:
      "I value hands-on experience and aim to understand how concepts work in real systems.",
  },
  {
    title: "Clear Communication",
    description:
      "Technical work is more valuable when it can be explained clearly to both technical and non-technical audiences.",
  },
];

export default function InterestsValues() {
  return (
    <section className="border-t border-white/5 py-24">
      <Container>
        <div className="mb-14 max-w-3xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            What Drives Me
          </p>

          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Interests & Professional Values
          </h2>

          <p className="mt-5 leading-7 text-gray-400">
            The areas I am developing and the principles that guide how I
            approach cybersecurity, technology, and professional growth.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {interests.map((interest) => {
            const Icon = interest.icon;

            return (
              <article
                key={interest.title}
                className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6 transition hover:-translate-y-1 hover:border-green-400/60"
              >
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                  <Icon size={22} />
                </div>

                <h3 className="text-lg font-semibold text-white">
                  {interest.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  {interest.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-20">
          <h3 className="mb-8 text-2xl font-semibold text-white">
            Professional Values
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            {values.map((value) => (
              <article
                key={value.title}
                className="rounded-2xl border border-white/10 bg-black/10 p-6"
              >
                <h4 className="text-lg font-semibold text-green-300">
                  {value.title}
                </h4>

                <p className="mt-3 leading-7 text-gray-400">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
