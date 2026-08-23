import Container from "../components/Container";
import { certifications } from "../data/certifications";
import CertificationCard from "./CertificationCard";

const certificationGroups = [
  {
    status: "Completed",
    title: "Completed credentials",
    description:
      "Verified courses and credentials I have successfully completed.",
  },
  {
    status: "In Progress",
    title: "Currently studying",
    description:
      "Courses and structured training that I am actively completing.",
  },
  {
    status: "Planned",
    title: "Planned certifications",
    description:
      "Professional certifications included in my future development roadmap.",
  },
] as const;

export default function CertificationsGrid() {
  return (
    <section className="border-t border border-white/5 py-20">
      <Container>
        <div className="mb-14 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Credentials & Development
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Certifications and courses
          </h2>

          <p className="mt-5 leading-7 text-gray-400">
            A transparent record of my completed credentials, current
            technical study, and planned professional certifications.
          </p>
        </div>

        <div className="space-y-16">
          {certificationGroups.map((group) => {
            const matchingCertifications = certifications.filter(
              (certification) =>
                certification.status === group.status,
            );

            if (matchingCertifications.length === 0) {
              return null;
            }

            return (
              <section
                key={group.status}
                aria-labelledby={`certification-${group.status
                  .toLowerCase()
                  .replaceAll(" ", "-")}`}
              >
                <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h3
                      id={`certification-${group.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                      className="text-2xl font-semibold text-white"
                    >
                      {group.title}
                    </h3>

                    <p className="mt-2 text-gray-400">
                      {group.description}
                    </p>
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-400">
                    {matchingCertifications.length}{" "}
                    {matchingCertifications.length === 1
                      ? "item"
                      : "items"}
                  </span>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {matchingCertifications.map((certification) => (
                    <CertificationCard
                      key={certification.title}
                      certification={certification}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </Container>
    </section>
  );
}