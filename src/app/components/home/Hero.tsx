export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-8">

      <h1 className="text-5xl font-bold">
        Shawon
      </h1>

      <h2 className="mt-4 text-2xl">
        Cybersecurity Student |
        Ethical Hacking Enthusiast |
        Infrastructure Builder
      </h2>

      <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
        Building secure systems, exploring ethical hacking,
        and documenting my cybersecurity journey through
        practical projects and research.
      </p>

      <div className="mt-8 flex gap-4">

        <a
          href="/projects"
          className="rounded-lg bg-black px-6 py-3 text-white"
        >
          View Projects
        </a>

        <a
          href="/contact"
          className="rounded-lg border px-6 py-3"
        >
          Contact Me
        </a>

      </div>

    </section>
  );
}