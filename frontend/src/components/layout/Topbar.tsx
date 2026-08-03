import type { ReactNode } from 'react';

interface TopbarProps {
  breadcrumb: string;
  onHamburger: () => void;
  right?: ReactNode;
}

export function Topbar({ breadcrumb, onHamburger, right }: TopbarProps) {
  return (
    <div className="h-[60px] border-b border-border dark:border-border flex items-center justify-between px-7 bg-offblack dark:bg-offblack shrink-0">
      <div className="flex items-center gap-2.5">
        <button
          onClick={onHamburger}
          className="flex items-center justify-center w-9 h-9 bg-panel2 dark:bg-panel2 border border-border dark:border-border text-text-muted dark:text-text-muted cursor-pointer md:hidden"
        >
          ☰
        </button>
        <div className="font-mono text-xs text-text-muted dark:text-text-muted">
          SiteDiary / <span className="text-text-white dark:text-text-white">{breadcrumb}</span>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        {right}
      </div>
    </div>
  );
}
