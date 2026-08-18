import {
  Code2,
  Network,
  Server,
  ShieldCheck,
  Target,
  Terminal,
  Users,
} from "lucide-react";
import type {
  LucideIcon,
} from "lucide-react";

import Container from "../components/Container";

interface MapNode {
  title: string;
  description: string;
  details: string;
  icon: LucideIcon;
}

const leftNodes: MapNode[] = [
  {
    title: "Security Fundamentals",
    description:
      "The principles behind secure systems and responsible security practice.",
    details:
      "Threats • Risk • Controls",
    icon: ShieldCheck,
  },
  {
    title: "Networking",
    description:
      "Understanding how systems communicate, connect, and expose services.",
    details:
      "TCP/IP • DNS • HTTPS",
    icon: Network,
  },
  {
    title: "Systems & Infrastructure",
    description:
      "The environments where security controls and technical services operate.",
    details:
      "Linux • VMs • Storage",
    icon: Server,
  },
];

const rightNodes: MapNode[] = [
  {
    title: "Programming & Automation",
    description:
      "Using development and scripting skills to build, test, and automate.",
    details:
      "Python • TypeScript • Next.js",
    icon: Code2,
  },
  {
    title: "Security Tools & Labs",
    description:
      "Developing practical knowledge through authorised technical exercises.",
    details:
      "Kali • Nmap • Wireshark",
    icon: Terminal,
  },
  {
    title: "Professional Skills",
    description:
      "Supporting technical work through communication and clear documentation.",
    details:
      "Analysis • Communication • Reporting",
    icon: Users,
  },
];

function SkillMapNode({
  node,
}: {
  node: MapNode;
}) {
  const Icon = node.icon;

  return (
    <article className="group relative rounded-2xl border border-white/10 bg-[var(--surface)]/80 p-5 shadow-xl backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-green-400/40">
      <div className="flex items-start gap-4">
        <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-green-400/15 bg-green-400/10 text-green-300 transition group-hover:bg-green-400/15">
          <Icon size={21} />
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-white">
            {node.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            {node.description}
          </p>

          <p className="mt-3 text-xs font-medium uppercase tracking-wider text-green-300/80">
            {node.details}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function SkillsMap() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 py-20">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-400/[0.04] blur-3xl" />

      <Container>
        <div className="relative mx-auto mb-14 max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Skills Ecosystem
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            How My Skills Connect
          </h2>

          <p className="mt-5 leading-7 text-gray-400">
            My development combines technical foundations, practical tools,
            infrastructure knowledge, and professional capabilities—all
            supporting my long-term direction in ethical hacking and
            penetration testing.
          </p>
        </div>

        <div className="relative mx-auto max-w-6xl">
          {/* Desktop connection map */}
          <svg
            viewBox="0 0 1000 520"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="skill-map-line"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor="#4ade80"
                  stopOpacity="0.15"
                />

                <stop
                  offset="50%"
                  stopColor="#4ade80"
                  stopOpacity="0.7"
                />

                <stop
                  offset="100%"
                  stopColor="#4ade80"
                  stopOpacity="0.15"
                />
              </linearGradient>
            </defs>

            {/* Left connections */}
            <path
              d="M 285 82 C 380 82, 385 260, 470 260"
              fill="none"
              stroke="url(#skill-map-line)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            <path
              d="M 285 260 L 470 260"
              fill="none"
              stroke="url(#skill-map-line)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            <path
              d="M 285 438 C 380 438, 385 260, 470 260"
              fill="none"
              stroke="url(#skill-map-line)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            {/* Right connections */}
            <path
              d="M 715 82 C 620 82, 615 260, 530 260"
              fill="none"
              stroke="url(#skill-map-line)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            <path
              d="M 715 260 L 530 260"
              fill="none"
              stroke="url(#skill-map-line)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            <path
              d="M 715 438 C 620 438, 615 260, 530 260"
              fill="none"
              stroke="url(#skill-map-line)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            <circle
              cx="500"
              cy="260"
              r="6"
              fill="#4ade80"
              className="animate-pulse"
            />
          </svg>

          <div className="relative flex flex-col gap-6 lg:grid lg:min-h-[520px] lg:grid-cols-[1fr_0.8fr_1fr] lg:items-center lg:gap-16">
            {/* Left side */}
            <div className="order-1 space-y-5">
              {leftNodes.map(
                (node) => (
                  <SkillMapNode
                    key={node.title}
                    node={node}
                  />
                ),
              )}
            </div>

            {/* Central goal */}
            <div className="order-3 flex items-center justify-center lg:order-2">
              <div className="relative w-full max-w-sm rounded-3xl border border-green-400/30 bg-green-400/[0.08] p-7 text-center shadow-2xl shadow-green-950/30 backdrop-blur-md">
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-green-400/[0.08] via-transparent to-green-400/[0.03]" />

                <div className="relative">
                  <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-green-400/30 bg-green-400/15 text-green-300 shadow-lg shadow-green-950/30">
                    <Target size={30} />
                  </div>

                  <p className="mt-5 text-xs font-medium uppercase tracking-[0.22em] text-green-400">
                    Career Direction
                  </p>

                  <h3 className="mt-3 text-2xl font-bold text-white">
                    Ethical Hacking & Penetration Testing
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-gray-300">
                    Building the knowledge, practical experience, and
                    professional judgement required for responsible security
                    testing.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="order-2 space-y-5 lg:order-3">
              {rightNodes.map(
                (node) => (
                  <SkillMapNode
                    key={node.title}
                    node={node}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}