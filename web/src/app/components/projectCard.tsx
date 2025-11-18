type ProjectCardProps = {
  title: string;
  role: string;
  tech: string;
  description: string;
};

export default function ProjectCard({ title, role, tech, description }: ProjectCardProps) {
  return (
    <article className="flex flex-col justify-between rounded-2xl bg-[#161A20] p-5 shadow-sm">
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-[#F9FAFB]">{title}</h3>
        <p className="text-xs font-medium text-[#9CA3AF]">{role}</p>
        <p className="text-xs text-[#6B7280]">{tech}</p>
      </div>
      <p className="mt-3 text-sm text-[#D1D5DB]">{description}</p>
    </article>
  );
}
