import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="mb-5">
        {label && (
          <label className="block font-mono text-[11px] tracking-[1.5px] uppercase text-text-muted dark:text-text-muted mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full bg-panel dark:bg-panel border border-border dark:border-border text-text-white dark:text-text-white px-4 py-3 text-sm outline-none transition-all duration-200 resize-y min-h-[90px]',
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

Textarea.displayName = 'Textarea';
