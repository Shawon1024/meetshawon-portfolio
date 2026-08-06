
import Container from "../Container";
import SectionHeading from "../SectionHeading";

export default function AboutPreview() {
  return (
    <section className="px-8 py-20">
      <Container>

        <SectionHeading number="01" title="About Me" description="I am a Cybersecurity student with a background in Computer Science, passionate about ethical hacking, secure infrastructure, and cybersecurity research." />

        <div className="max-w-3xl text-gray-300 space-y-4">
          <p>
            I am a Cybersecurity student with a background in Computer Science,
            passionate about ethical hacking, secure infrastructure, and
            cybersecurity research.
          </p>

          <p>
            My goal is to develop practical security skills by building
            real-world projects, exploring vulnerabilities, and creating
            secure systems.
          </p>
        </div>

      </Container>
    </section>
  );
}