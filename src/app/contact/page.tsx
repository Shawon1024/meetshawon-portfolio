import ContactForm from "../contact/ContactForm";
import ContactMethods from "../contact/ContactMethods";

export default function ContactPage() {
  return (
    <main>
      <section className="px-6 pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            Get in Touch
          </p>

          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Let&apos;s Start a{" "}
            <span className="text-green-400">
              Conversation
            </span>
          </h1>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-green-400" />

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-300">
            Reach out about cybersecurity graduate opportunities, professional
            networking, technical projects, or collaboration.
          </p>
        </div>
      </section>

      <section className="border-t border-white/5 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <ContactMethods />
          <ContactForm />
        </div>
      </section>
    </main>
  );
}