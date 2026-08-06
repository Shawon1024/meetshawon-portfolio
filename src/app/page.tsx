import Hero from "./components/home/Hero";
import AboutPreview from "./components/home/AboutPreview";
import SkillsPreview from "./components/home/SkillsPreview";
import ProjectsPreview from "./components/home/ProjectsPreview";
import ContactCTA from "./components/home/ContactCTA";

export default function Home() {
  return (
    <main>
      <Hero />

      <AboutPreview />

      <SkillsPreview />

      <ProjectsPreview />

      <ContactCTA />
    </main>
  );
}