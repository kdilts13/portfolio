type HighlightCardProps = {
  label: string;
  title: string;
  body: string;
};

export default function HighlightCard({ label, title, body }: HighlightCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-[#161A20] p-4 shadow-sm">
      <div className="space-y-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#4B5563]">
          {label}
        </p>
        <h3 className="text-sm font-semibold text-[#F9FAFB]">{title}</h3>
        <p className="text-xs text-[#9CA3AF]">{body}</p>
      </div>
    </div>
  );
}
