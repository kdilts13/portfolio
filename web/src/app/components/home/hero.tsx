import HighlightCard from '@/app/components/highlightCard';

export default function Hero() {
  return (
    <section className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
      {/* Left side: intro */}
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
          Software Engineer
        </p>

        <h1 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">
          Hi, I&apos;m <span className="text-primary-blue">Kevin Dilts</span>.
        </h1>

        <p className="max-w-xl text-sm text-body sm:text-base">
          Full-stack engineer who enjoys building clean UIs, reliable APIs, and practical tools. I
          like working with TypeScript, Elixir, Java, Postgres, and GCP.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <a href="#projects" className="btn-primary lg:hidden">
            View my work
          </a>

          <a href="#contact" className="btn-outline">
            Get in touch
          </a>
        </div>
      </div>

      {/* Right side: quick highlight cards */}
      <div className="grid w-full gap-4 sm:grid-cols-2 lg:max-w-md">
        <HighlightCard
          label="Current focus"
          title="Portfolio"
          body="Building a cohesive portfolio with real features. Starting with a national parks tracker, and more on the way."
        />

        <HighlightCard
          label="Strengths"
          title="Full-stack delivery"
          body="My work spans the entire stack, from creating intuitive interfaces to designing fast backend services and managing the infrastructure that supports them."
        />

        <HighlightCard
          label="Looking for"
          title="Backend / full-stack roles"
          body="Remote-friendly engineering teams that care about code quality and reliability."
        />

        <HighlightCard
          label="Location"
          title="Albuquerque, NM"
          body="Open to remote roles across US time zones."
        />
      </div>
    </section>
  );
}
