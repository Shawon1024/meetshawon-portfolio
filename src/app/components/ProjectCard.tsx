import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
    title: string;
    description: string;
    technologies: string[];
    image: string;
    href: string;
}

export default function ProjectCard({ title, description, technologies, image, href }: ProjectCardProps) {
    return (
        <Card>
            <Image src={image} alt={`${title} project preview`} width={800} height={450} className="mb-6 aspect-video w-full rounded-xl object-cover" />
            
            <h3 className="text-xl font-semibold mb-3">{title}</h3>

            <p className="text-gray-400 mb-5">{description}</p>

            <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                    <Badge key={tech}>
                        {tech}
                    </Badge>
                ))}
            </div>

            <div className="mt-6">
                <Link href={href} className="font-medium text-green-400 transition hover:text-green-300">View Project →</Link>
            </div>
        </Card>
    );
}
