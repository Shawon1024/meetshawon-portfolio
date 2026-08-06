import Container from "../Container";
import TimelineItem from "./TimelineItem";

export default function Journey() {
  return (
    <section className="border-t border-white/5 py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">

          {/* Section introduction */}
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              My Journey
            </p>

            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Education & Professional Development
            </h2>

            <p className="mt-5 max-w-md leading-7 text-gray-400">
              My academic background and ongoing development are helping me
              build the technical and professional skills required for a
              career in cybersecurity.
            </p>
          </div>

          {/* Timeline */}
          <div>
            <TimelineItem
              date="Completed"
              title="BSc Computer Science"
              subtitle="Undergraduate Degree"
              description="Developed a foundation in computing, programming, software development, databases, networking, and related computer science concepts."
            />

            <TimelineItem
              date="Current"
              title="MSc Cyber Security Management"
              subtitle="Postgraduate Degree"
              description="Developing knowledge across cybersecurity, security management, risk, governance, and professional practice while continuing practical technical development."
              current
            />

            <TimelineItem
              date="Ongoing"
              title="Practical Cybersecurity Development"
              subtitle="Independent Learning & Home Lab"
              description="Building hands-on experience through cybersecurity labs, ethical hacking practice, networking, Linux, self-hosted infrastructure, and personal technical projects."
            />
          </div>

        </div>
      </Container>
    </section>
  );
}