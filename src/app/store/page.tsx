import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  GraduationCap,
  HardDrive,
  LockKeyhole,
  MonitorCog,
  Package,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import Container from "../components/Container";

export const metadata: Metadata = {
  title: "Digital Store",
  description:
    "Practical digital templates, planners, checklists, and documentation packs for technology projects, PC builds, home labs, private cloud infrastructure, and cybersecurity learning.",
  alternates: {
    canonical: "https://store.meetshawon.com",
  },
  openGraph: {
    type: "website",
    url: "https://store.meetshawon.com",
    title: "Digital Store — Meet Shawon",
    description:
      "Practical, carefully structured resources for technical projects, PC builds, infrastructure, and cybersecurity learning.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Store — Meet Shawon",
    description:
      "Templates, planners, checklists, and documentation packs for practical technology work.",
  },
};

interface DigitalProduct {
  title: string;
  summary: string;
  price: string;
  format: string;
  audience: string;
  items: string[];
  icon: LucideIcon;
  featured?: boolean;
}

const products: DigitalProduct[] = [
  {
    title: "PC Build Planner & Inventory Dashboard",
    summary:
      "Plan a complete PC build, track purchases and warranties, record testing results, and calculate resale profit or loss in one organised workbook.",
    price: "£9",
    format: "Excel workbook",
    audience: "PC builders, enthusiasts and resellers",
    items: [
      "Build budget and component tracker",
      "Compatibility and testing checklists",
      "Warranty, upgrade and resale dashboard",
    ],
    icon: MonitorCog,
    featured: true,
  },
  {
    title: "Technical Project Documentation Kit",
    summary:
      "Turn practical work into clear, professional documentation suitable for portfolios, GitHub repositories, handovers, and technical reviews.",
    price: "£12",
    format: "Word, Markdown and PDF",
    audience: "Students, graduates and technical builders",
    items: [
      "Architecture and implementation templates",
      "Testing and troubleshooting records",
      "Portfolio case study and README formats",
    ],
    icon: FileText,
    featured: true,
  },
  {
    title: "Cybersecurity Learning & Project Tracker",
    summary:
      "Structure your learning, certifications, practical labs, evidence, and career development without losing sight of your long-term goals.",
    price: "£9",
    format: "Excel and printable PDF",
    audience: "Cybersecurity learners and career changers",
    items: [
      "Weekly learning and certification planner",
      "Lab activity and evidence tracker",
      "Skills, projects and application dashboard",
    ],
    icon: GraduationCap,
  },
  {
    title: "TrueNAS Operations & Maintenance Pack",
    summary:
      "Document storage, users, permissions, backups, maintenance, and recovery procedures for a safer and more manageable home NAS.",
    price: "£15",
    format: "Word, Excel and PDF",
    audience: "Home NAS and private-cloud owners",
    items: [
      "Dataset and permission planning matrix",
      "Drive health and maintenance logs",
      "Backup and recovery documentation",
    ],
    icon: HardDrive,
  },
  {
    title: "Cybersecurity Home Lab Starter Pack",
    summary:
      "Plan an isolated, documented learning environment for virtual machines, networking exercises, snapshots, and authorised security practice.",
    price: "£19",
    format: "Word, Excel and PDF",
    audience: "Beginner and intermediate home-lab builders",
    items: [
      "Hardware, VM and IP planning sheets",
      "Lab safety and isolation checklist",
      "Snapshot, backup and progress records",
    ],
    icon: ShieldCheck,
  },
  {
    title: "Professional Portfolio Content Kit",
    summary:
      "Prepare the written content and evidence needed for a credible technical portfolio before beginning the website build.",
    price: "£7",
    format: "Word and fillable PDF",
    audience: "Students, graduates and junior professionals",
    items: [
      "Biography and About-page prompts",
      "Project case-study framework",
      "Skills, credentials and launch checklist",
    ],
    icon: Package,
  },
];

const benefits = [
  {
    title: "Practical by design",
    description:
      "Every resource is structured around real tasks, records, and decisions—not generic filler.",
    icon: CheckCircle2,
  },
  {
    title: "Instant digital delivery",
    description:
      "Completed products will be delivered as clearly organised downloadable files after checkout.",
    icon: Download,
  },
  {
    title: "Secure purchasing",
    description:
      "Checkout and file delivery will use established payment and download providers when the store launches.",
    icon: LockKeyhole,
  },
  {
    title: "Versioned updates",
    description:
      "Product pages will show the current version and update date so buyers know exactly what they receive.",
    icon: RefreshCw,
  },
];

const frequentlyAskedQuestions = [
  {
    question: "Are these physical products?",
    answer:
      "No. Every item is a digital download. Nothing will be posted or shipped to you.",
  },
  {
    question: "Can I share or resell the files?",
    answer:
      "No. A purchase will provide a personal-use licence unless the individual product page explicitly states otherwise. Redistribution, resale, and public uploading will not be permitted.",
  },
  {
    question: "Are the cybersecurity resources training courses?",
    answer:
      "No. They are independent planning, documentation, and progress-tracking resources. They do not replace formal education, professional advice, or authorised hands-on training.",
  },
  {
    question: "Will the templates work on macOS and Windows?",
    answer:
      "The product page will list supported software and formats before purchase. Common formats will include PDF, DOCX, XLSX, and Markdown where appropriate.",
  },
];

