import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="mb-5">
        {label && (
          <label className="block font-mono text-[11px] tracking-[1.5px] uppercase text-text-muted dark:text-text-muted mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-panel dark:bg-panel border border-border dark:border-border text-text-white dark:text-text-white px-4 py-3 text-sm outline-none transition-all duration-200',
            'focus:border-amber focus:shadow-[0_0_0_3px_rgba(245,158,11,0.12)]',
            error && 'border-red',
            className
          )}
          {...props}
        />
        {error && (
          <div className="text-red text-[11px] mt-1.5 font-mono">{error}</div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
