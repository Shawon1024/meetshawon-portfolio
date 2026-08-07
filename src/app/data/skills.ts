import {
  Code2,
  Network,
  Server,
  ShieldCheck,
  Terminal,
  Users,
} from "lucide-react";

export interface SkillItem {
  name: string;
  description: string;
}

export interface SkillCategory {
  title: string;
  description: string;
  icon: typeof ShieldCheck;
  skills: SkillItem[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Cybersecurity",
    description:
      "Core security concepts and practical areas supporting my ethical-hacking career direction.",
    icon: ShieldCheck,
    skills: [
      {
        name: "Ethical Hacking",
        description:
          "Authorised testing, enumeration, vulnerability identification, and responsible practice.",
      },
      {
        name: "Vulnerability Assessment",
        description:
          "Identifying, analysing, documenting, and prioritising security weaknesses.",
      },
      {
        name: "Security Fundamentals",
        description:
          "Threats, risks, controls, access management, defence in depth, and secure design.",
      },
      {
        name: "Packet Analysis",
        description:
          "Inspecting network traffic to understand protocols, behaviour, and suspicious activity.",
      },
    ],
  },
  {
    title: "Networking",
    description:
      "Skills related to communication between systems, network services, and secure connectivity.",
    icon: Network,
    skills: [
      {
        name: "TCP/IP",
        description:
          "Understanding addressing, ports, protocols, connections, and network communication.",
      },
      {
        name: "DNS",
        description:
          "Domain records, subdomains, name resolution, Cloudflare DNS, and routing concepts.",
      },
      {
        name: "Network Discovery",
        description:
          "Identifying hosts, ports, services, and network relationships in authorised labs.",
      },
      {
        name: "HTTPS & TLS",
        description:
          "Encrypted web communication, certificates, secure access, and service exposure.",
      },
    ],
  },
  {
    title: "Systems & Infrastructure",
    description:
      "Operating systems, storage, virtualisation, and self-hosted infrastructure.",
    icon: Server,
    skills: [
      {
        name: "Linux Administration",
        description:
          "Users, permissions, packages, services, logs, filesystems, and command-line workflows.",
      },
      {
        name: "Virtual Machines",
        description:
          "Creating isolated systems for security labs, testing, and controlled experiments.",
      },
      {
        name: "TrueNAS SCALE",
        description:
          "Storage management, applications, datasets, permissions, snapshots, and ZFS concepts.",
      },
      {
        name: "Nextcloud",
        description:
          "Private cloud storage, user accounts, quotas, file access, and secure remote use.",
      },
    ],
  },
  {
    title: "Programming & Development",
    description:
      "Languages and development tools used for automation, websites, and technical projects.",
    icon: Code2,
    skills: [
      {
        name: "Python",
        description:
          "Scripting, automation, basic tooling, data handling, and security-learning exercises.",
      },
      {
        name: "TypeScript",
        description:
          "Typed web development, component props, interfaces, and structured application data.",
      },
      {
        name: "Next.js",
        description:
          "App Router, routes, layouts, React components, images, and production web architecture.",
      },
      {
        name: "Tailwind CSS",
        description:
          "Responsive styling, reusable visual patterns, spacing systems, and interface design.",
      },
    ],
  },
  {
    title: "Tools & Platforms",
    description:
      "Platforms and utilities used across development, security labs, and infrastructure work.",
    icon: Terminal,
    skills: [
      {
        name: "Git & GitHub",
        description:
          "Version control, branches, commits, SSH authentication, remote repositories, and workflows.",
      },
      {
        name: "Kali Linux",
        description:
          "A security-focused Linux environment used for authorised lab exercises and learning.",
      },
      {
        name: "Nmap",
        description:
          "Host discovery, port scanning, service identification, and authorised network assessment.",
      },
      {
        name: "Wireshark",
        description:
          "Packet capture, protocol inspection, filtering, and network troubleshooting.",
      },
    ],
  },
  {
    title: "Professional Skills",
    description:
      "Transferable skills that support technical work and long-term professional development.",
    icon: Users,
    skills: [
      {
        name: "Technical Documentation",
        description:
          "Recording architecture, procedures, findings, problems, and lessons clearly.",
      },
      {
        name: "Problem Solving",
        description:
          "Breaking technical problems into smaller steps and testing solutions methodically.",
      },
      {
        name: "Communication",
        description:
          "Explaining technical ideas to both technical and non-technical audiences.",
      },
      {
        name: "Continuous Learning",
        description:
          "Building knowledge through projects, labs, research, reflection, and structured study.",
      },
    ],
  },
];