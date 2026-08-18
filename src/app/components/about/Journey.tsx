import Container from "../Container";
import TimelineItem from "./TimelineItem";

export default function Journey() {
  return (
    <section className="border-t border-white/5 py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              My Journey
            </p>

            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Education & Professional Development
            </h2>

            <p className="mt-5 max-w-md leading-7 text-gray-400">
              My development combines formal education with independent
              learning and practical projects. This allows me to strengthen
              both the technical and professional skills required for a
              responsible career in cybersecurity.
            </p>
          </div>

          <div>
            <TimelineItem
              date="Completed · June 2024"
              title="BSc (Hons) Computer Science"
              subtitle="University of East London"
              description="Built a broad foundation in programming, software development, databases, networking, systems, problem-solving, and core computer science principles."
            />

            <TimelineItem
              date="June 2026 · June 2028"
              title="MSc Cyber Security Management with Professional Practice"
              subtitle="The University of Law"
              description="Developing postgraduate knowledge across cybersecurity management, governance, risk, professional practice, and the relationship between technical security and organisational decision-making."
              current
            />

            <TimelineItem
              date="Ongoing"
              title="Practical Cybersecurity Development"
              subtitle="Independent Learning, Home Lab & Technical Projects"
              description="Building hands-on experience through ethical hacking practice, security labs, Linux, networking, virtual machines, self-hosted services, secure infrastructure, and documented portfolio projects."
            />
          </div>
        </div>
      </Container>
    </section>
  );
}