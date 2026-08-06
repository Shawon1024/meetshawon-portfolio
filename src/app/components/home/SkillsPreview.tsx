export default function SkillsPreview() {
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

  return (
    <section className="px-8 py-20">
      <h2>Skills</h2>

      <ul>
        {skills.map((skill) => (
          <li key={skill}>
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}