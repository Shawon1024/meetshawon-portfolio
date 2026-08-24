interface IconButtonProps {
  children: React.ReactNode;
  label: string;
  href: string;
  newTab?: boolean;
  hoverClassName?: string;
}

export default function IconButton({
  children,
  label,
  href,
  newTab = false,
  hoverClassName =
    "hover:border-green-400/50 hover:bg-green-500 hover:text-white",
}: IconButtonProps) {
  return (
    <a
      href={href}
      aria-label={label}
      target={
        newTab
          ? "_blank"
          : undefined
      }
      rel={
        newTab
          ? "noopener noreferrer"
          : undefined
      }
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-300 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071c18] ${hoverClassName}`}
    >
      {children}
    </a>
  );
}