import SectionHeader from '@/app/components/sectionHeader';

export default function Timeline() {
  return (
    <section id="about" className="space-y-6">
      <SectionHeader eyebrow="About" title="Where I've been and what I'm aiming for" />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
        {/* Left column: narrative */}
        <div className="space-y-4 text-sm text-body">
          <p>
            I&apos;ve spent the last several years building and maintaining full-stack systems:
            front-end work in Phoenix LiveView, React, and Angular; back-end services in Elixir; and
            deployments on modern cloud platforms like GCP.
          </p>
          <p>
            This portfolio uses those skills in self-directed projects with production-style
            infrastructure and a few playful tools that show how I approach problem-solving and UX.
          </p>
          <p>
            I&apos;m currently looking for backend or full-stack roles where I can contribute to
            durable systems, collaborate with a thoughtful team, and keep growing my skills.
          </p>
        </div>

        {/* Right column: highlights card */}
        <div className="card space-y-4 text-sm text-body">
          <h3 className="text-sm font-semibold text-foreground">Recent highlights</h3>
          <ul className="space-y-2">
            <li>• Building this portfolio as a production-style system on GCP.</li>
            <li>• Deepening experience with Java / Spring Boot and CI/CD pipelines.</li>
            <li>• Exploring maps, AI tools, and creative UI patterns.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
