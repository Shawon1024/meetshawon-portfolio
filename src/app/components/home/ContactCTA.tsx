import Container from "../Container";
import SectionHeading from "../ui/SectionHeading";

export default function ContactCTA() {
  return (
    <section className="py-24">

      <Container>

        <SectionHeading
          number="04"
          title="Let's Connect"
          description="Interested in cybersecurity, technology, or collaboration?"
        />


        <a
          href="/contact"
          className="
          inline-block
          rounded-xl
          bg-green-500
          px-6
          py-3
          font-medium
          text-black
          hover:bg-green-400
          transition
          "
        >
          Contact Me
        </a>

      </Container>

    </section>
  );
}
