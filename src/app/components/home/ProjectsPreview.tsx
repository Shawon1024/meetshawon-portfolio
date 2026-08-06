import Container from "../Container";
import SectionHeading from "../ui/SectionHeading";
import ProjectCard from "../ProjectCard";

const projects = [
  {
    title: "Self-Hosted Private Cloud Infrastructure",

    description:
      "Building a production-style private cloud using TrueNAS SCALE, ZFS, Nextcloud, Cloudflare DNS, and secure remote access.",

    technologies: [
      "TrueNAS SCALE",
      "ZFS",
      "Nextcloud",
      "Cloudflare",
    ],
    image: "/projects/placeholder.jpg",
    href: "/projects",
  },
];

export default function ProjectsPreview() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading number="03" title="Featured Projects" description="Practical projects demonstrating my technical skills."/>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project}/>
          ))}
        </div>
      </Container>
    </section>
  );
}
