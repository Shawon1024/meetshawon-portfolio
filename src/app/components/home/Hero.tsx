import {
  BriefcaseBusiness,
  Code2,
  Mail,
} from "lucide-react";

import Container from "../Container";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";

export default function Hero() {
  return (
    <section className="flex min-h-screen items-center py-16">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left side */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-medium text-green-300">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Available for Cyber Security Graduate Roles
            </div>

            <h1 className="text-5xl font-bold leading-tight text-white md:text-6xl lg:text-5xl">
              Building
              <span className="text-green-400">
                {" "}Secure Infrastructure{" "}
              </span>
              & Cybersecurity Solutions
            </h1>

            <p className="max-w-2xl text-lg leading-8 text-gray-300">
              I&apos;m Shawon, an MSc Cyber Security Management student
              passionate about ethical hacking, enterprise infrastructure,
              self-hosted cloud solutions, and modern web technologies. I
              enjoy building secure, scalable systems while continuously
              expanding my knowledge through hands-on projects.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="/projects">
                View My Projects
              </Button>

              <Button href="#">
                Download CV
              </Button>
            </div>

            <div className="flex gap-5 pt-4">
              <IconButton
                href="https://github.com/Shawon1024"
                label="GitHub"
                newTab
              >
                <Code2 size={28} />
              </IconButton>

              <IconButton
                href="https://www.linkedin.com/in/shawon1024/"
                label="LinkedIn"
                newTab
              >
                <BriefcaseBusiness size={28} />
              </IconButton>

              <IconButton
                href="mailto:contact@meetshawon.com"
                label="Email"
              >
                <Mail size={28} />
              </IconButton>
            </div>
          </div>

          {/* Right-side professional dashboard */}
          <div className="hidden items-center justify-center lg:flex">
            <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[var(--surface)]/80 p-8 shadow-2xl backdrop-blur-sm">
              {/* Dashboard header */}
              <div className="mb-8 flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm text-gray-400">
                    Professional Focus
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-white">
                    Cybersecurity & Technology
                  </h2>
                </div>

                <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-green-400/10 px-4 py-2.5 text-sm font-medium text-green-300">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  Active
                </span>
              </div>

              {/* Information cards */}
              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-sm text-gray-400">
                    Career Focus
                  </p>

                  <p className="mt-1 font-medium text-white">
                    Ethical Hacking & Cybersecurity
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-sm text-gray-400">
                    Technical Interests
                  </p>

                  <p className="mt-1 font-medium text-white">
                    Security • Networks • Cloud
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-sm text-gray-400">
                    Currently Building
                  </p>

                  <p className="mt-1 font-medium text-white">
                    Security Labs & Infrastructure
                  </p>
                </div>
              </div>

              {/* Statistics */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-lg font-semibold text-green-400">
                    BSc
                  </p>

                  <p className="text-xs text-gray-400">
                    Graduate
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-lg font-semibold text-green-400">
                    MSc
                  </p>

                  <p className="text-xs text-gray-400">
                    Current
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-lg font-semibold text-green-400">
                    LAB
                  </p>

                  <p className="text-xs text-gray-400">
                    Hands-on
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}