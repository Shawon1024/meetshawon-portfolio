import type { ReactNode } from "react";
import Link from "next/link";

interface ButtonProps {
  children: ReactNode;
  href: string;
}

export default function Button({
  children,
  href,
}: ButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400"
    >
      {children}
    </Link>
  );
}