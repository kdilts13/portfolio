import SectionHeader from '@/app/components/sectionHeader';

export default function Hero() {
  return (
    <section id="about" className="space-y-6">
      <SectionHeader eyebrow="About" title="Where I've been and what I'm aiming for" />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
        <div className="space-y-4 text-sm text-[#D1D5DB]">
          <p>
            I&apos;ve spent the last several years building and maintaining full-stack systems:
            front-end work in React and Angular, back-end services in Java and Elixir, and
            deployments on modern cloud platforms.
          </p>
          <p>
            This portfolio pulls those experiences into one place: real projects, production-style
            infrastructure, and some playful tools that show how I approach problem solving and UX.
          </p>
          <p>
            I&apos;m currently looking for backend or full-stack roles where I can contribute to
            durable systems, collaborate with a thoughtful team, and keep growing my skills.
          </p>
        </div>

        <div className="space-y-4 rounded-2xl bg-[#161A20] p-4 text-sm text-[#E5E7EB]">
          <h3 className="text-sm font-semibold text-white">Recent highlights</h3>
          <ul className="space-y-2">
            <li>• Building this portfolio as a production-style system on GCP.</li>
            <li>• Deepening experience with Java / Spring Boot and CI/CD pipelines.</li>
            <li>• Exploring maps, game-adjacent tools, and creative UI patterns.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
