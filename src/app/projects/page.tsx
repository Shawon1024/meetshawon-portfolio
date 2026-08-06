import ProjectsGrid from "../projects/ProjectsGrid";

export default function ProjectsPage() {
  return (
    <main>
      <section className="px-6 pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Selected Work
          </p>

          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Projects &{" "}
            <span className="text-green-400">
              Technical Work
            </span>
          </h1>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-green-400" />

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-300">
            Practical projects focused on cybersecurity, secure
            infrastructure, self-hosting, networking, and technical
            problem-solving.
          </p>
        </div>
      </section>

      <ProjectsGrid />
    </main>
  );
}
