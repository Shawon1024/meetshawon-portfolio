import Link from "next/link";
import { Code2, BriefcaseBusiness, Mail } from "lucide-react";
import Container from "../Container";
import IconButton from "../ui/IconButton";
import Button from "../ui/Button";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-medium text-green-300">
              <span className="h-2 w-2 rounded-full bg-green-400"></span>Available for Cyber Security Graduate Roles
            </div>

            <h1 className="text-5xl font-bold leading-tight text-white md:text-6xl lg:text-5xl">
              Building<span className="text-green-400"> Secure Infrastructure </span>& Cybersecurity Solutions
            </h1>

            <p className="max-w-2xl text-lg leading-8 text-gray-300">
              I'm Shawon, an MSc Cyber Security Management student passionate about ethical hacking, enterprise infrastructure, self-hosted coud solutions, and modern web technologies. I enjoy building secure, scalable systems while continuously expanding my knowledge through hands-on projects.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="/projects">View My Projects</Button>
              <Button href="#">Download CV</Button>
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

          <div className="hidden lg:flex items-center justify-center">
            <div className="bg-[var(--surface)] border border-white/10 rounded-3xl w-96 h-96" />
          </div>
        </div>

      </Container>
    </section>
  );
}
