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
    <section>
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