import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

import Container from "../components/Container";

export default function CertificationsCTA() {
  return (
    <section className="border-t border-white/5 py-20">
      <Container>
        <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-8 text-center md:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Beyond the Credentials
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold text-white md:text-4xl">
            Applying knowledge through practical technical work
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-400">
            My education and training are supported by hands-on projects
            involving cybersecurity, secure infrastructure, self-hosting,
            networking, and practical problem-solving.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400"
            >
              Explore My Projects
              <ArrowRight size={18} aria-hidden="true" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 font-medium text-white transition hover:border-green-400 hover:text-green-300"
            >
              Contact Me
              <Mail size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}