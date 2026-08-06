interface ProjectCardProps {
    title: string;
    description: string;
    technologies: string[];
}

export default function ProjectCard({ title, description, technologies }: ProjectCardProps) {
    return (
        <div className="rounded-2xl border border-white/10 bg-[var(--surface)] p-6 hover:border-green-400 transition">
            <h3 className="text-xl font-semibold mb-3">{title}</h3>

            <p className="text-gray-400 mb-5">{description}</p>

            <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                    <span key={tech} className="rounded-full bg-white/5 px-3 py-1 text-sm text-green-300">
                        {tech}
                    </span>
                ))}
            </div>

        </div>
    );
}