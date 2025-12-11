type ProjectCardProps = {
  title: string;
  role: string;
  tech: string;
  description: string;
};

export default function ProjectCard({ title, role, tech, description }: ProjectCardProps) {
  return (
    <article className="card flex h-full flex-col gap-3">
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-xs font-medium text-muted">{role}</p>
        <p className="text-xs text-muted">{tech}</p>
      </div>
      <p className="text-sm text-body">{description}</p>
    </article>
  );
}
