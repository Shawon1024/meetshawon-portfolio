import {
  CheckCircle2,
  Clock3,
  Route,
  Target,
} from "lucide-react";

import Container from "../components/Container";

const stages = [
  {
    title: "Complete introductory technical foundations",
    description:
      "Completed Cisco Networking Academy training in cybersecurity, operating systems, and computer hardware.",
    status: "Completed",
  },
  {
    title: "Strengthen networking and ethical-hacking skills",
    description:
      "Currently studying Networking Basics and Ethical Hacker through Cisco Networking Academy.",
    status: "Current",
  },
  {
    title: "Prepare for CompTIA certifications",
    description:
      "Develop the knowledge and practical readiness required for CompTIA Network+ and CompTIA Security+.",
    status: "Planned",
  },
  {
    title: "Apply learning through practical projects",
    description:
      "Continue translating academic study and certification knowledge into home-lab exercises, security projects, and documented technical work.",
    status: "Ongoing",
  },
];

const statusStyles: Record<string, string> = {
  Completed: "border-green-400/20 bg-green-400/10 text-green-300",
  Current: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  Planned: "border-white/10 bg-white/5 text-gray-300",
  Ongoing: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
};

export default function CertificationProgress() {
  return (
    <section className="border-t border-white/5 py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Development Path
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              Learning progression
            </h2>

            <p className="mt-5 max-w-md leading-7 text-gray-400">
              My development path combines academic study, recognised
              training, planned professional certifications, and practical
              project work.
            </p>
          </div>

          <div className="space-y-4">
            {stages.map((stage) => {
              const Icon =
                stage.status === "Completed"
                  ? CheckCircle2
                  : stage.status === "Current"
                    ? Clock3
                    : stage.status === "Planned"
                      ? Target
                      : Route;

              return (
                <article
                  key={stage.title}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5"
                >
                  <div className="mt-1 text-green-400">
                    <Icon size={20} aria-hidden="true" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-white">
                        {stage.title}
                      </h3>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                          statusStyles[stage.status]
                        }`}
                      >
                        {stage.status}
                      </span>
                    </div>

                    <p className="mt-3 leading-7 text-gray-400">
                      {stage.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}