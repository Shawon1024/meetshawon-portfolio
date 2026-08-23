import type { Metadata } from "next";

import CertificationProgress from "./CertificationProgress";
import CertificationsCTA from "./CertificationsCTA";
import CertificationsGrid from "./CertificationsGrid";
import EducationSection from "./EducationSection";

export const metadata: Metadata = {
  title: "Education & Certifications",
  description:
    "Explore Md Samsudduha Shawon's academic background, verified Cisco Networking Academy credentials, current cybersecurity training, and planned CompTIA certifications.",

  alternates: {
    canonical: "/certifications",
  },

  openGraph: {
    title: "Education & Certifications",
    description:
      "Academic qualifications, verified technical credentials, current cybersecurity training, and professional certification development.",
    url: "/certifications",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Education & Certifications",
    description:
      "Academic qualifications, verified Cisco credentials, cybersecurity training, and planned professional certifications.",
  },
};

export default function CertificationsPage() {
  return (
    <main>
      <section className="px-6 pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Qualifications & Development
          </p>

          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Education &{" "}
            <span className="text-green-400">Certifications</span>
          </h1>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-green-400" />

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-300">
            My academic qualifications, verified technical credentials,
            current cybersecurity training, and planned professional
            certifications supporting my continued development.
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