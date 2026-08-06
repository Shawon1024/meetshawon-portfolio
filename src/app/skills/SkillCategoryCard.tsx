import type { SkillCategory } from "../data/skills";

interface SkillCategoryCardProps {
  category: SkillCategory;
}

export default function SkillCategoryCard({
  category,
}: SkillCategoryCardProps) {
  const Icon = category.icon;

  return (
    <article className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
        <Icon size={24} />
      </div>

      <h2 className="mt-6 text-2xl font-semibold text-white">
        {category.title}
      </h2>

      <p className="mt-3 leading-7 text-gray-400">
        {category.description}
      </p>

      <div className="mt-7 space-y-4">
        {category.skills.map((skill) => (
          <div
            key={skill.name}
            className="rounded-xl border border-white/10 bg-black/10 p-4"
          >
            <h3 className="font-semibold text-green-300">
              {skill.name}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              {skill.description}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}