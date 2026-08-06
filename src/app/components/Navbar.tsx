import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6">
      <Link
        href="/"
        className="text-xl font-bold"
      >
        Shawon
      </Link>

      <div className="flex gap-6">
        <Link href="/about">About</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/certifications">
          Certifications
        </Link>
        <Link href="/blog">
          Blog
        </Link>
        <Link href="/contact">
          Contact
        </Link>
      </div>
    </nav>
  );
}