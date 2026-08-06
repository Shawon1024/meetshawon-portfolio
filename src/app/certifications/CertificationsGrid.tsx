import Container from "../components/Container";
import CertificationCard from "./CertificationCard";
import { certifications } from "../data/certifications";

export default function CertificationsGrid() {
  return (
    <section className="border-t border-white/5 py-20">
      <Container>
        <div className="mb-12 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Professional Development
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Certification Roadmap
          </h2>

          <p className="mt-5 leading-7 text-gray-400">
            These certifications represent my planned learning pathway.
            Statuses will be updated as I begin and complete each qualification.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {certifications.map((certification) => (
            <CertificationCard
              key={certification.title}
              certification={certification}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}