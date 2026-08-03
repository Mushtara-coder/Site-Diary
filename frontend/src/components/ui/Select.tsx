import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, children, ...props }, ref) => {
    return (
      <div className="mb-5">
        {label && (
          <label className="block font-mono text-[11px] tracking-[1.5px] uppercase text-text-muted dark:text-text-muted mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full bg-panel dark:bg-panel border border-border dark:border-border text-text-white dark:text-text-white px-4 py-3 text-sm outline-none transition-all duration-200 appearance-none cursor-pointer',
            'focus:border-amber focus:shadow-[0_0_0_3px_rgba(245,158,11,0.12)]',
            error && 'border-red',
            className
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(245,244,240,0.4)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 16px center',
          }}
          {...props}
        >
          {children}
        </select>
        {error && (
          <div className="text-red text-[11px] mt-1.5 font-mono">{error}</div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
