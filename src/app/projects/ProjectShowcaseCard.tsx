import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import type { Project } from "../data/projects";

interface ProjectShowcaseCardProps {
  project: Project;
}

export default function ProjectShowcaseCard({
  project,
}: ProjectShowcaseCardProps) {
  return (
    <Card>
      <Image
        src={project.image}
        alt={`${project.title} preview`}
        width={1000}
        height={560}
        className="h-44 w-full rounded-xl object-cover"
      />

      <div className="mt-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs font-medium text-green-300">
            {project.status}
          </span>

          {project.featured && (
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Featured Project
            </span>
          )}
        </div>

        <h2 className="text-xl font-semibold text-white">
          {project.title}
        </h2>

        <p className="mt-4 leading-7 text-gray-400">
          {project.summary}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.technologies.map((technology) => (
            <Badge key={technology}>
              {technology}
            </Badge>
          ))}
        </div>

        <ul className="mt-6 space-y-2 text-sm text-gray-400">
          {project.highlights.slice(0, 3).map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <span className="text-green-400">•</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <Link
          href={project.href}
          className="mt-7 inline-flex items-center gap-2 font-medium text-green-400 transition hover:text-green-300"
        >
          View Case Study
          <ArrowRight size={17} />
        </Link>
      </div>
    </Card>
  );
}
