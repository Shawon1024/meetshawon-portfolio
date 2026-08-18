import type { SkillCategory } from "../data/skills";

interface SkillCategoryCardProps {
  category: SkillCategory;
}

export default function SkillCategoryCard({
  category,
}: SkillCategoryCardProps) {
  const Icon = category.icon;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-green-400/40 hover:shadow-green-950/20 md:p-7">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-green-400/[0.06] blur-3xl transition duration-300 group-hover:bg-green-400/10" />

      {/* Category header */}
      <div className="relative flex items-start justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-green-400/15 bg-green-400/10 text-green-300 shadow-lg shadow-green-950/20">
            <Icon size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              {category.title}
            </h2>

            <p className="mt-2 max-w-xl leading-7 text-gray-400">
              {category.description}
            </p>
          </div>
        </div>

        <span className="hidden shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300 sm:inline-flex">
          {category.skills.length}{" "}
          {category.skills.length === 1
            ? "skill"
            : "skills"}
        </span>
      </div>

      {/* Skill list */}
      <div className="relative mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {category.skills.map(
          (skill) => (
            <div
              key={skill.name}
              className="group/skill rounded-2xl border border-white/10 bg-black/15 p-4 transition duration-200 hover:border-green-400/25 hover:bg-green-400/[0.04]"
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.55)]" />

                <h3 className="font-semibold text-white transition group-hover/skill:text-green-300">
                  {skill.name}
                </h3>
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                {skill.description}
              </p>
            </div>
          ),
        )}
      </div>
    </article>
  );
}