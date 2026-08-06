interface IconButtonProps {
    children: React.ReactNode;
    label: string;
    href: string;
    newTab?: boolean;
}

export default function IconButton({ children, label, href, newTab = false }: IconButtonProps) {
    return (
        <a href={href} aria-label={label} target={newTab ? "_blank" : undefined} rel={newTab ? "noopener noreferrer" : undefined} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-300 transition hover:bg-green-500 hover:text-white-400">
            {children}
        </a>
    );
}
