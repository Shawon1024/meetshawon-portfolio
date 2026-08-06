import Container from "../Container";
import SectionHeading from "../SectionHeading";


const skills = [
  "Cybersecurity",
  "Ethical Hacking",
  "Linux",
  "Python",
  "Networking",
  "Cloud Infrastructure",
  "TrueNAS SCALE",
  "Nextcloud",
];

export default function SkillsPreview() {
  return (
    <section className="px-8 py-20">
      <Container>
        <SectionHeading number="02" title="Skills" description="Here are some of the skills I have developed in the field of cybersecurity and related technologies." />

        <div className=" grid grid-cols-2 md:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <div key={skill} className="rounded-xl border border-white/10 bg-[var(--surface)] p-4 text-center hover:border-green-400 transition">
              {skill}
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
}