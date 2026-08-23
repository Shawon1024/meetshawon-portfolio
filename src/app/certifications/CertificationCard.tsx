import {
  Award,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  Target,
} from "lucide-react";

import Badge from "../components/ui/Badge";
import type { Certification } from "../data/certifications";

interface CertificationCardProps {
  certification: Certification;
}

export default function CertificationCard({
  certification,
}: CertificationCardProps) {
  const statusStyles: Record<Certification["status"], string> = {
    Completed: "border-green-400/20 bg-green-400/10 text-green-300",
    "In Progress":
      "border-amber-400/20 bg-amber-400/10 text-amber-300",
    Planned: "border-white/10 bg-white/5 text-gray-300",
  };

  const StatusIcon =
    certification.status === "Completed"
      ? CheckCircle2
      : certification.status === "In Progress"
        ? Clock3
        : Target;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-green-400/50">
      <div className="flex items-start justify-between gap-4">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
          <Award size={22} aria-hidden="true" />
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
            statusStyles[certification.status]
          }`}
        >
          <StatusIcon size={13} aria-hidden="true" />
          {certification.status}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-semibold text-white">
        {certification.title}
      </h3>

      <p className="mt-2 text-sm font-medium text-green-300">
        {certification.provider}
      </p>

      <p className="mt-4 leading-7 text-gray-400">
        {certification.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {certification.focus.map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
      </div>

      {(certification.issueDate || certification.credentialId) && (
        <dl className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
          {certification.issueDate && (
            <div className="flex items-start gap-3">
              <CalendarDays
                className="mt-0.5 shrink-0 text-green-400"
                size={16}
                aria-hidden="true"
              />

              <div>
                <dt className="text-gray-500">Issued</dt>
                <dd className="mt-0.5 text-gray-300">
                  {certification.issueDate}
                </dd>
              </div>
            </div>
          )}

          {certification.credentialId && (
            <div>
              <dt className="text-gray-500">Certificate ID</dt>
              <dd className="mt-1 break-all text-gray-300">
                {certification.credentialId}
              </dd>
            </div>
          )}
        </dl>
      )}

      <div className="mt-auto pt-6">
        {(certification.credentialUrl ||
          certification.certificateUrl) && (
          <div className="flex flex-wrap gap-x-5 gap-y-3 border-t border-white/10 pt-5">
            {certification.credentialUrl && (
              <a
                href={certification.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-green-400 transition hover:text-green-300"
                aria-label={`Verify ${certification.title} credential`}
              >
                Verify credential
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            )}

            {certification.certificateUrl && (
              <a
                href={certification.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-green-400 transition hover:text-green-300"
                aria-label={`View ${certification.title} certificate PDF`}
              >
                View certificate
                <FileText size={15} aria-hidden="true" />
              </a>
            )}
          </div>
        )}

        {certification.target && (
          <p className="mt-5 text-sm text-gray-500">
            Development stage: {certification.target}
          </p>
        )}
      </div>
    </article>
  );
}