const severityConfig = {
  LOW: { color: 'var(--color-green)', bg: 'rgba(34,197,94,0.1)' },
  MEDIUM: { color: 'var(--color-amber)', bg: 'var(--color-amber-glow)' },
  HIGH: { color: 'var(--color-red)', bg: 'rgba(239,68,68,0.12)' },
  CRITICAL: { color: '#ff6b6b', bg: 'rgba(239,68,68,0.22)' },
};

interface SevBadgeProps {
  severity: string;
}

export function SevBadge({ severity }: SevBadgeProps) {
  const config = severityConfig[severity as keyof typeof severityConfig] || severityConfig.LOW;
  return (
    <span
      className="font-mono text-[10px] tracking-[0.5px] px-1.5 py-0.5 rounded-sm"
      style={{ background: config.bg, color: config.color }}
    >
      {severity}
    </span>
  );
}
