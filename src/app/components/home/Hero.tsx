import Link from "next/link";
import { Code2, BriefcaseBusiness, Mail } from "lucide-react";
import Container from "../Container";
import IconButton from "../ui/IconButton";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center">
      <Container>

        <div className="max-w-3xl space-y-8">

          <p className="text-blue-500 text-lg">
            Hello, I am
          </p>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Shawon
        </h1>

        <h2 className="text-2xl md:text-3xl text-gray-300">
          Cybersecurity Student
          <br/>
          Ethical Hacking Enthusiast
          <br/>
          Infrastructure Builder
        </h2>

        <p className="max-w-2xl text-lg text-gray-400">
          Building secure systems, exploring ethical hacking,
          and documenting my cybersecurity journey through
          practical projects and research.
        </p>

        <div className="flex flex-wrap gap-4">

          <Link href="/projects" className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition">
            View Projects
          </Link>

          <Link href="/contact" className="rounded-xl bg-blue-600 border px-6 py-3 font-medium text-white hover:bg-blue-700 transition">
            Contact Me
          </Link>

        </div>

        <div className="flex gap-5 pt-4">
          <IconButton href="https://github.com/Shawon1024" label="GitHub">
            <Code2 size={28} />
          </IconButton>
          <IconButton href="https://www.linkedin.com/in/shawon1024/" label="LinkedIn">
            <BriefcaseBusiness size={28} />
          </IconButton>
          <IconButton href="mailto:contact@meetshawon.com" label="Mail">
            <Mail size={28} />
          </IconButton>
        </div>

        </div>
      </Container>
    </section>
  );
}
