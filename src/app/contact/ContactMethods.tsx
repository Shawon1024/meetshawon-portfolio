import {
  Clock3,
  Mail,
  MapPin,
} from "lucide-react";

function GitHubIcon({
  size = 22,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.426 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.866-.014-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.071 1.531 1.031 1.531 1.031.892 1.53 2.341 1.088 2.91.832.091-.647.349-1.088.635-1.338-2.221-.253-4.555-1.112-4.555-4.947 0-1.093.39-1.987 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.295 2.748-1.026 2.748-1.026.546 1.378.203 2.397.1 2.65.64.701 1.028 1.595 1.028 2.688 0 3.845-2.337 4.691-4.566 4.94.359.31.678.921.678 1.856 0 1.34-.012 2.421-.012 2.75 0 .268.18.58.688.481A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function LinkedInIcon({
  size = 22,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.049c.475-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286h-.004ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

const methods = [
  {
    title:
      "Email",

    href:
      "mailto:contact@meetshawon.com",

    label:
      "Email Md Samsudduha Shawon",

    external:
      false,

    icon: (
      <Mail
        size={22}
        aria-hidden="true"
      />
    ),

    styles:
      "hover:border-[#EA4335]/60 hover:bg-[#EA4335]/10 hover:text-[#EA4335]",
  },

  {
    title:
      "LinkedIn",

    href:
      "https://www.linkedin.com/in/shawon1024/",

    label:
      "Open Md Samsudduha Shawon's LinkedIn profile",

    external:
      true,

    icon: (
      <LinkedInIcon />
    ),

    styles:
      "hover:border-[#0A66C2]/70 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]",
  },

  {
    title:
      "GitHub",

    href:
      "https://github.com/shawon1024",

    label:
      "Open Md Samsudduha Shawon's GitHub profile",

    external:
      true,

    icon: (
      <GitHubIcon />
    ),

    styles:
      "hover:border-white/25 hover:bg-[#181717] hover:text-white",
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
        Email is preferred for formal enquiries. You can also connect with me
        professionally or explore my technical work.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-3">
        {methods.map((method) => (
          <a
            key={method.title}
            href={method.href}
            target={
              method.external
                ? "_blank"
                : undefined
            }
            rel={
              method.external
                ? "noopener noreferrer"
                : undefined
            }
            aria-label={method.label}
            className={`group flex min-h-28 flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[var(--surface)]/70 px-3 py-4 text-gray-300 transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] ${method.styles}`}
          >
            <span className="transition duration-200 group-hover:scale-105">
              {method.icon}
            </span>

            <span className="text-sm font-medium">
              {method.title}
            </span>
          </a>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-black/10">
        <div className="flex gap-4 p-5">
          <MapPin
            size={21}
            className="mt-0.5 shrink-0 text-green-400"
            aria-hidden="true"
          />

          <div>
            <p className="font-medium text-white">
              London, United Kingdom
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-400">
              Available for suitable London-based, hybrid, and remote
              opportunities.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10" />

        <div className="flex gap-4 p-5">
          <Clock3
            size={21}
            className="mt-0.5 shrink-0 text-green-400"
            aria-hidden="true"
          />

          <div>
            <p className="font-medium text-white">
              Response time
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-400">
              Usually within two working days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}