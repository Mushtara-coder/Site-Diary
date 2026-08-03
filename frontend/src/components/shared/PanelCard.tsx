import { type ReactNode } from 'react';

interface PanelCardProps {
  children: ReactNode;
  className?: string;
}

export function PanelCard({ children, className = '' }: PanelCardProps) {
  return (
    <div className={`bg-panel dark:bg-panel border border-border dark:border-border p-7 mb-5 ${className}`}>
      {children}
    </div>
  );
}

interface PanelHeaderProps {
  title: string;
  badge?: string;
  right?: ReactNode;
}

export function PanelHeader({ title, badge, right }: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5 pb-4 border-b border-border dark:border-border">
      <div className="font-['Bebas_Neue'] text-xl tracking-wide">{title}</div>
      {badge && (
        <span className="font-mono text-[10px] tracking-wider text-amber px-2.5 py-1 border border-amber/30 bg-amber-glow dark:bg-amber-glow">
          {badge}
        </span>
      )}
      {right}
    </div>
  );
}
