export default function Card({ title, subtitle, action, children, className = '', bodyClass = '' }) {
  return (
    <div className={`card ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="min-w-0">
            {title && <h3 className="section-title">{title}</h3>}
            {subtitle && <p className="text-xs muted mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClass}`}>{children}</div>
    </div>
  );
}
