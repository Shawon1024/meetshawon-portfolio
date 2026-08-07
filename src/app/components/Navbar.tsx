"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import Container from "../components/Container";

const links = [
  { name: "About", href: "/about" },
  { name: "Skills", href: "/skills" },
  { name: "Projects", href: "/projects" },
  { name: "Certifications", href: "/certifications" },
  { name: "Resume", href: "/resume" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#061A18]/80 backdrop-blur-md">

      <Container>

        <nav className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="felex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Shawon logo"
              width={50}
              height={50}
              className="rounded-lg"
            />
            <span className="text-xl font-semibold text-white">Shawon</span>
          </Link>


          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">

            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`transition ${
                  pathname === link.href
                    ? "text-green-400"
                    : "text-gray-300 hover:text-green-400"
                }`}
              >
                {link.name}
              </Link>
            ))}

          </div>


          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-300"
            aria-label="Toggle menu"
          >
            {open ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
          </button>

        </nav>


        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300
        ${
          open
          ? "max-h-96 opacity-100 pb-6"
          : "max-h-0 opacity-0"
        }
        `}
        >
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-gray-300 hover:text-green-400"
            >
              {link.name}
            </Link>
          ))}
        </div>

      </Container>

    </header>
  );
}