interface IconButtonProps {
    children: React.ReactNode;
    label: string;
    href: string;
}

export default function IconButton({ children, label, href }: IconButtonProps) {
    return (
        <a href={href} aria-label={label} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-300 transition hover:bg-green-500 hover:text-white-400">
            {children}
        </a>
    );
}
