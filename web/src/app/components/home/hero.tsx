import HighlightCard from '@/app/components/highlightCard';

export default function Hero() {
  return (
    <section className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
      {/* Left side: intro */}
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#4B5563]">
          Software Engineer
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">
          Hi, I&apos;m <span className="text-[#3B82F6]">Kevin Dilts</span>.
        </h1>
        <p className="max-w-xl text-sm text-[#9CA3AF] sm:text-base">
          Full-stack engineer who enjoys building clean UIs, reliable APIs, and practical tools. I
          like working with Next.js, TypeScript, and Java on cloud-native systems.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="#projects"
            className="inline-flex items-center justify-center rounded-full bg-[#3B82F6] px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
          >
            View my work
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-[#4B5563] px-5 py-2 text-sm font-medium text-[#E5E7EB] hover:border-[#6B7280] hover:bg-[#161A20]"
          >
            Download résumé
          </a>
        </div>
      </div>

      {/* Right side: quick highlight cards */}
      <div className="grid w-full gap-4 sm:grid-cols-2 lg:max-w-md">
        <HighlightCard
          label="Current focus"
          title="Portfolio & platform"
          body="Building a cohesive portfolio with real features: national parks tracker, Helldivers tools, and more."
        />
        <HighlightCard
          label="Strengths"
          title="Full-stack delivery"
          body="From React/Next.js front-ends to Spring Boot APIs and infrastructure on GCP."
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
