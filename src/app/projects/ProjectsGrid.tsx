import Container from "../components/Container";
import ProjectShowcaseCard from "./ProjectShowcaseCard";
import { projects } from "../data/projects";

export default function ProjectsGrid() {
  return (
    <section className="border-t border-white/5 py-24">
      <Container>
        <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {projects.map(
              (project, index) => (
                <ProjectShowcaseCard
                  key={project.slug}
                  project={project}
                  eager={index < 3}
                />
              ),
            )}
        </div>
        </div>
      </Container>
    </section>
  );
}
