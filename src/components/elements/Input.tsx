import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export function Input({ label, error, leftIcon, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-text)]">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={[
            'w-full rounded-lg border bg-[var(--color-card)] text-[var(--color-text)] placeholder-[var(--color-muted)] transition-colors duration-150 outline-none',
            'focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]',
            error ? 'border-red-500' : 'border-[var(--color-border)]',
            leftIcon ? 'pl-10 pr-4 py-2.5' : 'px-4 py-2.5',
            className,
          ].join(' ')}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
