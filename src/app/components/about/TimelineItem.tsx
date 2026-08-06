interface TimelineItemProps {
  date: string;
  title: string;
  subtitle: string;
  description: string;
  current?: boolean;
}

export default function TimelineItem({
  date,
  title,
  subtitle,
  description,
  current = false,
}: TimelineItemProps) {
  return (
    <div className="relative pl-10">
      {/* Timeline dot */}
      <div
        className={`
          absolute left-0 top-1.5
          h-4 w-4
          rounded-full
          border-2
          ${
            current
              ? "border-green-400 bg-green-400"
              : "border-green-400 bg-[#061A18]"
          }
        `}
      />

      {/* Timeline line */}
      <div className="absolute left-[7px] top-6 h-[calc(100%+2rem)] w-px bg-white/10" />

      {/* Content */}
      <div className="pb-12">
        <p className="mb-2 text-sm font-medium text-green-400">
          {date}
        </p>

        <h3 className="text-xl font-semibold text-white">
          {title}
        </h3>

        <p className="mt-1 text-gray-300">
          {subtitle}
        </p>

        <p className="mt-3 max-w-2xl leading-7 text-gray-400">
          {description}
        </p>

        {current && (
          <span className="mt-4 inline-flex rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs font-medium text-green-300">
            Current
          </span>
        )}
      </div>
    </div>
  );
}