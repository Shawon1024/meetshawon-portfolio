export interface Project {
  slug: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  status: "Completed" | "In Progress" | "Planned";
  featured: boolean;
  technologies: string[];
  highlights: string[];
  href: string;
}

export const projects: Project[] = [
  {
    slug: "private-cloud-infrastructure",
    title: "Self-Hosted Private Cloud Infrastructure",
    summary:
      "A production-style private cloud environment built around TrueNAS SCALE, ZFS, Nextcloud, Cloudflare, and secure remote access.",
    description:
      "This project explores secure storage, user isolation, remote access, DNS, HTTPS, backups, and infrastructure documentation through a self-hosted cloud platform.",
    image: "/projects/placeholder.png",
    status: "In Progress",
    featured: true,
    technologies: [
      "TrueNAS SCALE",
      "ZFS",
      "Nextcloud",
      "Cloudflare",
      "HTTPS",
    ],
    highlights: [
      "ZFS mirrored storage",
      "Individual user accounts",
      "Storage quotas",
      "Secure remote access",
      "Cloudflare DNS integration",
    ],
    href: "/projects/private-cloud-infrastructure",
  },
  {
    slug: "cybersecurity-home-lab",
    title: "Cybersecurity Home Lab",
    summary:
      "A practical environment for learning Linux, networking, virtualisation, vulnerability testing, and security tools.",
    description:
      "A dedicated lab environment designed for ethical hacking practice, security experiments, technical documentation, and structured cybersecurity learning.",
    image: "/projects/placeholder.png",
    status: "In Progress",
    featured: true,
    technologies: [
      "Kali Linux",
      "Virtual Machines",
      "Linux",
      "Networking",
      "Security Tools",
    ],
    highlights: [
      "Isolated virtual lab",
      "Linux administration practice",
      "Network security experiments",
      "Ethical hacking exercises",
      "Documented learning process",
    ],
    href: "/projects/cybersecurity-home-lab",
  },
  {
    slug: "professional-portfolio",
    title: "Professional Portfolio Platform",
    summary:
      "A modern portfolio built with Next.js, TypeScript, Tailwind CSS, GitHub, Cloudflare, and reusable UI components.",
    description:
      "A professional personal-brand platform designed to document projects, certifications, technical writing, and cybersecurity development.",
    image: "/projects/placeholder.png",
    status: "In Progress",
    featured: false,
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "GitHub",
      "Cloudflare",
    ],
    highlights: [
      "Responsive design",
      "Reusable components",
      "Professional branding",
      "SEO-ready structure",
      "Git-based workflow",
    ],
    href: "/projects/professional-portfolio",
  },
];
