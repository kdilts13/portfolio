type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export default function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <header className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#4B5563]">{eyebrow}</p>
      <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
      {subtitle && <p className="max-w-2xl text-sm text-[#9CA3AF]">{subtitle}</p>}
    </header>
  );
}
