import ProjectCard from '@/app/components/projectCard';
import SectionHeader from '@/app/components/sectionHeader';

export default function Experiments() {
  return (
    <section id="experiments" className="space-y-6">
      <SectionHeader
        eyebrow="Side projects"
        title="Playful tools & experiments"
        subtitle="Smaller projects that show how I explore new APIs, game design, and interactive UI ideas."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <ProjectCard
          title="Helldivers Loadout Randomizer"
          role="Gameplay tool"
          tech="Next.js · OpenAI API"
          description="A loadout randomizer with AI-generated tactical briefings for each build, mixing API design with a bit of fun."
        />
        <ProjectCard
          title="Sandbox / Experiments"
          role="Prototypes"
          tech="React · CSS · Various APIs"
          description="A rotating collection of micro-experiments: UI prototypes, data visualizations, and small backend utilities."
        />
      </div>
    </section>
  );
}
