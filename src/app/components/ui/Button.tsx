import Link from "next/link";

interface ButtonProps { 
    children: React.ReactNode;
    href: string;
}

export default function Button({ children, href }: ButtonProps) {
    const styles = `
    inline-flex
    items-center
    justify-center
    rounded-xl
    bg-green-500
    px-6
    py-3
    font-medium
    text-black
    transition
    hover:bg-green-400
    `;

    if (href) {
        return (
            <Link href={href} className={styles}>
                {children}
            </Link>
        );
    }

    return (
        <button className={styles}>
            {children}
        </button>
    );
}
