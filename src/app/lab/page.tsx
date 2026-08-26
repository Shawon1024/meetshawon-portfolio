import type { Metadata } from "next";
import Image from "next/image";
import {
  Activity,
  BadgeCheck,
  Binary,
  Boxes,
  CircleDot,
  Construction,
  Cpu,
  FlaskConical,
  LockKeyhole,
  Network,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react";
import { redirect } from "next/navigation";

import LabAccountActions from "../components/lab/LabAccountActions";
import { createClient } from "../lib/supabase/server";

export const metadata: Metadata = {
  title: "Cybersecurity Lab",
  description:
    "The private Meet Shawon cybersecurity lab portal for authorised learning, testing and infrastructure development.",
  robots: {
    index: false,
    follow: false,
  },
};

const plannedCapabilities = [
  {
    title: "Isolated practice environments",
    description:
      "Controlled virtual networks for authorised security exercises and repeatable technical learning.",
    icon: Boxes,
  },
  {
    title: "Security tooling",
    description:
      "A structured workspace for Linux, network analysis, vulnerability assessment and defensive tooling.",
    icon: TerminalSquare,
  },
  {
    title: "Network experimentation",
    description:
      "Documented experiments covering segmentation, traffic inspection and secure service configuration.",
    icon: Network,
  },
  {
    title: "Evidence-led development",
    description:
      "Lab activity will be recorded as reproducible notes, findings and professional project evidence.",
    icon: FlaskConical,
  },
];

export default async function LabPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/sign-in?lab=1&next=%2F");
  }

  const [profileResult, membershipResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("first_name, last_name, username, avatar_url, role")
      .eq("id", user.id)
      .single(),
    supabase
      .from("lab_access_members")
      .select("access_level, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle(),
  ]);

  const profile = profileResult.data;
  const membership = membershipResult.data;

  if (profileResult.error || !profile) {
    redirect("/access-denied?reason=profile");
  }

  const isAdmin = profile.role === "admin";
  const isLabMember = membership?.status === "active";

  if (!isAdmin && !isLabMember) {
    redirect("/access-denied?reason=membership");
  }

  const fullName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    profile.username ||
    "Authorised user";

  const accessLabel = isAdmin
    ? "Lab Administrator"
    : membership?.access_level === "operator"
      ? "Lab Operator"
      : "Lab Member";

  return (
    <main
      data-service-shell="lab"
      className="relative isolate min-h-dvh overflow-hidden px-5 py-10 sm:px-6 md:py-16"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-emerald-400/[0.08] blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-400/[0.07] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(52,211,153,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.025)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <Image
            src="/logo.png"
            alt="Meet Shawon"
            width={220}
            height={80}
            priority
            className="h-14 w-auto object-contain"
          />

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 backdrop-blur-xl">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt=""
                width={40}
                height={40}
                sizes="40px"
                className="h-10 w-10 rounded-full border border-white/10 object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10 font-semibold text-emerald-300">
                {fullName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {fullName}
              </p>
              <p className="text-xs text-emerald-300">{accessLabel}</p>
            </div>
          </div>
        </header>

        <section className="grid gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
              <Construction size={15} aria-hidden="true" />
              Environment in development
            </div>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.28em] text-emerald-400">
              Meet Shawon Cybersecurity Lab
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              A controlled space for practical security development.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              This private portal will provide authorised access to documented
              cybersecurity labs, isolated test environments and infrastructure
              experiments. The underlying Lab system is not operational yet.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={17} className="text-emerald-300" aria-hidden="true" />
                Authenticated access
              </span>
              <span className="inline-flex items-center gap-2">
                <LockKeyhole size={17} className="text-cyan-300" aria-hidden="true" />
                Explicit authorisation
              </span>
              <span className="inline-flex items-center gap-2">
                <BadgeCheck size={17} className="text-violet-300" aria-hidden="true" />
                Authorised use only
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-emerald-300/15 bg-[#0b2925]/85 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Platform status
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Pre-deployment
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                <Cpu size={24} aria-hidden="true" />
              </div>
            </div>

            <div className="mt-7 space-y-3">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/15 p-4">
                <span className="inline-flex items-center gap-2 text-sm text-slate-300">
                  <CircleDot size={16} className="text-amber-300" aria-hidden="true" />
                  Lab hardware
                </span>
                <span className="text-sm font-medium text-amber-200">Pending</span>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/15 p-4">
                <span className="inline-flex items-center gap-2 text-sm text-slate-300">
                  <Binary size={16} className="text-cyan-300" aria-hidden="true" />
                  Portal foundation
                </span>
                <span className="text-sm font-medium text-emerald-300">Available</span>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/15 p-4">
                <span className="inline-flex items-center gap-2 text-sm text-slate-300">
                  <Activity size={16} className="text-violet-300" aria-hidden="true" />
                  Remote environments
                </span>
                <span className="text-sm font-medium text-slate-400">Offline</span>
              </div>
            </div>

            <p className="mt-6 text-sm leading-6 text-slate-400">
              Access has been verified successfully. No Lab workloads or remote
              systems are currently exposed through this portal.
            </p>
          </div>
        </section>

        <section className="border-t border-white/10 py-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
              Planned workspace
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              Designed for deliberate, documented practice
            </h2>
            <p className="mt-4 leading-7 text-slate-400">
              Features will be introduced gradually after the dedicated Lab
              hardware, network boundaries and operational safeguards have been
              tested.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {plannedCapabilities.map((capability) => {
              const Icon = capability.icon;

              return (
                <article
                  key={capability.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition hover:border-emerald-300/25 hover:bg-emerald-300/[0.035]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <Icon size={21} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {capability.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {capability.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mb-10 rounded-[2rem] border border-emerald-300/15 bg-emerald-300/[0.045] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <LockKeyhole size={21} className="text-emerald-300" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-white">
                  Private and authorised environment
                </h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                All future activity must be legal, ethical, explicitly
                authorised and confined to approved systems. Access may be
                reviewed or withdrawn at any time.
              </p>
            </div>

            <LabAccountActions />
          </div>
        </section>

        <footer className="border-t border-white/10 py-7 text-center text-xs text-slate-500">
          Copyright © {new Date().getFullYear()} Md Samsudduha Shawon. Lab access is restricted.
        </footer>
      </div>
    </main>
  );
}