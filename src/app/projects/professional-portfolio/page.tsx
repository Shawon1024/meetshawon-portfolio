import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Cloud,
  Code2,
  GitBranch,
  Layout,
  MonitorSmartphone,
  ShieldCheck,
} from "lucide-react";

import Badge from "../../components/ui/Badge";
import Container from "../../components/Container";

const technologies = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "GitHub",
  "Cloudflare",
  "Vercel",
];

const objectives = [
  "Build a professional personal brand for cybersecurity roles",
  "Showcase projects, certifications, skills, and technical writing",
  "Create a responsive and accessible experience across devices",
  "Use reusable components and a maintainable project structure",
  "Prepare the website for secure production deployment",
];

const platformFeatures = [
  {
    icon: Layout,
    title: "Responsive Interface",
    description:
      "A modern layout designed to work across mobile, tablet, and desktop screens.",
  },
  {
    icon: Code2,
    title: "Reusable Components",
    description:
      "Buttons, cards, badges, containers, navigation, and page sections are built as reusable React components.",
  },
  {
    icon: GitBranch,
    title: "Git Workflow",
    description:
      "The project uses Git and GitHub for version control, commits, remote backups, and deployment preparation.",
  },
  {
    icon: MonitorSmartphone,
    title: "Personal Branding",
    description:
      "The visual system combines professional typography, responsive layouts, and a consistent Deep Sea and Earthy Green palette.",
  },
  {
    icon: Cloud,
    title: "Cloud Deployment",
    description:
      "The production design will use Vercel hosting with Cloudflare DNS and the meetshawon.com domain.",
  },
  {
    icon: ShieldCheck,
    title: "Security-Focused Design",
    description:
      "The project includes secure deployment planning, HTTPS, security headers, dependency awareness, and minimal public exposure.",
  },
];

