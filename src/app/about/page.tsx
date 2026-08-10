import Journey from "../components/about/Journey";
import InterestsValues from "../components/about/InterestsValues";
import AboutCTA from "../components/about/AboutCTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Shawon's cybersecurity journey, ethical hacking interests, secure infrastructure projects, technical development, and professional goals.",

  alternates: {
    canonical: "/about",
  },

  openGraph: {
    title: "About Shawon",
    description:
      "Learn about Shawon's cybersecurity journey, ethical hacking interests, secure infrastructure projects, technical development, and professional goals.",
    url: "/about",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "About Shawon",
    description:
      "Cybersecurity, ethical hacking, secure infrastructure, technical development, and professional goals.",
  },
};

export default function About() {
  return (
    <main>
      {/* About Header */}
      <section className="px-6 pb-20 pt-16 md:pb-24 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">

          {/* Small label */}
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Get to know me
          </p>

          {/* Main heading */}
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            About{" "}
            <span className="text-green-400">
              Me
            </span>
          </h1>

          {/* Decorative line */}
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-green-400" />

          {/* Introduction */}
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-300">
            Cybersecurity student passionate about{" "}
            <span className="font-medium text-white">
              ethical hacking
            </span>
            , secure infrastructure, and security research. I enjoy learning
            through hands-on projects and continuously developing my technical
            skills.
          </p>

        </div>
      </section>

      <Journey />

      <InterestsValues />

      <AboutCTA />
    </main>
  );
}
