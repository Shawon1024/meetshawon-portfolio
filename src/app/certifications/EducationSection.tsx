import {
  BookOpen,
  GraduationCap,
} from "lucide-react";

import Container from "../components/Container";

const education = [
  {
    title: "BSc Computer Science",
    institution: "Undergraduate Degree",
    status: "Completed",
    description:
      "Built a foundation across programming, software development, databases, networking, computing systems, and broader computer science concepts.",
    icon: GraduationCap,
  },
  {
    title: "MSc Cyber Security Management",
    institution: "Postgraduate Degree with Professional Practice",
    status: "Current",
    description:
      "Developing knowledge of cybersecurity management, risk, governance, professional practice, security strategy, and practical technical development.",
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
            My academic studies provide the technical and professional
            foundation supporting my transition into cybersecurity.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {education.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-7"
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                    <Icon size={24} />
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      item.status === "Current"
                        ? "border-green-400/20 bg-green-400/10 text-green-300"
                        : "border-white/10 bg-white/5 text-gray-300"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm font-medium text-green-300">
                  {item.institution}
                </p>

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