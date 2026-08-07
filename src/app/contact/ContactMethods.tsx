import {
  BriefcaseBusiness,
  Clock3,
  Code2,
  Mail,
  MapPin,
} from "lucide-react";

const methods = [
  {
    title: "Email",
    value: "contact@meetshawon.com",
    href: "mailto:contact@meetshawon.com",
    icon: Mail,
  },
  {
    title: "LinkedIn",
    value: "linkedin.com/in/shawon1024",
    href: "https://www.linkedin.com/in/shawon1024/",
    icon: BriefcaseBusiness,
  },
  {
    title: "GitHub",
    value: "github.com/Shawon1024",
    href: "https://github.com/Shawon1024",
    icon: Code2,
  },
];

export default function ContactMethods() {
  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
        Contact Details
      </p>

      <h2 className="mt-3 text-3xl font-bold text-white">
        Ways to reach me
      </h2>

      <p className="mt-5 max-w-md leading-7 text-gray-400">
        Email is the best option for formal enquiries. LinkedIn and GitHub are
        also available for networking and reviewing my technical work.
      </p>

      <div className="mt-8 space-y-4">
        {methods.map((method) => {
          const Icon = method.icon;

          return (
            <a
              key={method.title}
              href={method.href}
              target={
                method.href.startsWith("http")
                  ? "_blank"
                  : undefined
              }
              rel={
                method.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-5 transition hover:border-green-400/50"
            >
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-green-300">
                <Icon size={22} />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-gray-400">
                  {method.title}
                </p>

                <p className="truncate font-medium text-white">
                  {method.value}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      <div className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-black/10 p-6">
        <div className="flex gap-3">
          <MapPin
            size={20}
            className="mt-0.5 shrink-0 text-green-400"
          />

          <div>
            <p className="font-medium text-white">
              Location
            </p>

            <p className="mt-1 text-gray-400">
              United Kingdom
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Clock3
            size={20}
            className="mt-0.5 shrink-0 text-green-400"
          />

          <div>
            <p className="font-medium text-white">
              Response time
            </p>

            <p className="mt-1 text-gray-400">
              Usually within two working days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}