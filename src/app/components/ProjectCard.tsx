import Card from "./ui/Card";
import Badge from "./ui/Badge";

interface ProjectCardProps {
    title: string;
    description: string;
    technologies: string[];
}

export default function ProjectCard({ title, description, technologies }: ProjectCardProps) {
    return (
        <Card>
            <h3 className="text-xl font-semibold mb-3">{title}</h3>

            <p className="text-gray-400 mb-5">{description}</p>

            <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                    <Badge key={tech}>
                        {tech}
                    </Badge>
                ))}
            </div>

        </Card>
    );
}
