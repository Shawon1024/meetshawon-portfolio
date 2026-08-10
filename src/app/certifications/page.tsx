import CertificationsGrid from "../certifications/CertificationsGrid";
import EducationSection from "../certifications/EducationSection";
import CertificationProgress from "../certifications/CertificationProgress";
import CertificationsCTA from "../certifications/CertificationsCTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Education & Certifications",
  description:
    "Explore Shawon's academic background, cybersecurity education, professional certifications, and ongoing technical development.",

  alternates: {
    canonical: "/certifications",
  },

  openGraph: {
    title: "Education & Certifications",
    description:
      "Academic background, cybersecurity education, professional certifications, and ongoing technical development.",
    url: "/certifications",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Education & Certifications",
    description:
      "Cybersecurity education, academic background, certifications, and professional development.",
  },
};

export default function CertificationsPage() {
  return (
    <main>
      {/* Page header */}
      <section className="px-6 pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Qualifications & Development
          </p>

          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Education &{" "}
            <span className="text-green-400">
              Certifications
            </span>
          </h1>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-green-400" />

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-300">
            My academic background, current postgraduate study, and planned
            professional certifications supporting my development toward a
            career in cybersecurity.
          </p>
        </div>
      </section>

      <EducationSection />
      <CertificationsGrid />
      <CertificationProgress />
      <CertificationsCTA />
    </main>
  );
}