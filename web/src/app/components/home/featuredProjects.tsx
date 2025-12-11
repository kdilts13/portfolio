import ProjectCard from '@/app/components/projectCard';
import SectionHeader from '@/app/components/sectionHeader';

export default function FeaturedProjects() {
  return (
    <section id="projects" className="space-y-6">
      <SectionHeader
        eyebrow="Featured work"
        title="Projects that represent how I build"
        subtitle="Portfolio projects that reflect how I approach UX, APIs, and infrastructure."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <ProjectCard
          title="Portfolio Platform"
          role="Full-stack • In-progress"
          tech="Next.js · TypeScript · Tailwind · Spring Boot · GCP Cloud Run"
          description="A cohesive platform that brings my projects together and shows how I structure UI, API, and deployment layers into a single, maintainable system."
        />
        <ProjectCard
          title="National Parks Explorer"
          role="Front-end / Maps"
          tech="Next.js · Maps API · Firestore"
          description="A map-based tool to browse national parks and track which ones you've visited. Built to highlight UX, data modeling, and integration with real APIs."
        />
      </div>
    </section>
  );
}
