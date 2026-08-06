"use client";

import Link from "next/link";
import { ArrowUp, BriefcaseBusiness, Code2, Mail } from "lucide-react";
import Container from "./Container";
import IconButton from "./ui/IconButton";

const footerLinks = [
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Certifications", href: "/certifications" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
]

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/10 bg-[var(--surface)]/40">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-semibold text-white">Shawon</Link>
            <p className="max-w-sm leading-7 text-gray-400">Cybersecurity student and infrastructure builder focused onethical hacking, secure systems, self-hosting, and practical technology projects.</p>

            <div className="flex gap-3">
              <IconButton href="https://github.com/Shawon1024" newTab label="GitHub"><Code2 size={19} /></IconButton>

              <IconButton href="https://www.linkedin.com/in/shawon1024/" newTab label="LinkedIn"><BriefcaseBusiness size={19} /></IconButton>

              <IconButton href="mailto:contact@meetshawon.com" label="Email"><Mail size={19} /></IconButton>
            </div>
          </div>

          <div>
            <h2 className="mb-5 font-semibold text-white">Navigation</h2>

            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <Link key={link.name} href={link.href} className="w-fit text-gray-400 transition hover:text-green-400">{link.name}</Link>
              ))}
            </nav>
          </div>

          <div className="md:text-right">
            <h2 className="mb-5 font-semibold text-white">Let&apos;s work together</h2>

            <p className="mb-6 leading-7 text-gray-400">Open to cybersecurity graduate opportunities, technical collaboration, and professional networking.</p>

            <Link href="/contact" className="inline-flex rounded-xl bg-green-500 px-5 py-3 font-medium text-black transition hover:bg-green-400">
              Contact Me
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright © {new Date().getFullYear()} Shawon. All rights reserved.</p>

          <button type="button" onClick={scrollToTop} className="inline-flex w-fit items-center gap-2 transition hover:text-green-400" aria-label="Back to top">
            Back to top<ArrowUp size={16} />
          </button>
        </div>
      </Container>
    </footer>
  );
}