import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Shawon</Link>

      <div>
        <Link href="/about">About</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/certifications">Certifications</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </nav>
  );
}