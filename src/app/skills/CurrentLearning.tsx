import {
  BookOpen,
  FlaskConical,
  Network,
  ShieldCheck,
} from "lucide-react";

import Container from "../components/Container";

const learningItems = [
  {
    title: "Security Fundamentals",
    description:
      "Strengthening core knowledge around threats, vulnerabilities, controls, risk, and secure architecture.",
    icon: ShieldCheck,
  },
  {
    title: "Networking",
    description:
      "Developing a deeper understanding of protocols, services, troubleshooting, and secure communication.",
    icon: Network,
  },
  {
    title: "Ethical Hacking Labs",
    description:
      "Practising enumeration, vulnerability assessment, Linux, packet analysis, and authorised security exercises.",
    icon: FlaskConical,
  },
  {
    title: "Certification Preparation",
    description:
      "Following a structured learning path toward foundational and practical cybersecurity certifications.",
    icon: BookOpen,
  },
];

export default function CurrentLearning() {
  return (
    <section className="border-t border-white/5 py-20">
      <Container>
        <div className="mb-12 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Current Focus
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            What I&apos;m learning now
          </h2>

          <p className="mt-5 leading-7 text-gray-400">
            My current development priorities combine academic study,
            technical foundations, hands-on labs, and certification
            preparation.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {learningItems.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 text-xl font-semibold text-white">
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
  );
}