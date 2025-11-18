type StackGroupProps = {
  title: string;
  items: string[];
};

export default function StackGroup({ title, items }: StackGroupProps) {
  return (
    <div className="rounded-2xl bg-[#161A20] p-4">
      <h3 className="mb-2 text-sm font-semibold text-[#F9FAFB]">{title}</h3>
      <ul className="space-y-1 text-xs text-[#D1D5DB]">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
