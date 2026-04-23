interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <span
      className={[
        'inline-block rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)] animate-spin',
        sizeClasses[size],
        className,
      ].join(' ')}
    />
  );
}
