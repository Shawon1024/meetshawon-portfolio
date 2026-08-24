import Link from "next/link";
import {
  ArrowRight,
  Award,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Server,
  ShieldCheck,
} from "lucide-react";

import Container from "../Container";
import IconButton from "../ui/IconButton";

function GitHubIcon({
  size = 21,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.426 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.866-.014-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.071 1.531 1.031 1.531 1.031.892 1.53 2.341 1.088 2.91.832.091-.647.349-1.088.635-1.338-2.221-.253-4.555-1.112-4.555-4.947 0-1.093.39-1.987 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.295 2.748-1.026 2.748-1.026.546 1.378.203 2.397.1 2.65.64.701 1.028 1.595 1.028 2.688 0 3.845-2.337 4.691-4.566 4.94.359.31.678.921.678 1.856 0 1.34-.012 2.421-.012 2.75 0 .268.18.58.688.481A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function LinkedInIcon({
  size = 21,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.049c.475-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286h-.004ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

const profileHighlights = [
  {
    label: "Current study",
    value: "MSc Cyber Security Management",
    detail: "The University of Law · 2026–2028",
    icon: GraduationCap,
  },
  {
    label: "Delivered infrastructure",
    value: "Self-Hosted Private Cloud",
    detail: "TrueNAS SCALE · ZFS · Secure remote access",
    icon: Server,
  },
  {
    label: "Verified development",
    value: "3 Cisco credentials",
    detail: "Cybersecurity · Operating systems · Hardware",
    icon: Award,
  },
];

export default function Hero() {
  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative overflow-hidden border-b border-white/5 py-20 md:py-24 lg:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute -left-40 top-10 h-80 w-80 rounded-full bg-green-500/[0.07] blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-cyan-500/[0.06] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/20 to-transparent" />
      </div>

      <Container>
        <div className="relative grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-medium text-green-300">
              <span
                className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.75)]"
                aria-hidden="true"
              />

              Open to Cybersecurity Graduate Opportunities
            </div>

            <h1
              id="home-hero-title"
              className="mt-7 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.75rem]"
            >
              Building secure systems through{" "}
              <span className="text-green-400">
                cybersecurity
              </span>{" "}
              and practical engineering
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-300">
              I&apos;m Md Samsudduha Shawon, a First-Class Computer Science
              graduate and current MSc Cyber Security Management student. I
              combine structured security study with hands-on infrastructure,
              self-hosting, and full-stack technical projects.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-black transition duration-200 hover:-translate-y-0.5 hover:bg-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              >
                Explore My Projects

                <ArrowRight
                  size={18}
                  aria-hidden="true"
                />
              </Link>

              <Link
                href="/resume"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:border-green-400/40 hover:bg-green-400/[0.06] hover:text-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              >
                <FileText
                  size={18}
                  aria-hidden="true"
                />

                View My Resume
              </Link>
            </div>

            <div className="mt-9 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin
                  size={18}
                  className="text-green-400"
                  aria-hidden="true"
                />

                London, United Kingdom
              </div>

              <div className="flex items-center gap-3">
                <span className="mr-1 text-sm text-gray-500">
                  Connect
                </span>

                <IconButton
                  href="https://github.com/shawon1024"
                  label="Open Md Samsudduha Shawon's GitHub profile"
                  newTab
                  hoverClassName="hover:border-white/30 hover:bg-[#181717] hover:text-white"
                >
                  <GitHubIcon />
                </IconButton>

                <IconButton
                  href="https://www.linkedin.com/in/shawon1024/"
                  label="Open Md Samsudduha Shawon's LinkedIn profile"
                  newTab
                  hoverClassName="hover:border-[#0A66C2]/70 hover:bg-[#0A66C2] hover:text-white"
                >
                  <LinkedInIcon />
                </IconButton>

                <IconButton
                  href="mailto:contact@meetshawon.com"
                  label="Email Md Samsudduha Shawon"
                  hoverClassName="hover:border-[#EA4335]/70 hover:bg-[#EA4335] hover:text-white"
                >
                  <Mail
                    size={21}
                    aria-hidden="true"
                  />
                </IconButton>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div
              className="pointer-events-none absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-green-400/10 via-transparent to-cyan-400/10 blur-2xl"
              aria-hidden="true"
            />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[var(--surface)]/80 shadow-2xl shadow-black/25 backdrop-blur-md">
              <div className="flex flex-col gap-5 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between md:p-7">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-green-400">
                    Professional Profile
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Evidence-led development
                  </h2>
                </div>

                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-xs font-semibold text-green-300">
                  <ShieldCheck
                    size={15}
                    aria-hidden="true"
                  />

                  Actively developing
                </span>
              </div>

              <div className="space-y-3 p-6 md:p-7">
                {profileHighlights.map((item) => {
                  const Icon =
                    item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex gap-4 rounded-2xl border border-white/10 bg-black/10 p-4 transition duration-200 hover:border-green-400/25 hover:bg-green-400/[0.03]"
                    >
                      <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                        <Icon
                          size={21}
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                          {item.label}
                        </p>

                        <p className="mt-1 font-semibold text-white">
                          {item.value}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-gray-400">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 border-t border-white/10">
                <div className="p-4 text-center md:p-5">
                  <p className="text-lg font-bold text-green-400">
                    First
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    BSc classification
                  </p>
                </div>

                <div className="border-x border-white/10 p-4 text-center md:p-5">
                  <p className="text-lg font-bold text-green-400">
                    Current
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    MSc study
                  </p>
                </div>

                <div className="p-4 text-center md:p-5">
                  <p className="text-lg font-bold text-green-400">
                    3
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Verified credentials
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