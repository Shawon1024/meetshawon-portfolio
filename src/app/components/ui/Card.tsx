interface CardProps {
    children: React.ReactNode;
}

export default function Card({ children }: CardProps) {
    return (
        <div className="rounded-2xl border border-white/10 bg-[var(--surface)] p-5 transition hover:border-green-400">
            {children}
        </div>
    );
}
