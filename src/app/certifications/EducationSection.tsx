import { BookOpen, CalendarDays, GraduationCap } from "lucide-react";

import Container from "../components/Container";

const education = [
  {
    title: "BSc Computer Science",
    institution: "University of East London",
    period: "Completed in 2024",
    status: "Completed",
    description:
      "Built a broad technical foundation across programming, software development, databases, networking, computing systems, and core computer science principles.",
    icon: GraduationCap,
  },
  {
    title: "MSc Cyber Security Management",
    qualification: "with Professional Practice",
    institution: "The University of Law",
    period: "2026–2028",
    status: "Current",
    description:
      "Developing knowledge across cybersecurity management, risk, governance, security strategy, professional practice, and practical technical development.",
    icon: BookOpen,
  },
];

export default function EducationSection() {
  return (
    <section className="border-t border-white/5 py-20">
      <Container>
        <div className="mb-12 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Academic Background
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Education
          </h2>

          <p className="mt-5 leading-7 text-gray-400">
            My academic studies provide the technical, strategic, and
            professional foundation supporting my development in
            cybersecurity.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {education.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-7 transition duration-300 hover:border-green-400/40"
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                    <Icon size={24} aria-hidden="true" />
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      item.status === "Current"
                        ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                        : "border-green-400/20 bg-green-400/10 text-green-300"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-white">
                  {item.title}
                </h3>

                {"qualification" in item && item.qualification && (
                  <p className="mt-1 text-sm text-gray-300">
                    {item.qualification}
                  </p>
                )}

                <p className="mt-3 font-medium text-green-300">
                  {item.institution}
                </p>

                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <CalendarDays size={15} aria-hidden="true" />
                  <span>{item.period}</span>
                </div>

                <p className="mt-5 leading-7 text-gray-400">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}