interface KpiCardProps {
  label: string;
  value: string | number;
  sub: string;
  color?: string;
  onClick?: () => void;
}

export function KpiCard({ label, value, sub, color = 'var(--color-amber)', onClick }: KpiCardProps) {
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`bg-panel dark:bg-panel border border-border dark:border-border p-5 relative overflow-hidden transition-all duration-200 ${
        isClickable
          ? 'cursor-pointer hover:border-amber/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.08)] active:scale-[0.98] active:shadow-none'
          : ''
      }`}
    >
      <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-50" style={{ background: color }} />
      <div className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-muted dark:text-text-muted mb-2">{label}</div>
      <div className="font-['Bebas_Neue'] text-[48px] tracking-wide leading-none mb-1" style={{ color }}>{value}</div>
      <div className="flex items-center gap-1.5">
        <div className="text-[11px] text-text-muted2 dark:text-text-muted2 font-mono">{sub}</div>
        {isClickable && (
          <svg className="w-3 h-3 text-text-muted2 dark:text-text-muted2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
    </div>
  );
}
