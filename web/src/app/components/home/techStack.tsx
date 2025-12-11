import StackGroup from '@/app/components/stackGroup';
import SectionHeader from '@/app/components/sectionHeader';

export default function TechStack() {
  return (
    <section id="stack" className="space-y-6">
      <SectionHeader
        eyebrow="Tooling"
        title="Tech I'm comfortable shipping with"
        subtitle="The main technologies I've used in production and portfolio projects."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StackGroup
          title="Front-end"
          items={[
            'React',
            'Next.js',
            'Angular',
            'TypeScript',
            'Tailwind CSS',
            'CSS (Sass/SCSS)',
            'Jest and React Testing Library',
          ]}
        />
        <StackGroup
          title="Back-end"
          items={[
            'Java / Spring Boot',
            'Elixir / Phoenix',
            'Node.js',
            'RESTful APIs',
            'Auth systems (JWT, session-based, Firebase Auth)',
            'PostgreSQL',
            'Elasticsearch (search, filtering, and aggregations)',
            'Database migrations with Flyway',
            'ORMs (Ecto, Spring Data JPA)',
            'Schema and query design',
            'WordPress as a headless CMS (content retrieval and API integration)',
          ]}
        />
        <StackGroup
          title="Cloud & DevOps"
          items={[
            'GCP (Cloud Run, Artifact Registry, Firestore)',
            'CI/CD with GitHub Actions, Jenkins, and CircleCI',
            'Docker',
            'Terraform',
            'Service accounts and IAM permissions',
            'AWS (S3, preview environments on Kubernetes)',
            'Azure (project collaboration)',
            'Splunk (log analysis)',
            'Datadog (monitoring and observability)',
          ]}
        />
      </div>
    </section>
  );
}
