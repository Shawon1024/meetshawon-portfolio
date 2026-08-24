import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Network,
  ShieldCheck,
} from "lucide-react";

import Container from "../Container";

const opportunityTypes = [
  {
    title:
      "Graduate opportunities",

    description:
      "Cybersecurity, infrastructure, and technology-focused graduate roles.",

    icon:
      BriefcaseBusiness,
  },

  {
    title:
      "Professional networking",

    description:
      "Conversations with cybersecurity professionals, recruiters, and technical teams.",

    icon:
      Network,
  },

  {
    title:
      "Technical collaboration",

    description:
      "Structured projects involving secure systems, infrastructure, or web technology.",

    icon:
      ShieldCheck,
  },
];

export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden py-20 md:py-24 lg:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[var(--surface)]/75 px-6 py-10 shadow-2xl shadow-black/15 md:px-10 md:py-12 lg:px-14 lg:py-14">
          {/* Decorative background */}

          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />

            <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-3xl" />

            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/60 to-transparent" />
          </div>

          <div className="relative">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
              {/* Main message */}

              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-green-300">
                  <span
                    className="h-2 w-2 rounded-full bg-green-400"
                    aria-hidden="true"
                  />

                  Open to professional opportunities
                </div>

                <h2 className="mt-6 max-w-2xl text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-[2.75rem] lg:leading-tight">
                  Let&apos;s discuss where I could contribute and continue
                  developing.
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 md:text-lg md:leading-8">
                  I&apos;m interested in connecting with organisations and
                  professionals working across cybersecurity, secure
                  infrastructure, technology, and practical engineering.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 text-sm font-semibold text-black transition duration-200 hover:bg-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d2924]"
                  >
                    Start a conversation

                    <ArrowRight
                      size={17}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>

                  <Link
                    href="/resume"
                    className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition duration-200 hover:border-white/20 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                  >
                    View my resume
                  </Link>
                </div>

                <p className="mt-5 text-sm leading-6 text-gray-500">
                  Email is preferred for formal enquiries. I usually respond
                  within two working days.
                </p>
              </div>

              {/* Opportunity types */}

              <div className="space-y-3">
                {opportunityTypes.map(
                  (opportunity) => {
                    const Icon =
                      opportunity.icon;

                    return (
                      <div
                        key={
                          opportunity.title
                        }
                        className="group rounded-2xl border border-white/10 bg-black/10 p-5 transition duration-200 hover:border-green-400/25 hover:bg-black/15"
                      >
                        <div className="flex items-start gap-4">
                          <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-green-400/15 bg-green-400/10 text-green-300 transition duration-200 group-hover:border-green-400/25 group-hover:bg-green-400/15">
                            <Icon
                              size={20}
                              aria-hidden="true"
                            />
                          </div>

                          <div>
                            <h3 className="font-semibold text-white">
                              {
                                opportunity.title
                              }
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-400">
                              {
                                opportunity.description
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}