export default function ProfessionalPortfolioPage() {
  return (
    <main>
      {/* Project header */}
      <section className="px-6 pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-green-400"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>

          <div className="mt-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs font-medium text-green-300">
                In Progress
              </span>

              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Web Platform Case Study
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Professional Portfolio Platform
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-300">
              Designing and developing a professional cybersecurity portfolio
              with Next.js, TypeScript, Tailwind CSS, reusable components,
              GitHub, and Cloudflare.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {technologies.map((technology) => (
                <Badge key={technology}>
                  {technology}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Purpose and objectives */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Project Overview
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                Purpose and objectives
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                The platform is intended to present my professional identity,
                technical work, cybersecurity development, and long-term
                learning journey in one consistent and maintainable website.
              </p>
            </div>

            <div className="space-y-4">
              {objectives.map((objective) => (
                <div
                  key={objective}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5"
                >
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-green-400"
                  />

                  <p className="leading-7 text-gray-300">
                    {objective}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Platform structure */}
      <section className="border-t border-white/5 py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Platform Structure
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              How the website is organised
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              The project separates routes, reusable components, data, visual
              elements, and future content systems into a structure that can
              grow over time.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {platformFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-400">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Development Workflow
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white">
                From local development to production
                </h2>

                <p className="mt-5 leading-7 text-gray-400">
                The project follows a structured workflow using local development,
                version control, testing, and planned automated deployment.
                </p>
            </div>

            <div className="space-y-4">
                {[
                {
                    step: "01",
                    title: "Develop Locally",
                    description:
                    "Build and test features with Next.js, TypeScript, Tailwind CSS, and the local development server.",
                },
                {
                    step: "02",
                    title: "Review and Test",
                    description:
                    "Check routes, responsiveness, component behaviour, imports, and layout consistency.",
                },
                {
                    step: "03",
                    title: "Commit with Git",
                    description:
                    "Save meaningful milestones using clear Git commits and maintain a clean project history.",
                },
                {
                    step: "04",
                    title: "Push to GitHub",
                    description:
                    "Store the remote codebase securely and prepare it for deployment and collaboration.",
                },
                {
                    step: "05",
                    title: "Deploy and Monitor",
                    description:
                    "Deploy through Vercel, connect Cloudflare DNS, and monitor production behaviour.",
                },
                ].map((item) => (
                <article
                    key={item.step}
                    className="flex gap-5 rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5"
                >
                    <span className="text-lg font-semibold text-green-400">
                    {item.step}
                    </span>

                    <div>
                    <h3 className="font-semibold text-white">
                        {item.title}
                    </h3>

                    <p className="mt-2 leading-7 text-gray-400">
                        {item.description}
                    </p>
                    </div>
                </article>
                ))}
            </div>
            </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
            <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Visual System
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
                Design system and reusable UI
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
                The interface uses a consistent Deep Sea and Earthy Green visual
                identity, supported by reusable components and predictable spacing.
            </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
                {
                title: "Deep Sea Background",
                value: "#061A18",
                description: "Primary page background",
                },
                {
                title: "Surface",
                value: "#102A2A",
                description: "Cards and elevated sections",
                },
                {
                title: "Security Green",
                value: "#4ADE80",
                description: "Primary accent and highlights",
                },
                {
                title: "Readable Contrast",
                value: "#F8FAFC",
                description: "Primary text and headings",
                },
            ].map((item) => (
                <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6"
                >
                <p className="text-sm text-gray-400">
                    {item.title}
                </p>

                <p className="mt-3 text-xl font-semibold text-green-300">
                    {item.value}
                </p>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                    {item.description}
                </p>
                </article>
            ))}
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-black/10 p-6">
                <h3 className="text-xl font-semibold text-white">
                Reusable components
                </h3>

                <p className="mt-4 leading-7 text-gray-400">
                Buttons, cards, badges, containers, icon buttons, navigation,
                headings, project cards, and page sections are reused across the
                platform.
                </p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-black/10 p-6">
                <h3 className="text-xl font-semibold text-white">
                Responsive behaviour
                </h3>

                <p className="mt-4 leading-7 text-gray-400">
                Layouts adapt between mobile, tablet, and desktop using consistent
                breakpoints, flexible grids, and mobile navigation.
                </p>
            </article>
            </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
            <div className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Engineering Decisions
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
                Why this technology stack was chosen
            </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
            {[
                {
                title: "Next.js App Router",
                description:
                    "Provides structured routing, layouts, server-rendering capabilities, and a modern React architecture.",
                },
                {
                title: "TypeScript",
                description:
                    "Improves reliability by making component props, project data, and application structures explicit.",
                },
                {
                title: "Tailwind CSS",
                description:
                    "Supports fast, consistent styling while keeping design decisions close to each component.",
                },
                {
                title: "Component-Based Architecture",
                description:
                    "Reduces duplication and makes visual changes easier to apply across the whole website.",
                },
                {
                title: "GitHub",
                description:
                    "Provides version control, remote backup, documentation, and future deployment integration.",
                },
                {
                title: "Cloudflare",
                description:
                    "Manages DNS and supports the wider meetshawon.com ecosystem, including future subdomains.",
                },
            ].map((decision) => (
                <article
                key={decision.title}
                className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6"
                >
                <h3 className="text-lg font-semibold text-white">
                    {decision.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                    {decision.description}
                </p>
                </article>
            ))}
            </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
            <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-black/10 p-6">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
                Challenges
                </p>

                <h2 className="mt-3 text-2xl font-semibold text-white">
                Problems encountered
                </h2>

                <ul className="mt-6 space-y-3 leading-7 text-gray-400">
                <li>Resolving GitHub authentication and unrelated Git histories</li>
                <li>Correcting component and route import paths</li>
                <li>Managing Next.js server and client component requirements</li>
                <li>Creating responsive navigation for desktop and mobile</li>
                <li>Maintaining consistent styling across growing page sections</li>
                </ul>
            </article>

            <article className="rounded-2xl border border-white/10 bg-black/10 p-6">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
                Lessons
                </p>

                <h2 className="mt-3 text-2xl font-semibold text-white">
                Skills developed
                </h2>

                <ul className="mt-6 space-y-3 leading-7 text-gray-400">
                <li>Next.js routing and layout organisation</li>
                <li>React component composition and reusable props</li>
                <li>TypeScript interfaces and project data modelling</li>
                <li>Responsive design and accessibility basics</li>
                <li>Git troubleshooting and structured development workflow</li>
                </ul>
            </article>
            </div>
        </Container>
      </section>

      <section className="border-t border-white/5 py-20">
        <Container>
            <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-8 md:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                    Future Development
                </p>

                <h2 className="mt-4 text-3xl font-bold text-white">
                    Planned platform improvements
                </h2>

                <p className="mt-5 leading-7 text-gray-400">
                    The website will continue evolving as new projects, certifications,
                    technical writing, and infrastructure services are added.
                </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                {[
                    "Production deployment to Vercel",
                    "Connect meetshawon.com",
                    "Add technical blog with MDX",
                    "Create project screenshots and diagrams",
                    "Add contact-form protection",
                    "Implement SEO and social previews",
                    "Add lab.meetshawon.com",
                    "Add performance monitoring",
                ].map((item) => (
                    <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-black/10 p-4 text-gray-300"
                    >
                    {item}
                    </div>
                ))}
                </div>
            </div>

            <div className="mt-10 text-center">
                <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400"
                >
                View All Projects
                <ArrowLeft className="rotate-180" size={18} />
                </Link>
            </div>
            </div>
        </Container>
      </section>
    </main>
  );
}