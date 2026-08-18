import {
  ArrowRight,
  Download,
} from "lucide-react";
import Link from "next/link";

import Container from "../Container";

export default function AboutCTA() {
  return (
    <section className="border-t border-white/5 py-24">
      <Container>
        <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-8 text-center shadow-2xl md:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Explore My Work
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold text-white md:text-4xl">
            See how I am turning cybersecurity learning into practical
            experience
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-400">
            Explore my technical projects, security labs, and self-hosted
            infrastructure work, or download my CV for an overview of my
            education, skills, and professional development.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400"
            >
              View My Projects
              <ArrowRight size={18} />
            </Link>

            <a
              href="/Shawon-CV.pdf"
              download
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 font-medium text-white transition hover:border-green-400 hover:text-green-300"
            >
              Download CV
              <Download size={18} />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}