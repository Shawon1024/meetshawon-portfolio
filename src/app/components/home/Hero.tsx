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
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-medium text-green-300">
              <span
                className="h-2 w-2 rounded-full bg-green-400"
                aria-hidden="true"
              />
              Available for Cybersecurity Graduate Roles
            </div>

            <h1 className="text-5xl font-bold leading-tight text-white md:text-6xl lg:text-5xl">
              Building
              <span className="text-green-400">
                {" "}
                Secure Infrastructure{" "}
              </span>
              & Cybersecurity Solutions
            </h1>

            <p className="max-w-2xl text-lg leading-8 text-gray-300">
              I&apos;m Md Samsudduha Shawon, a First-Class Computer Science
              graduate currently pursuing an MSc in Cyber Security Management
              with Professional Practice. I&apos;m developing practical
              capability across ethical hacking, network security, secure
              infrastructure, self-hosted services, and modern web
              technologies.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="/projects">
                View My Projects
              </Button>

              <Button href="/resume">
                View My Resume
              </Button>
            </div>

            <div className="flex gap-5 pt-4">
              <IconButton
                href="https://github.com/shawon1024"
                label="Open Md Samsudduha Shawon's GitHub profile"
                newTab
              >
                <Code2 size={28} aria-hidden="true" />
              </IconButton>

              <IconButton
                href="https://www.linkedin.com/in/shawon1024/"
                label="Open Md Samsudduha Shawon's LinkedIn profile"
                newTab
              >
                <BriefcaseBusiness
                  size={28}
                  aria-hidden="true"
                />
              </IconButton>

              <IconButton
                href="mailto:contact@meetshawon.com"
                label="Email Md Samsudduha Shawon"
              >
                <Mail size={28} aria-hidden="true" />
              </IconButton>
            </div>
          </div>

          <div className="hidden items-center justify-center lg:flex">
            <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[var(--surface)]/80 p-8 shadow-2xl backdrop-blur-sm">
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
                  <span
                    className="h-2 w-2 rounded-full bg-green-400"
                    aria-hidden="true"
                  />
                  Active
                </span>
              </div>

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
                    Security • Networks • Infrastructure
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-sm text-gray-400">
                    Current Development
                  </p>

                  <p className="mt-1 font-medium text-white">
                    Cybersecurity Study & Technical Projects
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-lg font-semibold text-green-400">
                    BSc
                  </p>

                  <p className="text-xs text-gray-400">
                    First-Class
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
                    3
                  </p>

                  <p className="text-xs text-gray-400">
                    Credentials
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