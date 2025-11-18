import StackGroup from '@/app/components/stackGroup';
import SectionHeader from '@/app/components/sectionHeader';

export default function TechStack() {
  return (
    <section id="stack" className="space-y-6">
      <SectionHeader
        eyebrow="Tooling"
        title="Tech I'm comfortable shipping with"
        subtitle="The main technologies I've used to build production systems and portfolio projects."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StackGroup
          title="Front-end"
          items={['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Jest / React Testing Library']}
        />
        <StackGroup
          title="Back-end"
          items={['Java / Spring Boot', 'Elixir / Phoenix', 'Node.js', 'REST APIs', 'PostgreSQL']}
        />
        <StackGroup
          title="Cloud & DevOps"
          items={[
            'GCP (Cloud Run, Artifact Registry)',
            'CI/CD with GitHub Actions',
            'Docker',
            'Terraform (in progress)',
          ]}
        />
      </div>
    </section>
  );
}
