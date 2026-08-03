import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-amber text-black hover:bg-amber-dim',
    outline: 'border border-border-md dark:border-border-md text-text-white dark:text-text-white hover:border-amber hover:text-amber',
    ghost: 'text-text-muted dark:text-text-muted hover:text-text-white dark:hover:text-text-white',
    danger: 'border border-red/25 bg-red-dim text-red hover:bg-red/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
