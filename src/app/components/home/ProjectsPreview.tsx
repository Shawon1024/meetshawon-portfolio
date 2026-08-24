import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import Container from "../Container";
import SectionHeading from "../ui/SectionHeading";
import {
  projects,
  type Project,
} from "../../data/projects";

const statusStyles: Record<
  Project["status"],
  {
    icon: typeof Activity;
    className: string;
  }
> = {
  Completed: {
    icon:
      CheckCircle2,

    className:
      "border-green-400/20 bg-green-400/10 text-green-300",
  },

  Active: {
    icon:
      Activity,

    className:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
  },

  "In Progress": {
    icon:
      Clock3,

    className:
      "border-amber-400/20 bg-amber-400/10 text-amber-300",
  },

  Planned: {
    icon:
      Clock3,

    className:
      "border-gray-400/20 bg-gray-400/10 text-gray-300",
  },
};

export default function ProjectsPreview() {
  const featuredProjects =
    projects
      .filter(
        (project) =>
          project.featured,
      )
      .slice(
        0,
        3,
      );

  return (
    <section className="relative overflow-hidden border-y border-white/5 py-20 md:py-24 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute -left-48 top-1/4 h-96 w-96 rounded-full bg-green-500/[0.035] blur-3xl" />

        <div className="absolute -right-48 bottom-0 h-96 w-96 rounded-full bg-cyan-500/[0.035] blur-3xl" />
      </div>

      <Container>
        <div className="relative">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Selected Work"
              title="Projects built around real technical challenges"
              description="A selection of application, infrastructure, and cybersecurity projects demonstrating how I approach planning, implementation, security, and documentation."
            />

            <Link
              href="/projects"
              className="group mb-12 inline-flex w-fit shrink-0 items-center gap-2 text-sm font-semibold text-green-400 transition hover:text-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]"
            >
              View all projects

              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProjects.map(
              (project) => {
                const status =
                  statusStyles[
                    project.status
                  ];

                const StatusIcon =
                  status.icon;

                const visibleTechnologies =
                  project.technologies.slice(
                    0,
                    4,
                  );

                const remainingTechnologies =
                  Math.max(
                    project.technologies.length -
                      visibleTechnologies.length,
                    0,
                  );

                return (
                  <article
                    key={
                      project.slug
                    }
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[var(--surface)]/65 transition duration-300 hover:-translate-y-1 hover:border-green-400/30 hover:bg-[var(--surface)]/90 hover:shadow-2xl hover:shadow-black/20"
                  >
                    <Link
                      href={
                        project.href
                      }
                      className="relative block overflow-hidden"
                      aria-label={`View ${project.title}`}
                    >
                      <Image
                        src={
                          project.image
                        }
                        alt={`${project.title} project preview`}
                        width={
                          1200
                        }
                        height={
                          675
                        }
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        loading="lazy"
                        className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />

                      <div
                        className="absolute inset-0 bg-gradient-to-t from-[#071c18]/70 via-transparent to-transparent"
                        aria-hidden="true"
                      />

                      <div className="absolute left-4 top-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-md ${status.className}`}
                        >
                          <StatusIcon
                            size={14}
                            aria-hidden="true"
                          />

                          {
                            project.status
                          }
                        </span>
                      </div>
                    </Link>

                    <div className="flex flex-1 flex-col p-6 md:p-7">
                      <h3 className="text-xl font-semibold leading-snug text-white transition group-hover:text-green-300">
                        <Link
                          href={
                            project.href
                          }
                        >
                          {
                            project.title
                          }
                        </Link>
                      </h3>

                      <p className="mt-4 line-clamp-4 text-sm leading-6 text-gray-400">
                        {
                          project.summary
                        }
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {visibleTechnologies.map(
                          (
                            technology,
                          ) => (
                            <span
                              key={
                                technology
                              }
                              className="rounded-lg border border-white/10 bg-black/15 px-2.5 py-1.5 text-xs font-medium text-gray-300"
                            >
                              {
                                technology
                              }
                            </span>
                          ),
                        )}

                        {remainingTechnologies >
                          0 && (
                          <span className="rounded-lg border border-white/10 bg-black/15 px-2.5 py-1.5 text-xs font-medium text-gray-500">
                            +
                            {
                              remainingTechnologies
                            }{" "}
                            more
                          </span>
                        )}
                      </div>

                      <div className="mt-auto pt-7">
                        <div className="border-t border-white/10 pt-5">
                          <Link
                            href={
                              project.href
                            }
                            className="group/link inline-flex items-center gap-2 text-sm font-semibold text-green-400 transition hover:text-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                          >
                            View project details

                            <ArrowRight
                              size={
                                16
                              }
                              className="transition-transform duration-200 group-hover/link:translate-x-1"
                              aria-hidden="true"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/10 px-5 py-5 md:px-6">
            <p className="text-sm leading-6 text-gray-400">
              Each project includes its current status, technical decisions,
              implementation details, outcomes, and areas identified for
              continued development.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}