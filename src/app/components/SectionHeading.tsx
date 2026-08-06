interface SectionHeadingProps {
    number: string;
    title: string;
    description?: string;
}

export default function SectionHeading({ number, title, description }: SectionHeadingProps) {
    return (
        <div className="mb-12 space-y-4">

            <p className="text-green-400 text-sm">
                {number}
            </p>

            <h2 className="text-3xl md:text-4xl font-bold">
                {title}
            </h2>

            {description && (
            <p className="mx-w-2xl text-gray-400">
                {description}
            </p>
            )}
        </div>
    );
}
