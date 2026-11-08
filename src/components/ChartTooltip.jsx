export default function ChartTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-cardhover border border-slate-200 px-3 py-2 text-xs">
      {label && <p className="font-semibold text-navy-900 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2 text-navy-700">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="muted">{p.name}:</span>
          <span className="font-semibold">
            {p.value}
            {unit}
          </span>
        </p>
      ))}
    </div>
  );
}
