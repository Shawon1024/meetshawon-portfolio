import Container from "../components/Container";
import { skillCategories } from "../data/skills";
import SkillCategoryCard from "./SkillCategoryCard";

export default function SkillsGrid() {
  const totalSkills =
    skillCategories.reduce(
      (total, category) =>
        total +
        category.skills.length,
      0,
    );

  return (
    <section className="relative overflow-hidden border-t border-white/5 py-20">
      {/* Background decoration */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-green-400/[0.035] blur-3xl" />

      <Container>
        <div className="relative mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Detailed Breakdown
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              Skills & Technologies by Area
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              These areas reflect the knowledge and technologies I am
              developing through university study, practical projects,
              independent learning, and home-lab work.
            </p>
          </div>

          <div className="flex shrink-0 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center">
              <p className="text-2xl font-bold text-green-300">
                {skillCategories.length}
              </p>

              <p className="mt-1 text-xs uppercase tracking-wider text-gray-500">
                Categories
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center">
              <p className="text-2xl font-bold text-green-300">
                {totalSkills}
              </p>

              <p className="mt-1 text-xs uppercase tracking-wider text-gray-500">
                Skill Areas
              </p>
            </div>
          </div>
        </div>

        <div className="relative grid gap-6 lg:grid-cols-2">
          {skillCategories.map(
            (category) => (
              <SkillCategoryCard
                key={category.title}
                category={category}
              />
            ),
          )}
        </div>
      </Container>
    </section>
  );
}