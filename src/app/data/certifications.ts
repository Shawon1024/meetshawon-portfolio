export interface Certification {
  title: string;
  provider: string;
  status: "Planned" | "In Progress" | "Completed";
  description: string;
  focus: string[];
  target?: string;
  credentialUrl?: string;
  certificateUrl?: string;
}

export const certifications: Certification[] = [
  {
    title: "CompTIA Security+",
    provider: "CompTIA",
    status: "Planned",
    description:
      "A foundational cybersecurity certification covering threats, vulnerabilities, security architecture, operations, governance, risk, and incident response.",
    focus: [
      "Security fundamentals",
      "Threats and vulnerabilities",
      "Risk management",
      "Security operations",
    ],
    target: "Foundation certification",
  },
  {
    title: "CompTIA Network+",
    provider: "CompTIA",
    status: "Planned",
    description:
      "A networking certification covering infrastructure, protocols, troubleshooting, network operations, and security fundamentals.",
    focus: [
      "Networking concepts",
      "Infrastructure",
      "Network operations",
      "Troubleshooting",
    ],
    target: "Networking foundation",
  },
  {
    title: "eJPT",
    provider: "INE Security",
    status: "Planned",
    description:
      "A practical entry-level penetration-testing certification focused on methodology, network assessment, web testing, and hands-on exploitation fundamentals.",
    focus: [
      "Penetration testing",
      "Network assessment",
      "Web security",
      "Practical reporting",
    ],
    target: "Practical offensive security",
  },
  {
    title: "PNPT",
    provider: "TCM Security",
    status: "Planned",
    description:
      "A practical penetration-testing certification emphasising real-world assessment methodology, reporting, and professional communication.",
    focus: [
      "External assessment",
      "Active Directory",
      "Reporting",
      "Professional presentation",
    ],
    target: "Intermediate practical goal",
  },
  {
    title: "OSCP",
    provider: "OffSec",
    status: "Planned",
    description:
      "A long-term practical offensive-security objective involving penetration testing, exploitation, enumeration, and technical reporting.",
    focus: [
      "Enumeration",
      "Exploitation",
      "Privilege escalation",
      "Technical reporting",
    ],
    target: "Long-term goal",
  },
];