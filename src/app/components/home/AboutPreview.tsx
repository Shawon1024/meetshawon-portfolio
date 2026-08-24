
import Container from "../Container";
import SectionHeading from "../ui/SectionHeading";

export default function AboutPreview() {
  return (
    <section className="px-8 py-20">
      <Container>

        <SectionHeading
          number="01"
          title="About Me"
          description="I am a cybersecurity postgraduate student and First-Class Computer Science graduate focused on ethical hacking, secure infrastructure, and practical cybersecurity development."
        />

        <div className="max-w-3xl text-gray-300 space-y-4">
          <p>
            I am a cybersecurity postgraduate student and First-Class Computer Science graduate focused on ethical hacking, secure infrastructure, and practical cybersecurity development.
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