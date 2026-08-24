interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  alignment?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  alignment = "left",
}: SectionHeadingProps) {
  const centered =
    alignment === "center";

  return (
    <div
      className={`mb-12 ${
        centered
          ? "mx-auto max-w-3xl text-center"
          : "max-w-3xl"
      }`}
    >
      {eyebrow && (
        <div
          className={`flex items-center gap-3 ${
            centered
              ? "justify-center"
              : ""
          }`}
        >
          <span
            className="h-px w-8 bg-green-400"
            aria-hidden="true"
          />

          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-green-400">
            {eyebrow}
          </p>
        </div>
      )}

      <h2
        className={`text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-[2.75rem] lg:leading-tight ${
          eyebrow
            ? "mt-4"
            : ""
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-5 text-base leading-7 text-gray-400 md:text-lg md:leading-8 ${
            centered
              ? "mx-auto max-w-2xl"
              : "max-w-2xl"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}