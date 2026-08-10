import SkillsGrid from "../skills/SkillsGrid";
import SkillsCTA from "../skills/SkillsCTA";
import CurrentLearning from "../skills/CurrentLearning";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills & Technologies",
  description:
    "Explore Shawon's cybersecurity, ethical hacking, networking, Linux, secure infrastructure, software development, and technical skills.",

  alternates: {
    canonical: "/skills",
  },

  openGraph: {
    title: "Skills & Technologies",
    description:
      "Cybersecurity, ethical hacking, networking, Linux, secure infrastructure, software development, and technical skills.",
    url: "/skills",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Skills & Technologies",
    description:
      "Cybersecurity, ethical hacking, networking, Linux, infrastructure, and software development skills.",
  },
};

export default function SkillsPage() {
  return (
    <main>
      <section className="px-6 pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Technical Capability
          </p>

          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Skills &{" "}
            <span className="text-green-400">
              Technologies
            </span>
          </h1>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-green-400" />

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-300">
            A structured overview of the technical and professional skills I
            am developing through academic study, practical projects, home-lab
            work, and independent learning.
          </p>
        </div>
      </section>

      <SkillsGrid />
      <CurrentLearning />
      <SkillsCTA />
    </main>
  );
}