export default function StorePage() {
  return (
    <main>
      <section className="px-6 pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-medium text-green-300">
            <Sparkles size={16} aria-hidden="true" />
            Digital products in development
          </div>

          <p className="mb-4 mt-7 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Digital Store
          </p>

          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Build, document and learn with
            <span className="text-green-400"> better systems</span>
          </h1>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-green-400" />

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-300">
            Carefully structured templates, planners, checklists, and
            documentation packs for technical projects, PC builds,
            infrastructure, and cybersecurity development.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-black transition hover:bg-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
            >
              Browse Resources
              <ArrowRight size={18} aria-hidden="true" />
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 px-6 py-3 font-medium text-white transition hover:border-green-400/40 hover:text-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
            >
              Suggest a Resource
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-white/[0.015] py-12">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-white/10 bg-[var(--surface)]/55 p-5"
                >
                  <Icon
                    size={22}
                    className="text-green-300"
                    aria-hidden="true"
                  />
                  <h2 className="mt-4 font-semibold text-white">
                    {benefit.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section id="products" className="scroll-mt-28 py-20">
        <Container>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Product Collection
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                Useful tools for practical work
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                The collection is being developed and tested before release.
                Prices shown are planned launch prices and may change before
                checkout becomes available.
              </p>
            </div>

            <span className="w-fit rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-200">
              Store launch coming soon
            </span>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => {
              const Icon = product.icon;

              return (
                <article
                  key={product.title}
                  className={`relative flex h-full flex-col overflow-hidden rounded-3xl border bg-[var(--surface)]/70 p-6 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl md:p-7 ${
                    product.featured
                      ? "border-green-400/25"
                      : "border-white/10 hover:border-green-400/20"
                  }`}
                >
                  {product.featured && (
                    <span className="absolute right-5 top-5 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-green-300">
                      Recommended
                    </span>
                  )}

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-green-400/15 bg-green-400/10 text-green-300">
                    <Icon size={23} aria-hidden="true" />
                  </div>

                  <div className="mt-6 flex items-start justify-between gap-4">
                    <h3 className="max-w-[15rem] text-xl font-bold leading-7 text-white">
                      {product.title}
                    </h3>
                    <p className="shrink-0 text-2xl font-bold text-green-300">
                      {product.price}
                    </p>
                  </div>

                  <p className="mt-4 leading-7 text-gray-400">
                    {product.summary}
                  </p>

                  <dl className="mt-5 grid gap-3 border-y border-white/10 py-5 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-gray-500">Format</dt>
                      <dd className="text-right text-gray-300">
                        {product.format}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-gray-500">Best for</dt>
                      <dd className="max-w-[13rem] text-right text-gray-300">
                        {product.audience}
                      </dd>
                    </div>
                  </dl>

                  <ul className="mt-5 space-y-3">
                    {product.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-6 text-gray-300"
                      >
                        <CheckCircle2
                          size={17}
                          className="mt-1 shrink-0 text-green-400"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-7">
                    <span className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-black/10 px-5 py-3 text-sm font-semibold text-gray-400">
                      Coming Soon
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-y border-white/5 bg-white/[0.015] py-20">
        <Container>
          <div className="grid gap-8 rounded-3xl border border-green-400/15 bg-gradient-to-br from-green-400/[0.09] via-[var(--surface)]/75 to-cyan-400/[0.05] p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-400/10 text-green-300">
                <Package size={23} aria-hidden="true" />
              </div>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-green-400">
                Complete Toolkit Bundle
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                One organised collection for your technical journey
              </h2>
              <p className="mt-4 max-w-3xl leading-7 text-gray-300">
                The planned bundle will combine the most useful planning,
                documentation, learning, and tracking resources at a lower
                price than purchasing them individually.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/15 p-6 text-center md:min-w-52">
              <p className="text-sm text-gray-400">Planned bundle price</p>
              <p className="mt-2 text-4xl font-bold text-green-300">£29</p>
              <p className="mt-2 text-xs uppercase tracking-wider text-gray-500">
                Coming soon
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Questions
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                Before you download
              </h2>
            </div>

            <div className="mt-10 space-y-4">
              {frequentlyAskedQuestions.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-white/10 bg-[var(--surface)]/60 p-5 open:border-green-400/20"
                >
                  <summary className="cursor-pointer list-none pr-8 font-semibold text-white marker:content-none">
                    {item.question}
                  </summary>
                  <p className="mt-4 border-t border-white/10 pt-4 leading-7 text-gray-400">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>

            <div className="mt-12 rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-7 text-center md:p-10">
              <h2 className="text-2xl font-bold text-white">
                Looking for a specific resource?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-400">
                Tell me what would make your technical project, learning plan,
                or documentation process easier. Useful suggestions can help
                shape future releases.
              </p>
              <Link
                href="/contact"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-black transition hover:bg-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
              >
                Suggest a Resource
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
