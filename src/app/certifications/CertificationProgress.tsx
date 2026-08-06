import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock3,
} from "lucide-react";

import Container from "../components/Container";

const stages = [
  {
    title: "Build the foundation",
    description:
      "Strengthen networking, operating systems, security fundamentals, and practical lab skills.",
    status: "Current",
  },
  {
    title: "Complete foundational certification",
    description:
      "Prepare for a recognised entry-level certification such as CompTIA Security+.",
    status: "Next",
  },
  {
    title: "Develop practical offensive skills",
    description:
      "Progress into hands-on penetration-testing training and practical certifications.",
    status: "Planned",
  },
  {
    title: "Advance toward professional testing roles",
    description:
      "Build deeper methodology, reporting, Active Directory, and exploitation skills.",
    status: "Long term",
  },
];

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
              Certification progression
            </h2>

            <p className="mt-5 max-w-md leading-7 text-gray-400">
              My certification roadmap is designed to build strong technical
              foundations first, then move progressively into practical
              offensive-security skills.
            </p>
          </div>

          <div className="space-y-4">
            {stages.map((stage, index) => {
              const Icon =
                index === 0
                  ? Clock3
                  : index === 1
                    ? ArrowRight
                    : index === stages.length - 1
                      ? Circle
                      : CheckCircle2;

              return (
                <article
                  key={stage.title}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5"
                >
                  <div className="mt-1 text-green-400">
                    <Icon size={20} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-white">
                        {stage.title}
                      </h3>

                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
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