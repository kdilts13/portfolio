import ProjectCard from '@/app/components/projectCard';
import SectionHeader from '@/app/components/sectionHeader';

export default function FeaturedProjects() {
  return (
    <section id="projects" className="space-y-6">
      <SectionHeader
        eyebrow="Featured work"
        title="Projects that represent how I build"
        subtitle="A mix of real-world systems and portfolio pieces that show my approach to designing, implementing, and shipping features."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <ProjectCard
          title="Portfolio Platform"
          role="Full-stack • In-progress"
          tech="Next.js · TypeScript · Tailwind · Spring Boot · GCP Cloud Run"
          description="A unified portfolio site with an authenticated dashboard, real API integration, and production-grade CI/CD."
        />
        <ProjectCard
          title="National Parks Explorer"
          role="Front-end / Maps"
          tech="Next.js · Maps API · Firestore"
          description="A map-based tool to track visited parks, plan trips, and store notes, designed to highlight UX and data modeling."
        />
      </div>
    </section>
  );
}
