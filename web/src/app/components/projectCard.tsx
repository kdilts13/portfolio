type ProjectCardProps = {
  title: string;
  role: string;
  tech: string;
  description: string;
};

export default function ProjectCard({ title, role, tech, description }: ProjectCardProps) {
  return (
    <article className="flex flex-col justify-between rounded-lg bg-card p-5 shadow-sm">
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-xs font-medium text-muted">{role}</p>
        <p className="text-xs text-muted">{tech}</p>
      </div>
      <p className="mt-3 text-sm text-body">{description}</p>
    </article>
  );
}
