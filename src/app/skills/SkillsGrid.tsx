import Container from "../components/Container";
import SkillCategoryCard from "./SkillCategoryCard";
import { skillCategories } from "../data/skills";

export default function SkillsGrid() {
  return (
    <section className="border-t border-white/5 py-20">
      <Container>
        <div className="grid gap-6 lg:grid-cols-2">
          {skillCategories.map((category) => (
            <SkillCategoryCard
              key={category.title}
              category={category}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}