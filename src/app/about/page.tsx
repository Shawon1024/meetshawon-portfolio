import type { Metadata } from "next";

import AboutCTA from "../components/about/AboutCTA";
import InterestsValues from "../components/about/InterestsValues";
import Journey from "../components/about/Journey";

export const metadata: Metadata = {
  title: "About Md Samsudduha Shawon",
  description:
    "Learn about Md Samsudduha Shawon's academic journey, cybersecurity interests, practical projects, professional values, and goal of building a career in ethical hacking and penetration testing.",

  alternates: {
    canonical: "/about",
  },

  openGraph: {
    title: "About Shawon",
    description:
      "Computer Science graduate and MSc Cyber Security Management student developing practical skills in ethical hacking, penetration testing, secure infrastructure, and cybersecurity.",
    url: "/about",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "About Shawon",
    description:
      "Computer Science graduate and cybersecurity postgraduate developing practical skills in ethical hacking, penetration testing, and secure infrastructure.",
  },
};

export default function About() {
  return (
    <main>
      {/* About header */}
      <section className="px-6 pb-20 pt-16 md:pb-24 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Get to know me
          </p>

          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            About{" "}
            <span className="text-green-400">
              Me
            </span>
          </h1>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-green-400" />

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-300">
            I am a Computer Science graduate and MSc Cyber Security Management
            student working toward a career in{" "}
            <span className="font-medium text-white">
              ethical hacking and penetration testing
            </span>
            . I develop my skills through academic study, hands-on security
            labs, self-hosted infrastructure, and practical technical projects.
          </p>

          <p className="mx-auto mt-5 max-w-3xl leading-8 text-gray-400">
            My interests include identifying and understanding
            vulnerabilities, securing systems and networks, managing
            cybersecurity risk, and communicating technical findings clearly
            and responsibly.
          </p>
        </div>
      </section>

      <Journey />

      <InterestsValues />

      <AboutCTA />
    </main>
  );
}