interface BadgeProps {
    children: React.ReactNode;
}

export default function Badge({ children }: BadgeProps) {
    return (
        <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-green-300">
            {children}
        </span>
    );
}
