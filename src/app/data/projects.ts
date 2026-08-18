export interface Project {
  slug: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  status:
    | "Completed"
    | "Active"
    | "In Progress"
    | "Planned";
  featured: boolean;
  technologies: string[];
  highlights: string[];
  href: string;
}

export const projects: Project[] = [
  {
    slug:
      "professional-portfolio",

    title:
      "Professional Portfolio Platform",

    summary:
      "A production-deployed cybersecurity portfolio and community platform with authentication, role-based access, blogging, moderation, monitoring, and a private Drive gateway.",

    description:
      "A full-stack professional platform built to showcase projects, skills, qualifications, and technical writing while demonstrating secure application architecture, operational monitoring, and production deployment.",

    image:
      "/projects/placeholder.jpg",

    status:
      "Active",

    featured:
      true,

    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Vercel",
      "Cloudflare",
      "Sentry",
    ],

    highlights: [
      "Authentication and user profiles",
      "Role-based admin and moderation",
      "Blog and community features",
      "Private Drive authentication gateway",
      "Production monitoring and backups",
    ],

    href:
      "/projects/professional-portfolio",
  },

  {
    slug:
      "private-cloud-infrastructure",

    title:
      "Self-Hosted Private Cloud Infrastructure",

    summary:
      "An in-progress NAS and private-cloud project combining dedicated hardware, TrueNAS SCALE, mirrored-storage planning, secure user access, and a custom Drive subdomain.",

    description:
      "A developing self-hosted infrastructure project focused on reliable storage, user separation, remote access, DNS, HTTPS, documentation, and eventual private-cloud file services.",

    image:
      "/projects/placeholder.jpg",

    status:
      "In Progress",

    featured:
      true,

    technologies: [
      "TrueNAS SCALE",
      "ZFS",
      "Nextcloud",
      "Cloudflare",
      "HTTPS",
    ],

    highlights: [
      "Dedicated NAS hardware",
      "Build awaiting remaining parts",
      "Two-drive mirror planned",
      "Role-protected Drive gateway",
      "Live NAS integration planned",
    ],

    href:
      "/projects/private-cloud-infrastructure",
  },

  {
    slug:
      "cybersecurity-home-lab",

    title:
      "Cybersecurity Home Lab",

    summary:
      "A developing lab environment for structured learning in Linux, networking, virtualisation, security tools, and authorised ethical-hacking exercises.",

    description:
      "A dedicated learning environment designed for controlled cybersecurity practice, technical experiments, documentation, and the gradual development of practical security skills.",

    image:
      "/projects/placeholder.jpg",

    status:
      "In Progress",

    featured:
      true,

    technologies: [
      "Kali Linux",
      "Virtual Machines",
      "Linux",
      "Networking",
      "Nmap",
      "Wireshark",
    ],

    highlights: [
      "Dedicated practice workstation",
      "Isolated virtual-lab design",
      "Linux and networking development",
      "Authorised security exercises planned",
      "Documented learning process",
    ],

    href:
      "/projects/cybersecurity-home-lab",
  },
];