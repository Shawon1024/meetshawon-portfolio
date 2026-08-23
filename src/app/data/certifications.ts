export interface Certification {
  title: string;
  provider: string;
  status: "Planned" | "In Progress" | "Completed";
  description: string;
  focus: string[];
  issueDate?: string;
  credentialId?: string;
  target?: string;
  credentialUrl?: string;
  certificateUrl?: string;
}

export const certifications: Certification[] = [
  {
    title: "Introduction to Cybersecurity",
    provider: "Cisco Networking Academy",
    status: "Completed",
    description:
      "An introductory cybersecurity course covering common threats, vulnerabilities, network defence, system safeguards, threat analysis, and cybersecurity administration.",
    focus: [
      "Cybersecurity fundamentals",
      "Network defence",
      "Threat analysis",
      "System safeguards",
    ],
    issueDate: "5 July 2026",
    credentialId: "95b0d26f-36d5-40c7-ad32-447bc348a301",
    credentialUrl:
      "https://www.credly.com/badges/b4fb0871-2e55-4045-9631-7654e4be464c",
    certificateUrl:
      "/certificates/cisco-introduction-to-cybersecurity.pdf",
  },
  {
    title: "Operating Systems Basics",
    provider: "Cisco Networking Academy",
    status: "Completed",
    description:
      "A foundational course exploring operating-system concepts, Windows and Linux environments, mobile operating systems, system configuration, and basic security practices.",
    focus: [
      "Windows",
      "Linux",
      "Mobile operating systems",
      "System security",
    ],
    issueDate: "31 July 2026",
    credentialId: "82d8b141-d410-4dfc-bfaa-101d546f6cf5",
    credentialUrl:
      "https://www.credly.com/badges/601e42b2-1038-41c8-99ec-d8ca60978433",
    certificateUrl:
      "/certificates/cisco-operating-systems-basics.pdf",
  },
  {
    title: "Computer Hardware Basics",
    provider: "Cisco Networking Academy",
    status: "Completed",
    description:
      "A practical introduction to computer hardware, component installation, laptops, mobile devices, connectivity, maintenance, and troubleshooting fundamentals.",
    focus: [
      "Computer hardware",
      "Laptops",
      "Mobile devices",
      "Troubleshooting",
    ],
    issueDate: "31 July 2026",
    credentialId: "e34c0c4b-0b51-4b1f-bcd0-325147333bab",
    credentialUrl:
      "https://www.credly.com/badges/56da98da-9c77-4f6a-8bdc-ceb9488461e6",
    certificateUrl:
      "/certificates/cisco-computer-hardware-basics.pdf",
  },
  {
    title: "Networking Basics",
    provider: "Cisco Networking Academy",
    status: "In Progress",
    description:
      "Developing foundational knowledge of network types, devices, media, protocols, IP addressing, connectivity, and how computer networks operate.",
    focus: [
      "Networking concepts",
      "Network devices",
      "Protocols",
      "IP connectivity",
    ],
    target: "Current NetAcad course",
  },
  {
    title: "Ethical Hacker",
    provider: "Cisco Networking Academy",
    status: "In Progress",
    description:
      "Developing practical offensive-security knowledge for identifying vulnerabilities, assessing systems, understanding attacker techniques, and applying ethical-hacking methodology.",
    focus: [
      "Ethical hacking",
      "Vulnerability assessment",
      "Offensive security",
      "Security methodology",
    ],
    target: "Current NetAcad course",
  },
  {
    title: "CompTIA Security+",
    provider: "CompTIA",
    status: "Planned",
    description:
      "A planned foundational cybersecurity certification covering threats, vulnerabilities, security architecture, operations, governance, risk, and incident response.",
    focus: [
      "Security fundamentals",
      "Threats and vulnerabilities",
      "Risk management",
      "Security operations",
    ],
    target: "Planned professional certification",
  },
  {
    title: "CompTIA Network+",
    provider: "CompTIA",
    status: "Planned",
    description:
      "A planned networking certification covering network infrastructure, protocols, operations, security, troubleshooting, and implementation.",
    focus: [
      "Networking concepts",
      "Infrastructure",
      "Network operations",
      "Troubleshooting",
    ],
    target: "Planned professional certification",
  },
];