type HighlightCardProps = {
  label: string;
  title: string;
  body: string;
};

export default function HighlightCard({ label, title, body }: HighlightCardProps) {
  return (
    <div className="card flex flex-col justify-between p-4">
      <div className="space-y-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">{label}</p>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted">{body}</p>
      </div>
    </div>
  );
}
