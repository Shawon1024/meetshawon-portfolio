import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Server,
  ShieldCheck,
} from "lucide-react";

import Container from "../Container";
import SectionHeading from "../ui/SectionHeading";

const developmentAreas = [
  {
    title:
      "Academic foundation",

    description:
      "First-Class BSc Computer Science graduate from the University of East London, completed in 2024.",

    icon:
      GraduationCap,
  },

  {
    title:
      "Cybersecurity direction",

    description:
      "Currently studying MSc Cyber Security Management with Professional Practice at The University of Law.",

    icon:
      ShieldCheck,
  },

  {
    title:
      "Practical development",

    description:
      "Applying technical knowledge through secure infrastructure, self-hosting, and documented engineering projects.",

    icon:
      Server,
  },
];

export default function AboutPreview() {
  return (
    <section className="relative overflow-hidden border-y border-white/5 py-20 md:py-24 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute -left-40 top-24 h-80 w-80 rounded-full bg-green-500/[0.04] blur-3xl" />

        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-green-400/[0.025] to-transparent" />
      </div>

      <Container>
        <div className="relative">
          <SectionHeading
            eyebrow="Professional Background"
            title="A practical path into cybersecurity"
            description="Building on a broad computing foundation through focused postgraduate study, verified technical learning, and hands-on infrastructure work."
          />

          <div className="grid items-stretch gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14 xl:gap-20">
            {/* Profile image */}

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-2 shadow-2xl shadow-black/20">
              <div className="relative min-h-[440px] overflow-hidden rounded-[1.15rem] sm:min-h-[520px] lg:h-full lg:min-h-[560px]">
                <Image
                  src="/images/shawon-profile.jpg"
                  alt="Md Samsudduha Shawon"
                  fill
                  sizes="(min-width: 1024px) 35vw, 100vw"
                  className="object-cover object-top"
                />

                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#061b17] via-transparent to-transparent"
                  aria-hidden="true"
                />

                <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                  <div className="rounded-2xl border border-white/10 bg-[#071c18]/85 p-5 shadow-xl backdrop-blur-md">
                    <p className="font-semibold text-white">
                      Md Samsudduha Shawon
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Cybersecurity postgraduate · London, United Kingdom
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional narrative */}

            <div className="flex flex-col justify-center">
              <p className="text-xl font-medium leading-8 text-white md:text-2xl md:leading-9">
                I&apos;m developing toward a career in cybersecurity by
                combining formal education with practical, documented
                technical work.
              </p>

              <p className="mt-5 max-w-3xl leading-7 text-gray-400">
                My interests centre on ethical hacking, network security,
                secure infrastructure, and responsible technology. I value
                methodical problem-solving, clear documentation, and building
                systems that can be understood, maintained, and improved.
              </p>

              <div className="mt-8 space-y-4">
                {developmentAreas.map(
                  (area) => {
                    const Icon =
                      area.icon;

                    return (
                      <div
                        key={
                          area.title
                        }
                        className="group rounded-2xl border border-white/10 bg-[var(--surface)]/60 p-5 transition duration-200 hover:border-green-400/30 hover:bg-[var(--surface)]"
                      >
                        <div className="flex items-start gap-4">
                          <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-green-400/10 bg-green-400/10 text-green-300 transition duration-200 group-hover:border-green-400/20 group-hover:bg-green-400/15">
                            <Icon
                              size={20}
                              aria-hidden="true"
                            />
                          </div>

                          <div>
                            <h3 className="font-semibold text-white">
                              {
                                area.title
                              }
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-400">
                              {
                                area.description
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>

              <div className="mt-8">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-green-400 transition hover:text-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]"
                >
                  Learn more about my journey

                  <ArrowRight
                    size={17}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}